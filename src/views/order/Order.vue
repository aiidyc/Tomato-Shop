<template>

    <div id="order" >
         <!--订单返回导航-->
         <van-nav-bar
                 title="确认订单"
                 left-text="返回"
                 left-arrow
                 :fixed="true"
                 :border='true'
                 @click-left="onClickLeft"
         ></van-nav-bar>

         <!-- 添加联系人信息 -->
         <van-contact-card
                 :type="address_type"
                 @click="chooseAddress"
                 add-text="添加订单联系人信息"
                 style="margin-top: 3rem"
                 :name="address_name"
                 :tel="address_phone"
         ></van-contact-card>
         <!--vant单元格组(送达时间和产品内容)-->
        <van-cell-group style="margin-top: 0.5rem">
            <van-cell title="送达时间" :value="arriveTime" is-link @click="selectTime()"></van-cell>
            <!--全部待结算商品-->
            <router-link :to="{path: '/confirmOrder/orderDetail'}">
            <van-cell :value="`共${goodsCount}件`" is-link :center="true" >
                <template slot="title">
                    <img :src="shop.small_image" style="width: 3rem;" v-for="(shop,index) in threeShopCart">
                </template>
            </van-cell>
            </router-link>
        </van-cell-group>
        <!--vant单元格组(支付方式)-->
        <van-cell-group style="margin-top: 0.5rem">
            <van-cell title="支付方式" value="微信" ></van-cell>
        </van-cell-group>
        <!--vant单元格组(备注 金额 配送费)-->
        <van-cell-group style="margin-top: 0.5rem">
            <van-cell title="备注" :center="true">
                <input style="text-align: right" type="text" placeholder="选填,请备注你的需求!"  v-model="notice">
            </van-cell>
        </van-cell-group>
        <van-cell-group style="margin-top: 0.5rem">
            <van-cell title="商品金额" :value="`￥${totalPrice}`" ></van-cell>
            <van-cell title="配送费" :value="`￥${disPrice}`" ></van-cell>
        </van-cell-group>
        <!--提交订单-->
        <van-submit-bar
                label="实付"
                :price="totalPrice*100+disPrice*100"
                button-text="提交订单"
                @submit="onSubmit"
        ></van-submit-bar>

        <!--vant时间选择弹窗-->
        <van-popup v-model="dateShow" round position="bottom" >
            <van-datetime-picker
                    @confirm="selectTimeOk"
                    @cancel='selectTimeCancel'
                    v-model="currentDate"
                    type="datetime"
                    :min-date="minDate"
                    :max-date="maxDate"
            ></van-datetime-picker>
        </van-popup>

        <!--付款二维码弹窗-->
        <van-popup v-model="isPay" round position="center" >
            <img src="./images/qrcode.jpg" style="width: 14rem">
        </van-popup>
        <!--地址子组件路由出口-->
        <transition
                enter-active-class="animated fadeInRight"
                leave-active-class="animated fadeOutRight"
                :duration="{enter:180,leave:300}"
        >
            <router-view ></router-view>
        </transition>

    </div>


</template>

<script>
    //引入时间插件
    import moment from 'moment'
    import PubSub from 'pubsub-js';
    import {mapState} from 'vuex'
    import {Toast} from 'vant'
    import animate from 'animate.css'
    //引入订单接口
    //1提交订单,2 订单支付成功 3查询订单,4删除已提交订单的商品,5获取支付链接,6查询支付记录
    import {postOrder,orderPaySuccess,getOrder,delAllSelectedGoods,getWXCode,queryPayStatus} from "../../service/api";
    //引入购物选中商品查询接口
    import {getAllSelectedGoods} from "../../service/api";

    export default {
        name: "Order",  data() {
            return {
                //1地址
                address_type:'add', // 地址卡片类型
                address_name: null, // 收货人
                address_phone: null, // 收货人电话
                address_id: null, // 收货人地址ID

               //2时间选择
                dateShow:false,//是否展示时间选择框
                minDate: new Date(),//最小可选时间
                maxDate: new Date(2020, 10, 1),//最大可选时间
                currentDate:new Date(),//当前时间
                arriveTime:'请选择送达时间',//送达时间
            //    备注
                notice:null,
            //    是否打开支付弹窗
                isPay:false



            };
        },
        computed:{
            ...mapState(['shopCart','userInfo']),
            // 商品总件数
            goodsCount(){
                let selectedGoodsCount = 0;
                Object.values(this.shopCart).forEach((goods, index)=>{
                    if(goods.checked){
                        selectedGoodsCount += 1;
                    }
                });
                return selectedGoodsCount;
            },
            // 商品总价
            totalPrice(){
                let totalPrice = 0;
                Object.values(this.shopCart).forEach((goods, index)=>{
                    if(goods.checked){
                        totalPrice += goods.price * goods.num;
                    }
                });
                return totalPrice.toFixed(2);
            },
            //  取购物车中前三件选中的
            threeShopCart(){
                let shopCart = [];
                Object.values(this.shopCart).forEach((goods, index)=>{
                    if(goods.checked){
                        shopCart.push(goods);
                    }
                });
                return shopCart.slice(0, 3);
            },
            // 配送费
            disPrice(){
                // 商品总价 > 40 免配送费  <40 6元
                if(this.totalPrice > 40){
                    return 0;
                }else {
                    return 6;
                }
            }
        },
        mounted() {
            //接受子组件传过来的地址信息
            PubSub.subscribe('addCurrentAddress',(msg,item)=>{
                if(msg==='addCurrentAddress'){
                    // 拿到选中的地址信息
                    console.log(item);
                    this.address_name=item.name;
                    this.address_phone=item.tel;
                    this.address_id=item.address_id;
                    this.address_type='edit'
                }
            })

        },
        methods:{
            //返回
            onClickLeft(){
                this.$router.back()

            },
            //选择地址
            chooseAddress(){
                //跳转到选择地址
                this.$router.push('/confirmOrder/myaddress')

            },
            //选择时间弹窗
            selectTime(){
                //选好后点击 隐藏
                this.dateShow=true
            },
            //选择时间弹窗-确认按钮
            selectTimeOk(value){
                //1格式化选中的时间,并赋值给data
                let arriveTime=moment(value).format('YYYY-MM-DD HH:mm ')
                // console.log(arriveTime);
                this.arriveTime=arriveTime;
                //2关闭时间选框
                this.dateShow=false
            },
            //选择时间弹窗-取消按钮
            selectTimeCancel(){
                alert(2)

            },
            //提交订单
            async onSubmit(){
                //1校验
                if(!this.address_id){
                    Toast('请选择地址');
                    return
                }else if(this.arriveTime==='请选择送达时间'){
                    Toast('请选择配送时间');
                    return
                }else if(!this.notice){
                    Toast('请备注');
                    return
                }
                //2订单系列操作(含服务器接口)
                if(this.userInfo.token){//提交订单前判断用户是否登录
                    //请求选中商品
                    let goodsResult=await getAllSelectedGoods(this.userInfo.token)
                    if(goodsResult.success_code===200){
                        //生成订单
                        let orderResult=await postOrder(this.userInfo.token, this.address_id, this.arriveTime, goodsResult, this.notice,this.totalPrice
                        ,this.disPrice);
                        if(orderResult.success_code===200){
                        // 从购物车删除已放入订单的商品
                            let delResult=await delAllSelectedGoods(this.userInfo.token);
                            // console.log(delResult);
                            if(delResult.success_code===200){
                            //支付环节,支付成功验证成功后才能进行下一步
                            //     let urlResult=await getWXCode(orderResult.data.order_id,1);
                            //     console.log(urlResult);
                               this.isPay=true;
                            //    通知自己服务器支付成功
                                let statusResult=await orderPaySuccess(this.userInfo.token,orderResult.data.order_id);
                                console.log(statusResult);
                                if(statusResult.success_code===200){
                                //    订单处理都成功后跳转到我的界面
                                    this.$router.push('/dashboard/mine');
                                    window.sessionStorage.setItem('currentActiveIndex','3')
                                }else {
                                    Toast('服务器订单未处理成功');
                                }

                            }else {
                                Toast('购物车同步失败');
                            }

                        }else {
                            Toast('生成订单失败');
                        }
                    }
                }else {
                    Toast('未登录 请重新登录')
                }
            }

        },
        beforeDestroy() {
            //及时销毁订阅
            PubSub.unsubscribe('addCurrentAddress')
        }
    }
</script>

<style scoped>
#order{
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;

}
</style>