import React, {Component} from 'react'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../link-button'
import './index.less'
import '../../api/index'

export default class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), //向ormateDate函数中传入实参Date.now()。
        dayPictureUrl: '',
        weather: ''
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state;

        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎</span>
                    <LinkButton>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>首页</div>
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