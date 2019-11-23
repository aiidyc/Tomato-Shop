import vue from 'vue';
//引入时间过滤插件
import moment from 'moment'
vue.filter('moneyFormat',(value)=>{
    return '¥'+Number(value).toFixed(2)
});

//全局时间格式话 ,记得引入后再使用npm i moment --save
vue.filter('timeFormat',(value,format='YYYY-MM-DD HH:mm:ss')=>{
    return moment(value).format(format)
});