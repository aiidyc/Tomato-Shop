<template>
    <div id="category">
        <!--头部-->
        <Header/>

        <!--内容-->
        <div  class="listWrapper" v-if="!showLoading" >
            <!--左边-->
            <div class="leftWrapper">
                <ul class="wrapper">
                    <li class="categoryItem" v-for="(cate,index) in categoriesData"
                        :class="{selected:currentIndex===index}"
                        @click="clickLiftLi(index)"
                        :key="cate.id"
                        ref="menuList"
                    >
                        <span class="textWrapper">{{cate.name}}</span>
                    </li>
                </ul>
            </div>


            <!--右边-->
            <ContentView :categoriesDetailData="categoriesDetailData" />
        </div>
        <van-loading v-else
                type="spinner"
                color="#75a342"
                style="position: absolute;left:50%;top: 40%;transform: translate(-50%)"
        >
            正在拼命加载中…
        </van-loading>
    </div>
</template>

<script>
    //请求数据方法
    import {getCategories,getCategoriesDetail} from "../../service/api/index";
    //组件
    import Header from './components/Header';
    import ContentView from './components/ContentView';
    //滚动插件
    import Bscroll from 'better-scroll';
    export default {
        name: "Category",
        data(){
            return {
                showLoading: true,
                // 左边列表数据
                categoriesData: [],
                // 右边列表数据
                categoriesDetailData:[],
                currentIndex:0

            }
             },
        components:{
            Header,
            ContentView
        },
        created() {
            //@1.1
            this.initData();
    },
        methods:{
            //@1初始化请求分类数据和右边商品数据到页面
            async initData(){
                 //获取左边的分类数据
                 let leftRes=await getCategories();
                // console.log(leftRes);
                if(leftRes.success){
                    //请求下来的数据存到this.categoriesData
                    this.categoriesData = leftRes.data.cate;

                }
                //初始化请求右边的数据
                let rightRes=await getCategoriesDetail('/lk001');
                if(rightRes.success){
                    //请求下来的数据存data
                    this.categoriesDetailData = rightRes.data.cate;
                }
                // 隐藏loading框
                this.showLoading = false;

                //将回调延迟到下个dom更新循环时才执行,这里的意思是等请求到数据了 再加载滚动插件
                this.$nextTick(()=>{
                    //probeType表示敏感度可选1,2,3
                    this.leftScroll=new Bscroll('.leftWrapper',{
                        probeType:3,//滚动速度
                        click: true,
                        scrollY: true,//开启纵向滚动
                        tap: true,//
                        mouseWheel: true//鼠标滚轮
                    })
                })

            },
            //2根据左边点击索引,从接口查询右边商品数据并赋值
            async clickLiftLi(index){
                //当前点击的索引赋值给currentIndex 改变默认选中状态
                this.currentIndex=index;
            //    拿到点击的所有li标签
                let menuLists=this.$refs.menuList;
                let el=menuLists[index];
                // console.log(el);
                //用0.3秒滚动到el元素上
                this.leftScroll.scrollToElement(el,300)

                //点击后根据类型获取右边的数据
                let rightRes=await getCategoriesDetail(`/lk00${index+1}`);
                // console.log(rightRes);
                if(rightRes.success){
                    //请求下来的数据存data
                    this.categoriesDetailData = rightRes.data.cate;
                    console.log(rightRes.data.cate);
                }
            }
        }
    }
</script>

<style scoped>
    #category {
        width: 100%;
        height: 100%;
        background-color: #F5F5F5;
        overflow: hidden;
    }

    .listWrapper {
        position: fixed;
        top: 50px;
        bottom: 50px;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
    }

    .leftWrapper {
        background-color: #F4F4F4;
        width: 5.3125rem;
        flex: 0 0 5.3125rem;
    }

    .categoryItem {
        padding: 0.75rem 0;
        border-bottom: solid 1px #E8E9E8;
        position: relative;
    }

    .categoryItem .textWrapper {
        line-height: 1.25rem;
        border-left: solid 0.1875rem transparent;
        padding: 0.3125rem 0.6875rem;
        font-size: 0.8125rem;
        color: #666666;
    }

    .categoryItem.selected {
        background: #FFF;
    }

    .categoryItem.selected .textWrapper {
        border-left-color: #3cb963;
        font-weight: bold;
        font-size: 0.875rem;
        color: #333333;
    }

    @media (min-width: 960px) {
        .wrapper {
            border-right: 1px solid #E8E9E8;
        }

        .wrapper .categoryItem {
            background: #fff;
        }
    }
</style>