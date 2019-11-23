<template>
    <div id="orderDetail">
        <!--返回导航-->
        <van-nav-bar
                title="商品清单"
                left-text="返回"
                left-arrow
                :fixed="true"
                :border='false'
                @click-left.stop="$router.back()"
        ></van-nav-bar>
        <!--清单列表-->
        <van-cell-group style="margin-top: 2.5rem">
            <van-cell title="商品" :value="`总共${ShopCartCount}件`" @click="a" ></van-cell>

            <van-card
                    :key="checkedShop.id"
                    v-for="(checkedShop,index) in checkedShopCart"
                    :num="`${checkedShop.num}件`"
                    :price="`¥${checkedShop.price}`"
                    :title="`${checkedShop.name}`"
                    :thumb="checkedShop.small_image"
            ></van-card>
        </van-cell-group>

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "OrderDetail",
        computed:{
            ...mapState(['shopCart']),
            //已选中的商品数组
            checkedShopCart(){
                let shopCart = [];
                Object.values(this.shopCart).forEach((goods, index)=>{
                    if(goods.checked){
                        shopCart.push(goods);
                    }
                });
                return shopCart
            },
            //选中的商品总件数
            ShopCartCount(){
                return this.checkedShopCart.length
            }
        },
        methods:{
            a(){
                console.log(this.shopCart);
            }
        }

    }
</script>

<style scoped>
    #orderDetail{
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