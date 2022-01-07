import React,{Component} from "react";
import {
    Form,
    Icon,//框里的图标。
    Input,
    Button
  } from 'antd';
 
import './login.less'
import logo from './images/logo.png'//引入图片。

const Item = Form.Item; 

export default class Login extends Component{
    render () {
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} //prefix是带有前缀图标的input。它的值可以是ReactNode即标签结构。Icon是图标，图标的类型是user。
                                placeholder="用户名"
                            />
                        </Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"> {/* 按钮分为普通按钮和提交按钮。htmlType="submit"表示提交按钮。 */}
                            登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}