<template>
    <div id="editAddress">
        <!--返回导航-->
        <van-nav-bar
                title="地址编辑"
                left-text="返回"
                left-arrow
                :fixed="true"
                :border='true'
                @click-left.stop="onClickLeft"
        ></van-nav-bar>
        <!--详细地址编辑-->
        <van-address-edit
                :address-info="AddressInfo"
                :area-list="areaList"
                show-postal
                show-delete
                show-set-default
                show-search-result
                :search-result="searchResult"
                @save="onSave"
                @delete="onDelete"
                @change-detail="onChangeDetail"
                style="margin-top: 2rem"
        ></van-address-edit>
    </div>
</template>

<script>
    import {Toast} from  'vant'
    //引入地区配置文件 赋值给data
    import areaList from './../../../../config/area'
    //引入地址api
    import {getCurrentUserAddress,changeUserAddress,delUserAddress} from "../../../../service/api";
    //引入vuex
    import {mapState} from 'vuex'
    export default {
        name: "EditAddress",
        data() {
            return {
                areaList:areaList,//引入地址文件 赋值
                searchResult: [],//省市区
                AddressInfo:{}//地址数据
            }
        },
        computed:{
          ...mapState(['userInfo'])
        },
        mounted(){
            //获取当前地址信息
            this.getCurrentUserAddress()
        },
        methods:{
            onClickLeft(){
                this.$router.go(-1)
            },
            //编辑保存地址 保存到服务器
            async onSave(content) {
                if(this.userInfo.token) {//已登录
                    if(this.$route.query.address_id){//有地址id和用户登录 可以进行数据保存

                        let result=await changeUserAddress(this.$route.query.address_id,this.userInfo.token, content.name, content.tel, content.province+content.city+content.county, content.addressDetail, content.postalCode, content.isDefault, content.province, content.city, content.county, content.areaCode)
                        console.log(result);
                        if(result.success_code===200){//编辑保存成功

                            Toast('修改地址成功');
                            //    告诉父组件添加成功的通知
                            PubSub.publish('addAddressSuccess');
                            this.$router.back();
                        }

                    }else {
                        console.log('找不到address_id');
                    }
                }else {
                    Toast('用户未登录')
                }
            },
            //删除地址
            async onDelete() {
                if(this.userInfo.token) {//已登录
                    if(this.$route.query.address_id){//有地址id和用户登录 可以进行数据删除

                        let result=await delUserAddress(this.$route.query.address_id);
                        console.log(result);
                        if(result.success_code===200){//编辑保存成功

                            Toast('删除地址成功');
                            //    告诉父组件添加成功的通知
                            PubSub.publish('addAddressSuccess');
                            this.$router.back();
                        }

                    }else {
                        console.log('找不到address_id');
                    }
                }else {
                    Toast('用户未登录')
                }
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
            },
            //获取当前地址(根据路由传的地址id,从服务器请求该地址)
            async getCurrentUserAddress(){

                if(this.userInfo.token){//已登录
                    if(this.$route.query.address_id){
                        // 验证无误后请求服务器数据
                        let result=await getCurrentUserAddress(this.userInfo.token,this.$route.query.address_id);
                        console.log(result);
                        if(result.success_code===200){
                            this.AddressInfo={
                                id: result.data._id,
                                name: result.data.address_name,
                                tel: result.data.address_phone,
                                province: result.data.province,
                                city: result.data.city,
                                county: result.data.county,
                                addressDetail: result.data.address_area_detail,
                                areaCode: result.data.areaCode,
                                postalCode: result.data.address_post_code,
                                isDefault: result.data.address_tag
                            }
                            console.log(this.AddressInfo);
                        }
                    }else {
                        console.log('找不到address_id');
                    }

                }else {
                    Toast('用户未登录')
                }

            }
        }
    }
</script>

<style scoped>
#editAddress{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:#f5f5f5;
    z-index: 10000;
}
</style>