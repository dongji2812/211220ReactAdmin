import { message } from 'antd';
import axios from 'axios'

export default function ajax (url, data = {}, type = 'GET') { //第二个参数 一定是以对象的形式传入的。
    return new Promise ((resolve, reject) => {
        let promise;
        if (type === 'GET') {
            promise = axios.get (url, {params: data});
        } else {
            promise =  axios.post (url, data);
        }
        
        promise.then((response) => {
            resolve(response.data);
        }).catch((error => { //这里统一处理的是 请求失败 的情况。  还有其他类型的失败。
            message.error('请求出错了' + error.message)
        }))
    })
}