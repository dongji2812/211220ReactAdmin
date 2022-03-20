import React from 'react'
import {HashRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

// 应用根组件

//创建类组件 并暴露出去
export default class App extends React.Component{//react所有组件名首字母必须大写，如App。   Component是react的属性。
    render(){
        return (
            /* <BrowserRouter> */
            <HashRouter>
              <Switch>{/* 只匹配其中一个 */}
                  <Route path='/login' component={Login}></Route> {/* Login是路由组件，表示登陆页面 */}
                  <Route path='/' component={Admin}></Route> {/* Admin是路由组件，表示后台管理主页页面 */}
              </Switch>
            </HashRouter>
            /*</BrowserRouter> */
        )  
    }
}