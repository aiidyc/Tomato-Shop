import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false;
import router from './router/index'
import store from './store/index'

//引入fastclick
import FastClick from 'fastclick';
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}
//2引入全局样式
import './style/common.less';
//3. 引入全局UI组件库-vant
import './plugins/vant'
//4.配置rem转换
import './config/rem'
//5引入全局filters过滤器
import './config/filters'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
