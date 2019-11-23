<template>
    <div class="wrapper">
        <div class="titleWrapper">
            <div class="middleLine"></div>
            <div class="title">猜你喜欢</div>
        </div>
        <div class="contentWrapper">
            <YouLikeitem v-for="(pruduct,index) in you_like_product_list" :pruduct="pruduct" :key="pruduct.id" />
        </div>
    </div>
</template>

<script>
    import YouLikeitem from './YouLikeitem'
    export default {
        name: "YouLike",
         props:{
             you_like_product_list:Array
         },
        components:{
            YouLikeitem
        }
    }
</script>

<style scoped>
    .wrapper {
        margin-top: 0.625rem;
    }

    .titleWrapper {
        position: relative;
        padding: 0 0.625rem;
        height: 2.1875rem;
        text-align: center; }

    .middleLine {
        padding-top: 1.09375rem;
        border-bottom: solid 1px #D8D8D8;
    }

    .title {
        position: relative;
        display: inline-block;
        top: -1.09375rem;
        padding: 0 1.25rem;
        line-height: 2.1875rem;
        font-size: 1rem;
        background: #F5F5F5;
    }
    .contentWrapper{
        margin-bottom: 4.5rem;
    }
</style>