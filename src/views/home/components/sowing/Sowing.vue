<template>
    <!--v-if="sowing_List.length>1" 可以让loop效果成功-->
    <swiper id="swiper" :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="(sowing,index) in sowing_List" :key="sowing.public_id">
            <img :src="sowing.icon_url" :alt="sowing.public_name">
        </swiper-slide>

        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
        <div class="swiper-scrollbar"   slot="scrollbar"></div>
    </swiper>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    export default {
        name: "Sowing",
        props:{
            sowing_List:Array
        },
        data() {
            return {
                swiperOption: {// swiper设置
                    // 表示第一时间拿到数据 一般要加这个
                    notNextTick:true,
                    //分页
                    pagination: {
                        //挂载后就有圆点
                        el: '.swiper-pagination',
                        //点分页切换图
                        clickable :true
                    },
                    //轮播图循环开启
                    loop:true,
                    autoplay: {//自动播放 下面可以设置时间等
                        delay: 1000
                    },
                    on:{//执行滑动函数
                        slideChangeTransitionStart(){
                            //this.activeIndex表示当前索引
                            // console.log(this.activeIndex);
                        }
                    }
                }
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        computed:{
            swiper(){
                //应该是获取里面的子组件
                return this.$refs.mySwiper.swiper
            }
        },
        mounted() {//组件渲染完成的意思
            //滑到第五页 1秒 false
            // this.swiper.slideTo(5,1000,false);

        }
    }
</script>

<style lang="less" scoped>
#swiper{
    width: 100%;
    height: 14em;
    background-color: #f5f5f5;
    //禁止滑动时默认手势操作，但不影响事件触发
    touch-action: none;
}
#swiper img{
    width: 100%;
    height: 100%;
}
/*
     穿透修改样式
  */
#swiper  .swiper-pagination-bullet-active{
    background-color: blue;
}

</style>