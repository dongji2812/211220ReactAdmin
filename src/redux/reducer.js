import {combineReducers} from 'redux'

import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG} from './action-types'

const initHead = '首页'
function headTitle(state = initHead, action) {
    switch(action.type) {
        case SET_HEAD_TITLE: 
            return action.data
        default: 
            return state
    }
}

const initUser = storageUtils.getUser() 
function user(state = initUser, action) {
    switch(action.type) { 
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.errorMsg
            return {...state, errorMsg} //把最开始输入的state解构，并添加errorMsg后 构成新对象。
        default: 
            return state
    }
}

export default combineReducers({
    headTitle,
    user
})