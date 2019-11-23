<template>
    <div id="addAddress">
        <!--返回导航-->
        <van-nav-bar
                title="地址添加"
                left-text="返回"
                left-arrow
                :fixed="true"
                :border='true'
                @click-left.stop="$router.go(-1)"
        ></van-nav-bar>
        <!--详细地址编辑-->
        <van-address-edit
                :area-list="areaList"
                show-postal
                show-set-default
                :search-result="searchResult"
                @save="onSave"
                @change-detail="onChangeDetail"
                style="margin-top: 2rem"
        >
        </van-address-edit>
    </div>
</template>

<script>
    import {Toast} from  'vant'
    import {mapState} from 'vuex'
    import areaList from './../../../../config/area'
    import {addUserAddress} from "../../../../service/api";
    //订阅
    import PubSub from 'pubsub-js'

    export default {
        name: "AddAddress",
        data() {
            return {
                areaList:areaList,//省市区
                searchResult: []
            }
        },
        computed:{
            ...mapState(['userInfo'])
        },
        methods:{
            onClickLeft(){
                this.$router.go(-1)
            },
            //保存地址 content=表格填写的内容
            async onSave(content) {
                if(this.userInfo.token){//已登录
                    let result=await addUserAddress(this.userInfo.token,content.name, content.tel, content.province+content.city+content.county, content.addressDetail, content.postalCode, content.isDefault, content.province, content.city, content.county, content.areaCode);
                    console.log(result);
                    if(result.success_code===200){//添加成功

                        Toast('添加地址成功');
                        this.$router.back();
                    //    告诉父组件添加成功的通知
                        PubSub.publish('addAddressSuccess')

                    }else {
                        Toast('添加地址失败')
                    }

                }else {//未登录
                    Toast('未登录 请先登录')
                }
            },
            onDelete() {
                Toast('delete');
            },
            onChangeDetail(val) {
                if (val) {
                    this.searchResult = [{
                        name: '黄龙万科中心',
                        address: '杭州市西湖区'
                    }];
                } else {
                    this.searchResult = [];
                }
            }
        }

    }
</script>

<style scoped>
    #addAddress{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color:#f5f5f5;
        z-index: 10000;
    }
</style>