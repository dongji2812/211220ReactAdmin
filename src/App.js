import React from 'react'
import { Button, message } from 'antd'

// 应用根组件

//创建类组件 并暴露出去
export default class App extends React.Component{//react所有组件名首字母必须大写。component是react的属性。

    handleClick = () => {
        message.success('成功啦');
    }
    render(){
        return (
            <Button type="primary" onClick={this.handleClick}>antd</Button>
        )  
    }
}