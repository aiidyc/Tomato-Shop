/*
import axios from 'axios';

//params只能传对象,表示路径后面的参数,如果是get请求会在函数中转化成字符串.
export default function ajax(url='',params={},type='GET') {
    //定义一个变量 最后接受返回的promise
    // console.log(params);
    let promise;
    //默认返回一个Promise对象出去
    return new Promise((resolve, reject)=>{
//发起get请求
        if(type.toUpperCase()==='GET'){
            let paramsStr='';
            //转化路径后面的参数为get写法,拼接全路径
            //Object.keys(params)的意思是把对象所有的键取出来,组成一个数组.
            Object.keys(params).forEach(key=>{
                //最后拼接的结果肯定多个& 所以要去掉
                paramsStr+=key+'='+params[key]+'&'
            });
            //截取&之前的字符串
            paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'));
            //拼接全路径
            url+='?'+paramsStr;
            promise=axios.get(url)
//发起post请求
        }else if(type.toUpperCase()==='POST'){
            promise=axios.post(url,params)
        }

        // 2.8 最后处理结果并返回 外界用then可以得到这个结果
        promise.then((response) => {
            //无论是get还是post请求 返回得到的结果
            resolve(response.data);
        }).catch(error => {
            //返回捕获的错误
            reject(error);
        })
    })


}*/
import axios from 'axios'

export default function ajax(url = '', params = {}, type = 'GET') {
    // 1. 变量
    let promise;

    // 2. 返回一个promise对象
    return new Promise((resolve, reject) => {
        // 2.1 判断请求的类型
        if (type.toUpperCase() === 'GET') { // get请求
            // 2.2 拼接字符串
            let paramsStr = '';
            // 2.3 遍历
            Object.keys(params).forEach(key => {
                paramsStr += key + '=' + params[key] + '&';
            });
            // 2.4 过滤最后的&
            /*
              注意：为了防止请求缓存，在尾部加了时间戳
            */
            if (paramsStr) {
                paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'));
                // 2.5 拼接完整路径
                if(url.indexOf('47.98.157.152') === -1) {
                    url += '?' + paramsStr + '&itlike=' + randomCode(20);
                }else {
                    url += '?' + paramsStr;
                }
            }else {
                if(url.indexOf('47.98.157.152') === -1){
                    url += '?itlike=' + randomCode(20)
                }
            }
            // 2.6 发起get请求
            promise = axios.get(url);
        } else if (type.toUpperCase() === 'POST') { // post请求
            // 2.7 发起post请求
            promise = axios.post(url, params);
        }
        // 2.8 处理结果并返回
        promise.then((response) => {
            resolve(response.data);
        }).catch(error => {
            reject(error);
        })
    });

}

/*生成指定长度的随机数*/
function randomCode(length) {
    let chars = ['0','1','2','3','4','5','6','7','8','9'];
    let result = "";
    for(let i = 0; i < length ; i ++) {
        let index = Math.ceil(Math.random()*9);
        result += chars[index];
    }
    return result;
}
