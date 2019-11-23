<template>
    <div id="selectlogin">
        <div class="bottom">
        <img src="./images/lk_logo_sm.png" alt="" width="300">
        </div>
        <h4>选择登录方式</h4>
        <router-link tag="button" to="/login">手机登录</router-link>
    </div>
</template>

<script>
    export default {
        name: "SelectLogin"
    }
</script>

<style scoped>
#selectlogin{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;

}
.bottom{
    position: fixed;
    top: 130px;
    left: 50%;
    transform: translateX(-50%);
}
button{
    width: 80%;
    height: 38px;
    background-color: #2eba5a;
    border: none;
    border-radius: 5px;
    font-size: 20px;
    color: #fff;
    margin-top: 30px;
}
</style>