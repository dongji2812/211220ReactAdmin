import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import { Modal} from 'antd'
import {connect} from 'react-redux'

import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../link-button' //在下面 作为标签使用。 
import './index.less'
import '../../api/index' 
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api/index'
import menuList from '../../config/menuConfig'


class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), //向ormateDate函数中传入实参Date.now()。
        dayPictureUrl: '',
        weather: ''
    }

    getTime = () => {
        this.intervalID = setInterval(()=>{
          const currentTime = formateDate(Date.now());
          this.setState({currentTime})
        },1000)
    }

    getWeather = async() => {
        const {dayPictureUrl, weather} = await reqWeather('南京'); //通过解构的形式{dayPictureUrl, weather} 获取reqWeather()函数的输出。
        this.setState({dayPictureUrl, weather})
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach( item => { //遍历menuList数组。
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                //const cItem = item.children.find(cItem => cItem.key === path)
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)//item.children数组的find（）方法。  修正过。
                if (cItem) {
                    title = cItem.title //是cItem.title不是item.children.title。
                }
            }
        })
        return title
    }

    logout = () => {
        Modal.confirm({
            title: '确定退出吗?',
            onOk: () => {
            //   console.log('OK');
            storageUtils.removeUser()
            memoryUtils.user = {}
            this.props.history.replace('/login')
            }
            /*onCancel() {
              console.log('Cancel');
            }, */
          })
    }

    componentDidMount () {
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount () { //清除定时器。否则退出后 会有报错。
        clearInterval(this.intervalID)
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state
        const username = memoryUtils.user.username
        //const title = this.getTitle()
        const title =this.props.headTitle

        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎,{username}</span>
                    <LinkButton onClick = {this.logout}>退出</LinkButton> {/* onClick后注意加{} */}
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt='weather'></img>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({headTitle: state.headTitle}),
    {}
)(withRouter(Header))