<template>
    <div v-if="userInfo.token" id="mine">
        <!--顶部导航-->
        <van-nav-bar
                title="个人中心"
                :fixed="true"
                :border='false'
        ></van-nav-bar>
        <!--用户信息--->
        <van-cell-group style="margin-top: 2.5rem">

            <van-cell
             :center="true"
             is-link
             style="background-color: #3bba63;color: white"
             @click="$router.push('/dashboard/mine/userCenter')"
            >
            <template slot="title">
                <div class="personMsg">
                    <!--测试头像-->
                   <img src="./images/userIcon.png" alt="">
                    <div class="personInfo">
                        <!--用户名字暂时用测试名-->
                        <span>番茄宝宝</span>
                        <span>手机号：{{userInfo.phone}}</span>
                    </div>
                </div>
            </template>
            </van-cell>

        </van-cell-group>
        <!--小组0-订单信息-->
        <van-cell-group >
            <van-cell title="我的订单"  icon="cart"  is-link value="查看全部订单" @click="$router.push('/dashboard/mine/orderDetatil')"></van-cell>
            <router-link tag="div" to="/dashboard/mine/orderDetatil">
                <van-grid>
                    <van-grid-item
                            v-for="(order, index) in orderData"
                            :key="index"
                            :icon="order.icon"
                            :text="order.title">
                    </van-grid-item>
                </van-grid>
            </router-link>

        </van-cell-group>
        <!--小组1-优惠券,收货地址-->
        <van-cell-group style="margin-top: 0.5rem">
            <van-cell icon="gift" title="优惠券"   is-link value="1张"></van-cell>
            <van-cell icon="location" title="收货地址" is-link ></van-cell>
        </van-cell-group>
        <!--小组2-联系客服,意见反馈-->
        <van-cell-group  style="margin-top: 0.5rem">
        <van-cell icon="phone" title="联系客服"  is-link value="客服时间在线7:00-19:00"></van-cell>
        <van-cell icon="service" title="意见反馈" is-link></van-cell>
    </van-cell-group>
        <!--小组3-App下载-->
        <van-cell-group style="margin-top: 0.5rem">
            <van-cell icon="weapp-nav" title="番茄买菜"  is-link value="下载app 体验更加"></van-cell>
        </van-cell-group>

        <!--添加地址出口-->
        <transition
                enter-active-class="animated fadeInRight"
                leave-active-class="animated fadeOutRight"
                :duration="{enter:1000,leave:1000}"
        >
            <router-view ></router-view>
        </transition>

    </div>
    <SelectLogin v-else/>
</template>

<script>
    import animate from 'animate.css'
    import {Dialog} from 'vant'
    import {mapState,mapMutations} from 'vuex'
    import SelectLogin from './../login/SelectLogin'
    export default {
        name: "Mine",
        data() {
            return {
                orderData: [
                    {icon: 'cart-circle-o', title: '待支付'},
                    {icon: 'gift-o', title: '待收货'},
                    {icon: 'smile-comment-o', title: '待评价'},
                    {icon: 'cash-back-record', title: '售后/退款'}
                ]
            }
        },
        computed:{
            ...mapState(['userInfo'])
        },
        components:{
            SelectLogin
        },
        methods:{
        }
    }
</script>


<style scoped>
    #mine{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }
    .van-nav-bar{
        background-color: #3bba63;
    }
    .van-nav-bar__title{
        color: white;
    }
    .personMsg{
        display: flex;
        flex-direction: row;
        align-items:center;

    }
    .personMsg img{
        width: 4rem;
        height: 4rem;
        border-radius: 2rem;
        border: 0.12rem solid #f5f5f5;
    }
    .personInfo{
        display: flex;
        flex-direction: column;
        margin-left: 2rem;
    }
    .van-cell__left-icon{
        color: orange;
        font-size: 1.2rem;
    }
</style>