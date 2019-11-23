<template>
    <div class="login-container">
        <!--登录面板内容部分-->
        <div class="login-inner">
            <!--面板头部-->
            <div class="login-header">
                <div class="login-logo">
                    <img src="./images/lk_logo_sm.png" alt="" width="300">
                </div>
                <!--面板标题-->
                <div class="login-header-title">
                    <a href="javascript:;" :class="{current: loginMode}" @click="dealLoginMode(true)">手机登录</a>
                    <a href="javascript:;" :class="{current: !loginMode}"  @click="dealLoginMode(false)">密码登录(测试)</a>
                </div>
            </div>
            <!--面板表单部分-->
            <div class="login-content">
                <form>
                    <!--手机验证码登录部分-->
                    <div :class="{current: loginMode}">
                        <section class="login-message">
                            <input type="text" maxlength="11" placeholder="手机号" v-model="phone">
                            <button v-if="!countDown" class="get-verification" :class="{phone_right: phoneRight}" @click.prevent="getVerifyCode()">获取验证码</button>
                            <button v-else disabled="disabled" class="get-verification">
                                已发送({{countDown}}s)
                            </button>
                        </section>
                        <section class="login-verification">
                            <input type="text" maxlength="8" placeholder="验证码" v-model="code"/>
                        </section>
                        <section class="login-hint">
                            温馨提示：测试账号请输入手机号码，获取验证码，验证码均为666666
                            <a href="javascript:;">采用微信扫码支付</a>
                        </section>
                    </div>
                    <!--账号登录部分-->
                    <div :class="{current: !loginMode}">
                        <section>
                            <section class="login-message">
                                <input type="tel" maxlength="11" placeholder="用户名" v-model="user_name">
                            </section>
                            <section class="login-verification">
                                <input v-if="pwdMode" type="password" maxlength="20" placeholder="密码" autocomplete="off" v-model="pwd"/>
                                <input v-else type="text" maxlength="20" placeholder="密码" autocomplete="off" v-model="pwd"/>
                                <div class="switch-show">
                                    <img src="./images/hide_pwd.png" :class="{on: pwdMode}" @click.prevent="dealPwdMode(false)" alt="" width="20">
                                    <img src="./images/show_pwd.png" :class="{on: !pwdMode}"  @click.prevent="dealPwdMode(true)" alt="" width="20">
                                </div>
                            </section>
                            <section class="login-message">
                                <input type="text" maxlength="4" placeholder="验证码" v-model="captcha">
                                <img
                                        class="get-verification"
                                        src="http://demo.itlike.com/web/xlmc/api/captcha"
                                        alt="captcha"
                                        @click.prevent="getCaptcha"
                                        ref="captcha"
                                >
                            </section>
                        </section>
                    </div>
                    <button class="login-submit" @click.prevent="login()">登录</button>
                </form>
                <button class="login-back" @click.prevent="$router.back()">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {Toast} from 'vant';
    import {getPhoneCode,phoneCodeLogin,pwdLogin}from './../../service/api/index'
    import {mapActions} from 'vuex'
    export default {
        name: "Login",
        data(){
            return{
                loginMode:true,// 登录模式
                phone:null,// 手机号码
                countDown:0,// 倒计时
                userInfo: null,//  用户信息
                code:null,//手机验证码
                user_name: null, // 用户名
                pwd: null, // 密码
                pwdMode: true, // true密文 false明文
                captcha: null, // 图形验证码
            }
        },
        methods:{
            ...mapActions(['syncUserInfo']),
            //登录模式,根据这个判断用户登录模式来取值,并切换登录选项卡和头部默认状态,.
            dealLoginMode(flag){
                this.loginMode=flag;
            },
            //点击刷新验证码图片
            getCaptcha(){
                // 1.获取验证码的标签
                let captchaEle = this.$refs.captcha;
                this.$set(captchaEle, 'src', 'http://demo.itlike.com/web/xlmc/api/captcha?time=' + new Date());
                // console.log(captchaEle);

            },
            //登录校验
            async login(){
                //判断登录模式
                if(this.loginMode){//手机验证码登录模式

                    //检验手机号码是否输入正确 不然登录时取不到值
                    if(!this.phone.trim()){
                        Toast('手机号为空,请输入手机号');
                        return
                    }else if(!this.phoneRight){
                        Toast('请输入正确的手机号');
                        return
                    }
                    //检验验证码是否有输入
                    if(!this.code.trim()){
                        Toast('请输入验证码');
                        return
                    }else if(!(/^\d{6}$/.test(this.code))){
                        Toast('请输入验证码格式不正确,请输入6位验证码');
                        return
                    }
                    // 3.1.2 手机验证码登录
                    let result = await phoneCodeLogin(this.phone, this.code);
                    // console.log(result);
                    if(result.success_code === 200){
                        // 4.1 保存用户信息
                        this.syncUserInfo(result.data);
                        // 4.2 回到主面板
                        this.$router.back();
                    }else {
                        Toast({
                            message: '登录失败，手机号码或者验证码不正确！',
                            duration: 500
                        });
                    }

                }else {//密码登录模式
                    if(!this.user_name){
                        Toast({
                            message: '请输入用户名！',
                            duration: 500
                        });
                        return;
                    }else if(!this.pwd){
                        Toast({
                            message: '请输入密码！',
                            duration: 500
                        });
                        return;
                    } else if(!this.captcha){
                        Toast({
                            message: '请输入验证码！',
                            duration: 500
                        });
                        return;
                    }
                    let result = await pwdLogin(this.user_name, this.pwd, this.captcha);
                    console.log(result);
                    if(result.success_code === 200){
                        // 4.1 保存用户信息
                        this.syncUserInfo(result.data);
                        // 4.2 回到主面板
                        this.$router.back();
                    }else {
                        Toast({
                            message: '登录失败，用户名或者密码不正确！',
                            duration: 500
                        });
                    }
                }
            },
            //是否显示明文
            dealPwdMode(flag){
                this.pwdMode=flag
            },
            //获取验证码
            async getVerifyCode(){
                //正则匹配成功才能点击,获取验证码和倒计时开始
                if(this.phoneRight){
                    this.countDown=60;
                    this.timer=setInterval(()=>{
                        this.countDown--;
                        if(this.countDown===0){
                            clearInterval(this.timer);
                        }
                    },1000);
                    // 2.3 获取短信验证码 给用户用的
                    let result = await getPhoneCode(this.phone);
                    console.log(result);

                }
            }
        },
        computed:{
            //检验手机号码格式正则
            phoneRight(){
                return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.phone)
            }
        }
    }
</script>

<style scoped>
    .login-container {
        width: 100%;
        height: 100%;
        background: #fff;
    }

    .login-container .login-inner {
        padding-top: 60px;
        width: 80%;
        margin: 0 auto;
    }

    .login-container .login-inner .login-header .login-logo {
        font-size: 40px;
        font-weight: bold;
        color: #75a342;
        text-align: center
    }

    .login-container .login-inner .login-header .login-header-title {
        padding-top: 40px;
        padding-bottom: 10px;
        text-align: center;
    }

    .login-container .login-inner .login-header .login-header-title > a {
        color: #333;
        font-size: 14px;
        padding-bottom: 4px;
    }

    .login-container .login-inner .login-header .login-header-title > a:first-child {
        margin-right: 40px
    }

    .login-container .login-inner .login-header .login-header-title > a.current {
        color: #75a342;
        font-weight: 700;
        border-bottom: 2px solid #75a342
    }

    .login-container .login-inner .login-content > form > div {
        display: none;
    }

    .login-container .login-inner .login-content > form > div.current {
        display: block
    }

    .login-container .login-inner .login-content > form > div input {
        width: 100%;
        height: 100%;
        padding-left: 8px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: 0;
        font: 400 14px Arial;
    }

    .login-container .login-inner .login-content > form > div input:focus {
        border: 1px solid #75a342
    }

    .login-container .login-inner .login-content > form > div .login-message {
        position: relative;
        margin-top: 16px;
        height: 48px;
        font-size: 14px;
        background: #fff;
    }

    .login-container .login-inner .login-content > form > div .login-message .get-verification {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        border: 0;
        color: #ccc;
        font-size: 14px;
        background: transparent;
    }

    .login-container .login-inner .login-content > form > div .login-message .get-verification.phone_right {
        color: #75a342
    }

    .login-container .login-inner .login-content > form > div .login-verification {
        position: relative;
        margin-top: 16px;
        height: 48px;
        font-size: 14px;
        background: #fff;
    }

    .login-container .login-inner .login-content > form > div .login-verification .switch-show {
        position: absolute;
        right: 10px;
        top: 12px;
    }

    .login-container .login-inner .login-content > form > div .login-verification .switch-show img {
        display: none
    }

    .login-container .login-inner .login-content > form > div .login-verification .switch-show img.on {
        display: block
    }

    .login-container .login-inner .login-content > form > div .login-hint {
        margin-top: 12px;
        color: #999;
        font-size: 12px;
        line-height: 20px;
    }

    .login-container .login-inner .login-content > form > div .login-hint > a {
        color: #75a342
    }

    .login-container .login-inner .login-content > form .login-submit {
        display: block;
        width: 100%;
        height: 42px;
        margin-top: 30px;
        border-radius: 4px;
        background: #75a342;
        color: #fff;
        text-align: center;
        font-size: 16px;
        line-height: 42px;
        border: 0
    }

    .login-container .login-inner .login-content .login-back {
        display: block;
        width: 100%;
        height: 42px;
        margin-top: 15px;
        border-radius: 4px;
        background: transparent;
        border: 1px solid #75a342;
        color: #75a342;
        text-align: center;
        font-size: 16px;
        line-height: 42px
    }
</style>