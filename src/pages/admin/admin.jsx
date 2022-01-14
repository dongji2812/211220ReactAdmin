import React,{Component} from "react";
import { Redirect, Route, Switch} from "react-router-dom";
import memoryUtils from "../../utils/memoryUtils";
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'//在下面 作为标签使用。
import Header from '../../components/header'//在下面 作为标签使用。

import Home from '../../pages/home/home' //Home在下面作为组件使用。共八个。
import Category from '../../pages/category/category'
import Product from '../../pages/product/product'
import User from '../../pages/user/user'
import Role from '../../pages/role/role'
import Bar from '../../pages/charts/bar'
import Line from '../../pages/charts/line'
import Pie from '../../pages/charts/pie'

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component{
    render () {
        const user = memoryUtils.user;
        if (!user || !user._id) {
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{height: '100%'}}>
            <Sider>
                <LeftNav></LeftNav>
            </Sider>
            <Layout>
              <Header>header</Header>
              <Content style={{margin:20, backgroundColor:'#fff'}}>
                  <Switch>
                      <Route path='/home' component={Home}/>
                      <Route path='/category' component={Category}/>
                      <Route path='/product' component={Product}/>
                      <Route path='/user' component={User}/>
                      <Route path='/role' component={Role}/>
                      <Route path="/charts/bar" component={Bar}/>
                      <Route path="/charts/pie" component={Pie}/>
                      <Route path="/charts/line" component={Line}/>
                      <Redirect to='/home'></Redirect>
                  </Switch>
              </Content>
              <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
            </Layout>
          </Layout>
        )
    }
}