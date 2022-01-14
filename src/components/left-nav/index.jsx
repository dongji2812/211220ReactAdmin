import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import logo from '../../assets/images/logo.png'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;

class LeftNav extends Component {

/*     getMenuNodes_map = (menuList) => {
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

    getMenuNodes_reduce = (menuList) => {
        const path = this.props.location.pathname;

        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}></Icon>
                            <span>{item.title}</span>
                        </Link>
                  </Menu.Item>                                       
                ))
            } else {
                const cItem = item.children.find(cItem => cItem.key === path);
                if (cItem) {
                    this.openKey = item.key;
                }
                pre.push((
                    <SubMenu key={item.key} title={
                        <span>
                            <Icon type={item.icon}></Icon>
                            <span>{item.title}</span>
                        </span>
                    }>
                        {this.getMenuNodes_reduce(item.children)}
                    </SubMenu>                   
                ))
            }
            return pre;//注意 向数组中push东西后 一定要return数组。            
        },[])
    }

    componentWillMount () {
        this.menuNodes = this.getMenuNodes_reduce(menuList)
    }    

    render() {
        const selectpath = this.props.location.pathname;
        const openKey = this.openKey;

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"></img>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                  selectedKeys={[selectpath]}
                  defaultOpenKeys={[openKey]}
                  mode="inline"
                  theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}
export default withRouter(LeftNav)