import React from 'react'
//import { Button, message } from 'antd'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/login/login';
import Admin from './pages/admin/admin';

// 应用根组件

//创建类组件 并暴露出去
export default class App extends React.Component{//react所有组件名首字母必须大写，如App。   component是react的属性。
    render(){
        return (
            <BrowserRouter>
              <Switch>{/* 只匹配其中一个 */}
                  <Route path='/login' component={Login}></Route>
                  <Route path='/' component={Admin}></Route>
              </Switch>
            </BrowserRouter>
        )  
    }
}