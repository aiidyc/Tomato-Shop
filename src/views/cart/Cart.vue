<template>
    <div v-if="userInfo.token"  id="cart">
        <!--头部区域-->
        <header class="titleWrapper">
            <h4><strong>购物车</strong></h4>
            <button class="clearCart" @click="clearCart">清空购物车</button>
        </header>
        <div class="contentWrapper">
            <!--中间item内容-->
            <main  v-if="Object.keys(shopCart).length>0" class="contentWrapperList">
                <section>
                    <div class="shopCartListCon" v-for="(shop,index) in shopCart" :key="shop.id">
                        <div class="left">
                            <a href="javascript:;" class="cartCheckBox" :checked="shop.checked" @click.stop="singerGoodsSelect(shop.id)"></a>
                        </div>
                        <div class="center">
                            <img :src="shop.small_image" alt="">
                        </div>
                        <div class="right">
                            <a href="#">{{shop.name}}</a>
                            <div class="bottomContent">
                                <p class="shopPrice">{{shop.price}}</p>
                                <div class="shopDeal">
                                    <span @click="removeOutCart(shop.id,shop.num)">-</span>
                                    <input disabled type="number" v-model="shop.num">
                                    <span @click="addToCart(shop.id,shop.name,shop.small_image,shop.price)">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <div v-else>购物车空空如也 快去添加吧</div>
            <!--底部通栏-->
            <div  class="tabBar">
                <div class="tabBarLeft">
                    <a href="javascript:;" class="cartCheckBox"
                    :checked="isSelectedAll"
                    @click.stop="selectedAll(isSelectedAll)"
                    ></a>
                    <span style="font-size: 16px;" >全选</span>
                    <div class="selectAll">
                        合计：<span class="totalPrice">{{totalPrice|moneyFormat}}</span>
                    </div>
                </div>
                <div class="tabBarRight">
                    <button  class="pay" @click.prevent="toPay">去结算{{goodsNumTotal}}</button>
                </div>
            </div>
        </div>
    </div>
    <SelectLogin v-else/>
</template>

<script>
    //引入vuex
    import {mapState,mapMutations} from 'vuex'
    //引入vant弹窗提示
    import{Dialog} from 'vant'
    import {Toast} from 'vant'
    //引入组件
    import SelectLogin from './../login/SelectLogin'
    //引入1购物车接口,2商品选中状态更改接口
    import {changeCartNum,clearAllCart,singerGoodsSelect,allGoodsSelect} from "../../service/api";


    export default {
        name: "Cart",
        components:{
            SelectLogin
        },
        computed:{
            ...mapState(['shopCart','userInfo']),
            //是否全选
            isSelectedAll(){
                let tag=true;
                //遍历数组,有一个false就不是全选
                Object.values(this.shopCart).forEach((goods,index)=>{
                    if(!goods.checked){
                        tag=false
                    }
                });
                tag=tag&&Object.values(this.shopCart).length>0;
                return tag
            },
            //付款总价
            totalPrice(){
                let total=0;
                //遍历计算所有选中的商品总价
                Object.values(this.shopCart).forEach((goods,index)=>{
                    if(goods.checked){
                        let singleGoodsPrice=goods.price*goods.num
                        total+=singleGoodsPrice
                    }
                });
                return total
            },
            //选中商类型总量
            goodsNumTotal(){
                //计算选中商品数组长度
                let newArr=Object.values(this.shopCart);
                let num=newArr.filter(goods=>goods.checked).length;
                return num
            }

        },
        methods:{
            ...mapMutations(['REDUCE_CART','ADD_GOODS','SELECTED_SINGER_GOODS','SELECTED_All_GOODS','CLEAR_CART']),
            //移除商品(购物车) REDUCE_CART函数根据条件减1或删除
            async removeOutCart(goodsId,goodsNum){
                if(goodsNum>1){
                    let result=await changeCartNum(this.userInfo.token,goodsId,'reduce');
                    console.log(result);
                    if(result.success_code===200){
                        //服务器-1成功 同步执行本地-1
                        this.REDUCE_CART({goodsId})
                    }else {
                        Toast({
                            message:'服务器商品-1失败,看下传的参数是不是有问题还是接口有问题',
                            duration:400
                        })
                    }

                }else {
                    Dialog.confirm({
                        title: '番茄提示',
                        message: '您确定删除吗?'
                    }).then(async () => {
                        // on confirm点确认就执行这段函数
                        let result=await changeCartNum(this.userInfo.token,goodsId,'reduce');
                        console.log(result);
                        if(result.success_code===200){
                            //服务器-1或删除成功 同步执行本地-1或删除商品
                            this.REDUCE_CART({goodsId})
                        }else {
                            Toast({
                                message:'服务器商品-1失败,看下传的参数是不是有问题还是接口有问题',
                                duration:400
                            })
                        }
                    }).catch(() => {
                        // on cancel 什么都不做 不用写代码
                    });
                }

    },
            //添加商品数量-复用mutation函数根据条件添加已有商品数量,或新增单品对象
            async addToCart(goodsId,goodsName,smallImage,goodsPrice){
                let result=await changeCartNum(this.userInfo.token,goodsId,'add');
                    //1服务器添加成功
                console.log(result);
                if(result.success_code===200){
                    //2同步添加到vuex和local
                    this.ADD_GOODS({goodsId,goodsName,smallImage,goodsPrice})
                }else {
                    Toast({
                        message:'服务器商品+1失败,看下传的参数是不是有问题还是接口有问题',
                        duration:400
                    })
                }

            },
            //服务器同步,商品单选与取消
            async singerGoodsSelect(goodsId){

                let result=await singerGoodsSelect(this.userInfo.token,goodsId);
                //1服务器添加成功
                console.log(result);
                if(result.success_code===200){
                    //2服务器改变单选状态成功后 同步到本地
                    this.SELECTED_SINGER_GOODS({goodsId})
                }



            },
            //服务器同步,商品全选与全取消
            async selectedAll(isSelectedAll){
                //用计算属性返回是否全选的参考值 再取反
                let SelectedAll=!isSelectedAll;
                let result=await allGoodsSelect(this.userInfo.token,isSelectedAll);
                //1服务器添加成功
                console.log(result);
                if(result.success_code===200){
                    //2服务器成功后 改变本地所有的选中状态
                    this.SELECTED_All_GOODS({SelectedAll});
                }
            },
        //    清空购物车
            clearCart(){
                //弹框提示插件 vant函数需在当前页面引入方法 如Dialog
                Dialog.confirm({
                    title: '番茄提示',
                    message: '您确定要清空购物车吗?'
                }).then(async () => {
                    // on confirm点确认就执行这段函数
                    let result=await clearAllCart(this.userInfo.token);
                    console.log(result);
                    if(result.success_code===200){
                        this.CLEAR_CART()
                    }else {
                        Toast({
                            message:'服务器清空商品失败,看下传的参数是不是有问题还是接口有问题',
                            duration:400
                        })
                    }
                }).catch(() => {
                    // on cancel 什么都不做 不用写代码
                });

            },
            // 提交订单
            toPay(){
                //根据价格判断用户是否有勾选商品
                if(this.goodsNumTotal>0){
                    this.$router.push('/confirmOrder')
                }else {
                   Toast({
                       message:'番茄小提示,请您先选购商品再结算订单',
                       duration:700
                   })
                }

            }

        },

    }
</script>

<style lang="less" scoped>
    #cart{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }

    .titleWrapper{
        width: 100%;
        height: 2.6rem;
        background: #fff;
        -webkit-background-size: 0.1rem 4.4rem;
        background-size: 0.1rem 4.4rem;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .titleWrapper .clearCart{
        position: absolute;
        right: 0.2rem;
        background-color: transparent;
        color:red;
        font-size: 0.8rem;
}
    .contentWrapper{
        padding-top: 3.5rem;
    }

    /*列表内容*/
    .contentWrapperList{
        padding-bottom: 6rem;
    }

    .contentWrapperList section{
        background-color: #fff;
    }

    .cartCheckBox{
        background: url("./images/shop-icon.png") no-repeat;
        -webkit-background-size: 2.5rem 5rem;
        background-size: 2.5rem 5rem;
        width: 1rem;
        height: 1rem;
    }

    .cartCheckBox[checked]{
        background-position: -1.2rem 0;
    }

    .shopCartListCon{
        display: flex;
        height: 6rem;
        border-bottom:  0.01rem solid #e0e0e0;
        margin-bottom: 0.7rem;
        padding: 0.5rem 0;
    }

    .shopCartListCon .left{
        /*background: purple;*/
        flex: 1;
        display: flex;
        /*justify-content: center;*/
    }

    .shopCartListCon .left a{
        display: inline-block;
        margin-top: 0.8rem;
        margin-left: 0.5rem;
    }


    .shopCartListCon .center{
        /*background: blue;*/
        flex: 3;
    }

    .shopCartListCon .center img{
        width: 100%;
        height: 100%;
    }

    .shopCartListCon .right{
        /*background: orangered;*/
        flex: 6;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 0.5rem;
        margin-right: 0.5rem;

        position: relative;
    }

    .shopCartListCon .right a{
        height: 2.2rem;
        line-height: 1.2rem;
        overflow: hidden;
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
        color: #000;
    }

    .shopCartListCon .bottomContent{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .shopCartListCon .bottomContent .shopPrice{
        font-size: 0.8rem;
    }

    .shopCartListCon .right .shopDeal span{
        display: inline-block;
        width: 1rem;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        float: left;
    }

    .shopCartListCon .right .shopDeal input{
        float: left;
        width: 2rem;
        height: 1.2rem;
        text-align: center;
        margin: 0 0.2rem;
        font-size: 0.8rem;
    }

    /*底部通栏*/
    .tabBar{
        position: fixed;
        left:0;
        bottom:2.7rem;
        width:100%;
        height: 2.5rem;
        background-color: #fff;

        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 0.01rem solid #e0e0e0;
    }

    .tabBarLeft{
        display: flex;
        align-items: center;
        margin-left: 0.5rem;
    }

    .tabBarLeft .selectAll{
        margin-left: 1rem;
        font-size: 1rem;
    }

    .totalPrice{
        color: #E9232C;
    }


    .tabBarRight .pay{
        width:5rem;
        height: 2rem;
        background-color: #E9232C;
        border-radius: 1rem;
        margin-right: 0.5rem;

        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        color: #fff;
    }
</style>