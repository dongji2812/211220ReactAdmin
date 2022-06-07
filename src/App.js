// 应用根组件。第一个组件。
import React from 'react'
import {HashRouter, Route, Switch } from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

//创建类组件 并暴露出去
export default class App extends React.Component{//react所有组件名首字母必须大写，如App。   
    //Component是react的属性，所以上面就没引入{Component} from react。
    
    render(){
        return (
            /* <BrowserRouter>  不带#号http://localhost:3000/home  */
            <HashRouter> {/* 带#号http://localhost:3000/#/home */}
              <Switch>{/* 只匹配其中一个 */}
                  <Route path='/login' component={Login}></Route> {/* Login是路由组件，表示登陆页面 */}
                  <Route path='/' component={Admin}></Route> {/* Admin是路由组件，表示后台管理主页页面 */}
                  {/* 进入到Admin路由组件后，再根据Admin中的要求 跳转到响应的组件。*/}
              </Switch>
            </HashRouter>
            /*</BrowserRouter> */
        )  
    }
}