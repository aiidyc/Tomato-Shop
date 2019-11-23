<template>
    <div id="dashboard">
        <van-tabbar v-model="active" active-color="#75a342">
            <van-tabbar-item  replace to="/dashboard/home">
                <span>首页</span>
                <img slot="icon" slot-scope="props" :src="props.active ? home_icon.active : home_icon.normal">
            </van-tabbar-item>
            <van-tabbar-item  replace to="/dashboard/category">
                <span>分类</span>
                <img slot="icon" slot-scope="props" :src="props.active ? category_icon.active : category_icon.normal">
            </van-tabbar-item>
            <van-tabbar-item  replace to="/dashboard/cart" :info="goodsNum>0?goodsNum:''">
                <span>购物车</span>
                <img slot="icon" slot-scope="props" :src="props.active ? cart_icon.active : cart_icon.normal">
            </van-tabbar-item>
            <van-tabbar-item replace to="/dashboard/mine">
                <span>我的</span>
                <img slot="icon" slot-scope="props" :src="props.active ? mine_icon.active : mine_icon.normal">
            </van-tabbar-item>
        </van-tabbar>

        <!--被keep-alive包住的只加载一次-->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
    </div>
</template>

<script>
    import {getGoodsCart} from "../../service/api";
    import {mapState,mapMutations,mapActions} from 'vuex'
    import {setStore} from "../../config/global";

    export default {
        name: "Dashboard",
        data() {
            return {
                active:Number(sessionStorage.getItem('currentActiveIndex'))|| 0,
                home_icon: {
                    normal: require('@/images/tabbar/home_default.png'),
                    active: require('@/images/tabbar/home_selected.png')
                },
                category_icon: {
                    normal: require('@/images/tabbar/category_default.png'),
                    active: require('@/images/tabbar/category_selected.png')
                },
                cart_icon: {
                    normal: require('@/images/tabbar/shoppingcart_default.png'),
                    active: require('@/images/tabbar/shoppingcart_selected.png')
                },
                mine_icon: {
                    normal: require('@/images/tabbar/mine_default.png'),
                    active: require('@/images/tabbar/mine_selected.png')
                },
            }
        },
        watch:{
            active(value){
            //value就是监听变化后的值 改变选中图标显示
              sessionStorage.setItem('currentActiveIndex',value)
            }
        },
        computed:{
            ...mapState(['shopCart','userInfo']),
            //商品总量
            goodsNum(){
                let num=0;
                if(this.shopCart){
                    Object.values(this.shopCart).forEach((value, index)=>{
                        //遍历获取新数组长度得到总量
                        num+=value.num
                    });
                    return num
                }else {
                    return 0
                }

            }
        },
        methods:{
            ...mapMutations(['INIT_SHOP_CART','INIT_USER_INFO']),
            ...mapActions(['reqUserInfo']),
            //@1接口请求,初始化购物车数据
            async initShopCart(){

                if(this.userInfo.token){//用户登录了

                    // 服务器取用户购物车数据
                    let result=await getGoodsCart(this.userInfo.token);
                    if(result.success_code===200){//获取成功
                        // console.log(result.data);
                        let cartArr=result.data;
                        let shopCart={};
                        //遍历服务器的购物车数据 转成local可以用的数据类型
                        cartArr.forEach((value,index)=>{
                            shopCart[value.goods_id]={
                                "num": value.num,
                                "id":value.goods_id,
                                "name": value.goods_name,
                                "small_image": value.small_image,
                                "price": value.goods_price,
                                "checked": value.checked
                            }
                        });
                        //从服务器更新到local
                        setStore('shopCart',shopCart);
                        // 从local去取服务器数据同步到页面
                        this.INIT_SHOP_CART()
                    }
                }

            }
        },
        mounted() {
            //从服务器或local读取用户信息到本地
            this.reqUserInfo();
            //@1.1从local读数据给到页面
            this.initShopCart();

        }
    }
</script>


<style lang="less" scoped>
    #dashboard{
        width: 100%;
        height: 100%;
        background-color:#f5f5f5;
    }
</style>