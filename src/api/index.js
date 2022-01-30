import { message } from 'antd';
import jsonp from 'jsonp';
import ajax from './ajax'

const BASE = '';

export const repLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST'); //调用ajax函数。

//export const repAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');

export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST');

export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize});

export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax(BASE + '/manage/product/search', {pageNum, pageSize, [searchType]:searchName})

export const reqWeather = (city) => { //没有调用函数，直接写函数体。  用jsonp解决 get类型请求 的跨域问题。
    return new Promise ((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`; //现在不能正常使用了。
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather});
            } else {
                message.error('获取天气信息失败!')
            }
        })
    })
}