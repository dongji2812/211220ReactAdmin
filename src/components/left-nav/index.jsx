import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import {connect} from 'react-redux'

import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
//import memoryUtils from '../../utils/memoryUtils'
import {setHeadTitle} from '../../redux/actions'

const { SubMenu } = Menu

class LeftNav extends Component {

/*  getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}></Icon>
                            <span>{item.title}</span>
                        </Link>
                  </Menu.Item>                                       
                )
            } else {
                return (
                    <SubMenu key={item.key} title={
                        <span>
                            <Icon type={item.icon}></Icon>
                            <span>{item.title}</span>
                        </span>
                    }>
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>                   
                )
            }
        })
    } */

    hasAuth = (item) => {
        const {key, isPublic} = item //menuList是数组，每个item是个对象。
        //const username = memoryUtils.user.username
        //const menus = memoryUtils.user.role.menus 打开网页的Local Storage发现user包含role属性，其属性值是menus数组。
        const username = this.props.user.username
        const menus = this.props.user.role.menus

        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if(item.children) { //item.children是数组，每个child是个对象。
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    getMenuNodes_reduce = (menuList) => {
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) { //每个数组元素item 都要判断是否满足this.hasAuth()。
                if (!item.children) {
                    if (item.key === path || path.indexOf(item.key) === 0){  //不仅下面的点击，路径匹配的时候也要更新redux状态。
                        this.props.setHeadTitle(item.title)
                    }
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}> {/* 点击的时候更新redux状态。*/}
                                <Icon type={item.icon}></Icon>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>                                       
                    ))
                } else {
                    /* const cItem = item.children.find(cItem => cItem.key === path) */
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0) //修正过。
                    if (cItem) {
                        this.openKey = item.key //需要打开子列表。item.key是一级列表项的key。
                    }
                    pre.push((
                        <SubMenu 
                            key={item.key} 
                            title={
                                <span>
                                    <Icon type={item.icon}></Icon>
                                    <span>{item.title}</span>
                                </span>
                            }>
                            {this.getMenuNodes_reduce(item.children)}     {/* 递归调用。 */}
                        </SubMenu>                   
                    ))
                }
            }  
            return pre;//注意 向数组中push东西后 一定要return数组。            
        },[])
    }

    componentWillMount () { //在componentWillMount ()中 这样渲染一次就行。 不用在render中每次都渲染列表。
        this.menuNodes = this.getMenuNodes_reduce(menuList)
    }    

    render() {
        let selectpath = this.props.location.pathname
        if (selectpath.indexOf('/product') === 0) { //处理product下的多个路径。
            selectpath = '/product'
        }
        const openKey = this.openKey

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"></img>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu //主列表。
                  selectedKeys={[selectpath]} //根据目前访问的路径 选中 左侧的导航栏。
                  defaultOpenKeys={[openKey]} //需要打开子列表。
                  mode="inline"
                  theme="dark"
                >
                    {
                        this.menuNodes //分列表。
                    }
                </Menu>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))