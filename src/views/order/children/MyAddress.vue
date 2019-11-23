<template>
    <div id="MyAddress">

        <!--返回导航-->
        <van-nav-bar
                title="我的地址"
                left-text="返回"
                left-arrow
                :fixed="true"
                :border='false'
                @click-left.stop="onClickLeft"
        ></van-nav-bar>

        <van-address-list
                style="margin-top: 3rem"
                v-model="chosenAddressId"
                :list="list"
                @add="onAdd"
                @edit="onEdit"
                @select="onSelect"
        ></van-address-list>

        <!--孙组件,添加及编辑地址出口-->
        <transition
                enter-active-class="animated fadeInRight"
                leave-active-class="animated fadeOutRight"
                :duration="{enter:1000,leave:1000}"
        >
            <router-view ></router-view>
        </transition>
    </div>
</template>

<script>
    //api请求用户地址数据
    import {getUserAddress} from "../../../service/api";
    //获取vuex
    import {mapState}from 'vuex'
    import animate from 'animate.css'
    import {Toast} from  'vant'
    import PubSub from 'pubsub-js'
    export default {
        name: "MyAddress",
        props:{
            flag:Boolean
        },
        data() {
            return {
                chosenAddressId: '1',
                list: [],
            }
        },
        computed:{
            ...mapState(['userInfo'])
        },
        mounted() {
            //@1.1刷新用户数据
            this.initUserAddress();
        // 监督是否添加地址成功 及时获取最新的用户地址
            PubSub.subscribe('addAddressSuccess',(msg)=>{
                if(msg==='addAddressSuccess'){
                //@1.2刷新用户数据 子组件添加到服务器成功,就从服务器获取用户最新的所有地址
                    this.initUserAddress()
                }
            })
        },
        methods: {
            onClickLeft(){
                this.$router.back()
            },
            //点地址添加
            onAdd() {
                // Toast('新增地址');
                this.$router.push('/confirmOrder/myAddress/addAddress')
            },
            //点编辑 跳转传id
            onEdit(item, index) {
                // console.log(item.address_id);
                this.$router.push('/confirmOrder/myAddress/editAddress?address_id='+item.address_id)
            },
            //任意地址点击后,获取item 插件自带参数
            onSelect(item){
                //数据传给父级
                if(item){
                    PubSub.publish('addCurrentAddress',item)
                }
                this.$router.back()
            },
           // @1从服务器获取用户所有的地址到本地
           async initUserAddress(){

               if(this.userInfo.token){//用户已登录
                   let result=await getUserAddress(this.userInfo.token);
                   console.log(result.data);
                   if(result.success_code===200){//服务器获取成功
                       let addressArr=result.data;
                       let list=[];
                       addressArr.forEach((value,index)=>{
                           list[index]={
                               id:String(index+1),
                               name: value.address_name,
                               tel: value.address_phone,
                               address: value.address_area+value.address_area_detail,
                               address_id:value._id,
                               user_id:value.user_id
                           }
                       });
                       // console.log(list);
                       this.list=list
                   }else {
                       console.log('服务器用户地址获取失败');
                   }

               }else {//未登录
                   Toast({
                       message:'用户登录过期 请退出重新登录',
                       duration:800
                   })
               }
           }
        },
        beforeDestroy() {
            //及时销毁订阅
            PubSub.unsubscribe('addAddressSuccess')
        }
    }
</script>

<style scoped>
    #MyAddress{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 200;
    }
</style>