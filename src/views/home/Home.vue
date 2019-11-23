<template>
    <div id="home">
        <div v-if="!showLoading">
            <!--搜索框-->
            <Header/>
            <!--轮播图-->
            <Sowing :sowing_List="sowing_List"/>
            <!--中部导航-->
            <Nav :nav_list="nav_list"/>
            <!--限时抢购-->
            <flashSale :flash_sale_product_list="flash_sale_product_list"/>
            <!--猜你喜欢-->
            <YouLike :you_like_product_list="you_like_product_list"/>
            <!--回到顶部标签-->
            <MarkPage v-if="showBackStatus" :scrollToTop="scrollToTop"/>


        </div>
        <van-loading  v-else
                type="spinner"
                color="#75a342"
                style="position: absolute;left:50%;top: 40%;transform: translate(-50%)"
        >
            正在拼命加载中…
        </van-loading>
    </div>
</template>

<script>
    import Header from './components/header/Header'
    import HeaderVant from './components/header/HeaderVant'
    import Sowing from './components/sowing/Sowing'
    import Nav from './components/nav/Nav'
    import flashSale from './components/flashSale/flashSale'
    import YouLike from './components/youLike/YouLike'
    import MarkPage from './components/markPage/MarkPage'
    //引入封装好的axios
    import {getHomeData} from './../../service/api/index'
    //引入全局移动端scrolltop判断函数 布尔值返回.
    import {showBack,animate} from "./../../config/global";
    // 5. 引入vuex
    import {mapMutations, mapState} from 'vuex'
    // 4. 引入通知插件
    import PubSub from 'pubsub-js';
    import { Toast } from 'vant';
    // 6.引入购物车的接口
    import {addGoodsToCart} from './../../service/api/index'

    export default {
        name: "Home",
        data(){
            return {
                //轮播图数据
                sowing_List:[],
                //中部导航
                nav_list:[],
                //秒杀产品数据
                flash_sale_product_list:[],
                //我喜欢的产品数据
                you_like_product_list:[],
                showLoading:true,
                showBackStatus:false
            }
        },
        components:{
            Header,
            HeaderVant,
            Sowing,
            Nav,
            flashSale,
            YouLike,
            MarkPage
        },
        computed:{
            ...mapState(['userInfo'])
           },
        mounted(){
            //@2.1添加商品到购物车 pub订阅方式
            PubSub.subscribe('homeAddToCart', (msg, goods)=>{
                if(msg === 'homeAddToCart'){
                    // 判断用户是否登录
                    if(this.userInfo.token){ // 已经登录
                        this.dealGoodsAdd(goods)
                    }else { // 没有登录
                        this.$router.push('/login');
                    }
                }
            });
        },
        //请求主页数据
        created() {
            //@1.1执行请求home数据
            this.reqData();
        },
        methods:{
            ...mapMutations(["ADD_GOODS"]),
            //置顶按钮
            scrollToTop(){
                let docB = document.documentElement || document.body;
                //做缓动动画返回顶部
                animate(docB,{scrollTop:'0'},400,'ease-out')
            },
            //@1请求home数据方法
            async reqData(){
                let res = await getHomeData();
                // console.log(res);
                if(res.success){
                    //1请求轮播图数据
                    this.sowing_List=res.data.list[0].icon_list;
                    //1.1请求中部导航数据
                    this.nav_list = res.data.list[2].icon_list;
                    //1.2请求限时抢购商品数据
                    this.flash_sale_product_list = res.data.list[3].product_list;
                    //1.2请求我喜欢的商品数据
                    this.you_like_product_list = res.data.list[12].product_list;
                    // 数据请求成功,再隐藏loading
                    this.showLoading = false;
                    // 开始监听滚动, 到达一定位置就显示返回顶部按钮
                    showBack((status)=>{
                        // console.log(status);
                        this.showBackStatus = status;
                    });
                }
            },
            //@2添加商品到购物车方法
            async dealGoodsAdd(goods){
                //2.1调用服务器端的接口 添加到服务器
                let result = await addGoodsToCart(this.userInfo.token,goods.id, goods.name, goods.price, goods.small_image,);
                console.log(result);
                //2.2如果添加成功 就继续添加到vuex和local
                if(result.success_code === 200){
                    this.ADD_GOODS({//如果成功同步保存到本地
                        goodsId:goods.id,
                        goodsName:goods.name,
                        smallImage:goods.small_image,
                        goodsPrice:goods.price
                    });
                    //添加后轻提示(vant框架)
                    Toast({
                        message:'添加购物车成功!',
                        //设置时长
                        duration:700
                    });
                }
            }
        },
        // @2.2销毁
        beforeDestroy() {
        PubSub.unsubscribe('homeAddToCart')
    }
    }
</script>

<style lang="less" scoped>
    #home{
        width: 100%;
        height: 300em;
        background-color:#f5f5f5;
    }

</style>