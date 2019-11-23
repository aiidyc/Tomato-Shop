import Vue from 'vue'
// 1. 底部的导航
import { Tabbar, TabbarItem } from 'vant';
Vue.use(Tabbar).use(TabbarItem);

//1.1搜索测试 临时用
import { Search } from 'vant';
Vue.use(Search);

//lodaing
import { Loading } from 'vant';
Vue.use(Loading);

//image
import { Image } from 'vant';
Vue.use(Image);

//轻提示
import { Toast } from 'vant';
Vue.use(Toast);
//弹窗提示
import { Dialog } from 'vant';
Vue.use(Dialog);
//导航栏
import { NavBar } from 'vant';
Vue.use(NavBar);
//地址编辑
import { ContactCard, ContactList, ContactEdit } from 'vant';
Vue.use(ContactCard).use(ContactList).use(ContactEdit);
//        地址列表
import { AddressList } from 'vant';
Vue.use(AddressList);
//        地址编辑详细页面
import { AddressEdit } from 'vant';
Vue.use(AddressEdit);
//        添加地址单元格
import { Cell, CellGroup } from 'vant';
Vue.use(Cell).use(CellGroup);
//提交订单
import { SubmitBar } from 'vant';
Vue.use(SubmitBar);
//icon图标
import { Icon } from 'vant';
Vue.use(Icon);
//宫格
import { Grid, GridItem } from 'vant';
Vue.use(Grid).use(GridItem);
//时间选择
import { DatetimePicker } from 'vant';
Vue.use(DatetimePicker);

//弹出层
import { Popup } from 'vant';
Vue.use(Popup);
//商品卡片
import { Card } from 'vant';
Vue.use(Card);
//tab选项卡
import { Tab, Tabs } from 'vant';
Vue.use(Tab).use(Tabs)