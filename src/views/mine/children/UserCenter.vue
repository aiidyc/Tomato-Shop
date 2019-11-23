<template>
    <div id="userCenter">
        <!--返回导航-->
        <van-nav-bar
                title="用户中心"
                left-text="返回"
                left-arrow
                :fixed="true"
                :border='false'
                @click-left.stop="$router.back()"
        ></van-nav-bar>

        <div class="logout">
            <button @click="logOut">退出登录</button>
        </div>

    </div>
</template>

<script>
    import {getLogOut} from "../../../service/api/index";
    import {mapMutations} from 'vuex'
    import {Toast} from 'vant'
    export default {
        name: "UserCenter",
        methods:{
            ...mapMutations(['RESET_USER_INFO','CLEAR_CART']),
            //清空用户数据从state和local 清空3个地方的数据
            async logOut(){
                //1服务器退出
                let result=await getLogOut();
                if(result.success_code === 200){
                    //2清空用户数据从state和local 清空3个地方的数据
                    this.RESET_USER_INFO();
                    //2.1清空本地local和vuex的购物车数据
                    this.CLEAR_CART();
                    console.log(result);
                    //最后登录提醒
                    Toast({
                        message:'退出登录成功',
                        duration:500
                    });
                    //vuex,服务器端,local三个数据删除退出后,返回主页面
                    this.$router.back();
                }else {
                    console.log('请求删除服务器数据的接口 请求失败');
                }

            }
        }
    }
</script>

<style scoped>
    #userCenter{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #f5f5f5;
        z-index: 200;
    }

    .logout{
        margin-top: 4rem;
        height: 2.5rem;
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .logout button{
        background-color: transparent;
    }
</style>