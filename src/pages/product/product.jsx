import React, {Component} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import ProductHome from './home' //从某个文件引入组件名称。
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'


export default class Product extends Component {
    render() {
        return (
           <Switch>
               <Route path='/product' component={ProductHome} exact></Route>
               <Route path='/product/detail' component={ProductDetail}></Route>
               <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
               <Redirect to='/product'></Redirect>
           </Switch>
        )
    }
}