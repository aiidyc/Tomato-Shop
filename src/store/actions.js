/*
store中的action对象 存放异步函数的
*/
import {getStore} from "../config/global";
import {getUserInfo} from "../service/api";
import {ADD_GOODS,USER_INFO} from './mutations-Type';
export default {
    //action里自带参数要用花括号括起来,
    addGoods({commit},goodsId,goodsName,smallImage,goodsPrice){
        commit(ADD_GOODS,{goodsId, goodsName, smallImage, goodsPrice})
    },
    // 1. 同步用户信息
    syncUserInfo({commit}, userInfo) {
        commit(USER_INFO, {userInfo})
    },
    //页面刷新时,读取更新用户信息
    async reqUserInfo({commit}){
        //从本地获取local数据
        let userInfo=JSON.parse(getStore('userInfo'));
        if(userInfo){
            //保持到state和local
            commit(USER_INFO,{userInfo})
        }else {
            //local没有就从从服务器取,保存到state和local本地 读取数据到页面
            let result=await getUserInfo();
            //服务器读取成功
            if(result.success_code===200){
                commit(USER_INFO,{userInfo:result.data})
            }

        }


    }
}