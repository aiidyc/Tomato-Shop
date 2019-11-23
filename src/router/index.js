import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
//一级路由
import Dashboard from './../views/dashboard/Dashboard';
//二级路由懒加载 点击才加载
/*另一种写法 非懒加载
import Cart from './../views/cart/Cart.vue';
*/
const Cart =()=>import('./../views/cart/Cart.vue');
const Home =()=>import('./../views/home/Home.vue');
const Mine =()=>import('./../views/mine/Mine.vue');
const Category =()=>import('./../views/category/Category.vue');
//订单组件
const Order =()=>import('./../views/order/Order.vue');
const MyAddress =()=>import('./../views/order/children/MyAddress.vue');
const OrderDetail =()=>import('./../views/order/children/OrderDetail.vue');
const AddAddress =()=>import('./../views/order/children/children/AddAddress.vue');
const EditAddress =()=>import('./../views/order/children/children/EditAddress.vue');
//登录组件
const Login =()=>import('./../views/login/Login.vue');
const UserCenter =()=>import('./../views/mine/children/UserCenter.vue');
const OrderDetatil =()=>import('./../views/mine/children/OrderDetatil.vue');

export default new Router({
    routes: [
        {path: '/', redirect:'/dashboard'},
        {path: '/dashboard', name: 'dashboard', component: Dashboard,
            children:[
                {path: '/dashboard', redirect:'/dashboard/home'},
                {path: 'home', name: 'home', component: Home,meta: { keepAlive: true}},
                {path: 'category', name: 'category', component: Category,meta: { keepAlive: true}},
                {path: 'mine', name: 'mine', component: Mine,children:[
                        {path: 'userCenter', name: 'userCenter', component: UserCenter},
                        {path: 'orderDetatil', name: 'orderDetatil', component: OrderDetatil},
                    ]},
                {path: 'cart', name: 'cart', component: Cart},
            ]
        },
        {
            path: '/confirmOrder',
            name: 'confirmOrder',
            component:Order,
            children:[
                {path: 'myAddress', namAe: 'myAddress', component: MyAddress,
                    children:[
                        {path: 'addAddress', namAe: 'addAddress', component: AddAddress},
                        {path: 'editAddress', namAe: 'editAddress', component: EditAddress},
                    ]
                },
                {path: 'orderDetail', namAe: 'orderDetail', component: OrderDetail}
            ]
        },
        {path: '/login', name: 'login', component: Login},
    ]
})
