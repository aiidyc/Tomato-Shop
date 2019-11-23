//store集中管理文件,小项目不需要这样拆分
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import getters from './getters';
import actions from './actions';
import mutations from './mutations';

export default new Vuex.Store({
    state: {// 购物车的商品
        shopCart:{},
        // 用户信息
        userInfo: {},

    },
    mutations,
    actions,
    getters
})
