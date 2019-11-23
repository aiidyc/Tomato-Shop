/*
store中的mutations对象  存放同步函数更改数据的
*/
import Vue from 'vue'
import {setStore,getStore,removeStore} from "../config/global";
import {
    ADD_GOODS,INIT_SHOP_CART,
    REDUCE_CART,
    SELECTED_SINGER_GOODS,
    SELECTED_All_GOODS,
    CLEAR_CART,
    USER_INFO,
    INIT_USER_INFO,
    RESET_USER_INFO
     } from './mutations-Type';
    export default {
    //ADD_TODO不是方法名,加括号才是,外界参数要用花括号括起来
     [ADD_GOODS](state,{goodsId, goodsName, smallImage, goodsPrice}){
        //存一个新对象 避免实时变动
        let shopCart=state.shopCart;

        if(shopCart[goodsId]){
            shopCart[goodsId]['num']++
        }else{
            shopCart[goodsId]={
                "num": 1,
                "id": goodsId,
                "name": goodsName,
                "small_image": smallImage,
                "price": goodsPrice,
                "checked": true
            }
        }
        //1.2将刷新增加的购物车数据,存到status
        state.shopCart={...shopCart};
        //1.3购物车state.shopCart数据同步存到本地
        setStore('shopCart', state.shopCart);
    },
//   从本地读取购物车
     [INIT_SHOP_CART](state){
        let initCart=getStore('shopCart')
        //如果本地有值才读取更新到state
        if(initCart){
            state.shopCart=JSON.parse(initCart)
        }

        },
//   移除购物车
     [REDUCE_CART](state,{goodsId}){
        let shopCart=state.shopCart;
        //根据id获取到这个商品
        let goods=shopCart[goodsId];
        //根据商品数量决定减量还是删除.
        if(goods['num']>0){
            //商品减1
            goods['num']--;
            if(goods['num']===0){
                //删除商品
                delete shopCart[goodsId]
            }

        }else {
            //商品数量小于或等于0 清除掉此商品
            goods=null
        }

        //更新购物车数据到state和local本地
        state.shopCart={...shopCart};
        setStore('shopCart', state.shopCart);
    },
//  4购物车商品-选中与取消
     [SELECTED_SINGER_GOODS](state,{goodsId}){
         let shopCart=state.shopCart;
         //根据id获取到这个商品
         let goods=shopCart[goodsId];
        if(goods){//如果商品存在才改变状态
            if(goods.checked){
                goods.checked=!goods.checked
            }else {
                // goods.checked=true
                Vue.set(goods, 'checked', true);
            }
            // 4.1改了后要同步更新到state和local本地
            state.shopCart={...shopCart};
            setStore('shopCart', state.shopCart);

        }else {
            console.log('点击后根据id找不到购物车数据,请查看传入的id问题');
        }
     },
//   5购物车商品全选
     [SELECTED_All_GOODS](state,{SelectedAll}){
          let shopCart=state.shopCart;
          Object.values(shopCart).forEach((goods,index)=>{
             if(goods.checked){
                 goods.checked=SelectedAll
             }else {
                 Vue.set(goods, 'checked', SelectedAll);
             }
          });
      //    改了数据 要同步更新到local和vuex
          state.shopCart={...shopCart};
          setStore('shopCart', state.shopCart);

      },
//   6清空购物车
     [CLEAR_CART](state){
         //清空vuex和local本地2个数据
         state.shopCart={};
         //防止深复制
         state.shopCart={...state.shopCart};
         removeStore('shopCart')
     },
//   7保存用户信息到本地和vuex
     [USER_INFO](state,{userInfo}){
         state.userInfo=userInfo;
         setStore('userInfo',state.userInfo)
     },
     //   8读取用户信息
     [INIT_USER_INFO](state){
         //一定要做个判断
         //获取用户信息
         let userInfo = getStore('userInfo');
        // 判断
        if(userInfo){
            state.userInfo=JSON.parse(userInfo)
        }

        },
    // 清空用户vuex和local的数据
     [RESET_USER_INFO](state){
         state.userInfo={};
         removeStore('userInfo')
        }
    }