<template>
    <div id="myOrderItem" v-show="order.cart_shop[0].data.length">
        <div class="itemTop">
            <van-cell :title="order.arrive_time" :value="`${order.order_status === 'pay' ? '已支付': '待支付'}`"></van-cell>
        </div>
        <div class="itemCenter">
            <div class="centerLeft">
                <img v-for="(cartGoods, index) in order.cart_shop[0].data.slice(0, 5)" :src="cartGoods.small_image" alt="" width="30">
            </div>
            <div class="centerRight">{{order.cart_shop[0].data.length >= 6 ? '…' : ''}}</div>
        </div>
        <div class="itemBottom">
            <van-cell title=" " :value="`共${order.cart_shop[0].data.length}份商品 实付¥${order.shop_price + order.dis_price}`"></van-cell>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OrderItem",
        props:{
            order:Object
        },
        mounted() {
            // this.a()
        },
        methods:{
            a(){
                //this.order.cart_shop[0].data
                // console.log(this.order.cart_shop[0].data);
            }
        }
    }
</script>

<style scoped>
#myOrderItem{
    width: 100%;
    height: 8rem;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    font-size: 0.7rem;
    margin: 0.5rem 0;
}

#myOrderItem .itemTop {
    flex: 1;
}

#myOrderItem .itemCenter{
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #e0e0e0;
    flex: 2;
}

#myOrderItem .itemCenter .centerLeft{
    flex: 9;
}

#myOrderItem .itemCenter .centerRight{
    flex: 1;
}

#myOrderItem .itemCenter .centerLeft img{
    width: 2.8rem;
    margin: 0.5rem 0.3rem;
}

#myOrderItem .itemBottom{
    flex: 1;
}
</style>