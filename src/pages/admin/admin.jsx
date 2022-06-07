import React, {Component} from "react"
import { Redirect, Route, Switch} from "react-router-dom"
import { Layout } from 'antd'
import {connect} from 'react-redux'

//import memoryUtils from "../../utils/memoryUtils"
import LeftNav from '../../components/left-nav'//在下面 作为标签使用。
import Header from '../../components/header'//在下面 作为标签使用。

import Home from '../../pages/home/home' //Home在下面作为组件使用。和下面一样，共9个。
import Category from '../../pages/category/category'
import Product from '../../pages/product/product'
import User from '../../pages/user/user'
import Role from '../../pages/role/role'
import Bar from '../../pages/charts/bar'
import Line from '../../pages/charts/line'
import Pie from '../../pages/charts/pie'
import NotFound from "../not-found/not-found"

const {Sider, Content, Footer} = Layout

class Admin extends Component{

    render () {
        //const user = memoryUtils.user
        const user = this.props.user

        if (!user || !user._id) {//如果user为0 那么跳转到login页面。
            return <Redirect to='/login'/>
        }
        
        return (
            <Layout style={{minHeight: '100%'}}>   {/* 这样底部会一直显示footer。 */}
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>

                <Layout>
                    <Header></Header>

                    <Content style={{margin:20, backgroundColor:'#fff'}}> {/* 默认是灰色，中间content设置为白色。 */}
                        <Switch>
                            <Redirect exact from='/' to='/home'></Redirect>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path="/charts/bar" component={Bar}/>
                            <Route path="/charts/pie" component={Pie}/>
                            <Route path="/charts/line" component={Line}/>
                            <Route component={NotFound}></Route> 
                            {/* 进到Admin组件后，从上到下匹配路径去响应的路由组件，如果上面都不满足，就去NotFound组件。 */}
                        </Switch>
                    </Content>

                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {}
)(Admin)