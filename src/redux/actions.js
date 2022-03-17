import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG} from './action-types'
import {reqLogin} from '../api'
import storageUtils from '../utils/storageUtils'

export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})

export const receiveUser = (user) => ({type: RECEIVE_USER, user}) //action指的是 返回的action对象 或 下面的action函数。

export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

export const login = (username, password) => {
    return async dispatch => {
        const result = await reqLogin(username, password)
        if (result.status === 0) {
            const user = result.data
            storageUtils.saveUser(user) //把返回结果user对象 更新到local中。
            dispatch(receiveUser(user)) //把返回结果user对象 更新到redux状态内存中。
        } else {
            const msg = result.msg  //"msg": "用户名或密码不正确!"
            dispatch(showErrorMsg(msg)) //把返回结果msg的属性值 更新到redux状态内存中。   
        }
    }
}