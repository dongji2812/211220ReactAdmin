import { message } from 'antd';
import jsonp from 'jsonp';
import ajax from './ajax'

const BASE = '';

export const repLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST'); //调用ajax函数。

//export const repAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');

export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId});

export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST');
//要求输入参数 和 (parentId, categoryName) 顺序一致。

export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST');
//要求输入参数 和 ({categoryId, categoryName}) 名字一致。

export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId});

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize});

export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax(BASE + '/manage/product/search', {pageNum, pageSize, [searchType]:searchName})
//函数的输入 是四个参数，函数实际调用是三对属性名和属性值。

export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id? 'update' : 'add'), product, 'POST') //(product)中 product是对象的格式。

export const reqRoles = () => ajax(BASE + '/manage/role/list')

export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

export const reqUsers = () => ajax(BASE + '/manage/user/list')

export const reqDeleteUser = (userId) => ajax(BASE + 'manage/user/delete', {userId}, 'POST')

export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')//user_id的情况 需要看参数user。

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