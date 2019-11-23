<template>
    <div id="OrderDetatil">
        <!--返回导航-->
        <van-nav-bar
                title="我的订单"
                left-text="返回"
                left-arrow
                :fixed="true"
                :border='false'
                @click-left.stop="$router.back()"
        ></van-nav-bar>
        <!--选项卡-->
        <van-tabs v-model="activeName" style="margin-top: 2.6rem" title-active-color="#75a342" color='#75a342' >
            <van-tab title="全部" name="a">
                <OrderItem v-for="(order, index) in allOrderArr" :order="order" :key="order._id"/>
            </van-tab>
            <van-tab title="待支付" name="b">
                <OrderItem v-for="(order, index) in allWillOrderArr" :order="order" :key="order._id"/>
            </van-tab>

            <van-tab title="已支付" name="c">
                <OrderItem v-for="(order, index) in allPayOrderArr" :order="order" :key="order._id"/>
            </van-tab>
        </van-tabs>

    </div>
</template>

<script>
    //引入查询订单接口
    import {getOrder} from "../../../service/api";
    import {mapState} from 'vuex'
    //引入子组件
    import OrderItem from './components/OrderItem'
    import {Toast} from 'vant'
    export default {
        name: "OrderDetatil",
        data() {
            return {
                activeName: 'a',
                allOrderArr: null, // 所有的订单
                allWillOrderArr: null, // 所有待支付的订
                allPayOrderArr: null, // 所有支付的订单
            };
        },
        components:{
        OrderItem
        },
        computed:{
          ...mapState(['userInfo'])
        },
        methods:{
          //  @1获取所有订单详情注入页面
          async getAllOrder(){
              if(this.userInfo.token){
                  let Result=await getOrder(this.userInfo.token);
                  console.log(Result);
                  let willArr=[];
                  let payArr=[];
                  if(Result.success_code===200){
                      Result.data.forEach((value,index)=>{

                          if(value.order_status==="will"){
                              willArr.push(value)
                          }else{
                              payArr.push(value)
                          }
                      });
                      this.allOrderArr=Result.data;
                      this.allWillOrderArr=willArr;
                      this.allPayOrderArr=payArr;
                  }
              }else {
                  Toast('用户未登录')
              }
          }

        },
        mounted(){
          //  @1.1获取订单数据
          this.getAllOrder()
        }
    }
</script>

<style scoped>
    #OrderDetatil{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 150%;
        background-color: #f5f5f5;
        z-index: 200;
    }


</style>