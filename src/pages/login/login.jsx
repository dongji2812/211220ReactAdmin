import React,{Component} from 'react'
import {Form, Icon, Input, Button} from 'antd' //Icon 指框里的图标。
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'

import './login.less'
import logo from '../../assets/images/logo.png' //引入图片。  该图片是公用的，所以放在外面文件夹。
/* import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils' */
import {login} from '../../redux/actions'

const Item = Form.Item

class Login extends Component{

    handleSubmit = (e) => {
        e.preventDefault() //阻止表单的默认提交事件。

        //this.props.form.validateFields(async (err, values) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //console.log('校验成功');
                const {username, password} = values
              /*const result = await reqLogin (username, password)
                if (result.status === 0) {
                    message.success('登陆成功')

                    const user = result.data
                    storageUtils.saveUser(user)                 
                    memoryUtils.user = user
                    
                    this.props.history.replace('/home') //跳转到admin页面下的home页面。 解决退出后再登陆 header处 redex状态的错误。              
                } else {
                    message.error(result.msg)
                } */
                this.props.login(username, password)
            } else {
                console.log('校验失败')
            }
        })
    }

    render () {
        //const user = memoryUtils.user
        const user = this.props.user
        if (user && user._id) { //如果user有值 那么跳转到/页面，即Admin后台管理主页页面。后续/页面会自动跳转到/home页面。
            return <Redirect to='/'/> /* 或者return <Redirect to='/home'/> 直接跳转到home页面*/
        }

        const errorMsg = this.props.user.errorMsg //user是指容器组件传进来的user，也就是reducer中 总state中的 user函数的最新状态。
        //user.errorMsg是指 user函数的最新状态中的errorMsg。如果是RECEIVE_USER的话，该值是undefined。如果是SHOW_ERROR_MSG的话，该值正常。

        const form = this.props.form
        const {getFieldDecorator} = form

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目: 后台管理系统</h1>
                </header>

                <section className="login-content">
                    <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{errorMsg}</div>
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>{/* 用户名input框。 */}
                            {
                                getFieldDecorator('username', {
                                    rules: [
                                        {required: true, message: '用户名必须输入'},
                                        {min: 4, message: '用户名至少4位'},
                                        {max: 12, message: '用户名最多12位'},
                                        {pattern: /^[A-z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成'}
                                    ],
                                    initialValue:'admin'
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                                        //prefix的值可以是标签结构。Icon是antd中的图标，图标的类型是user。
                                        placeholder="用户名"
                                    />
                                )                               
                            }
                        </Item>

                        <Form.Item>{/* 密码input框。 */}
                            {
                                getFieldDecorator('password',{
                                    rules: [
                                        {required: true, message: '密码必须输入'},
                                        {min: 4, message: '密码至少4位'},
                                        {max: 12, message: '密码最多12位'},
                                        {pattern: /^[A-z0-9_]+$/, message: '密码必须是英文、数字或下划线组成'}
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )                            
                            }                           
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button"> 
                            {/* 按钮分为普通按钮和提交按钮。htmlType="submit"表示提交按钮。 */}
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
const WrapLogin = Form.create()(Login)
export default connect( 
    //connect传两个参数。
    //第一个参数是一般属性，第一个参数是函数的形式。一般用于读取redux中的状态数据。简称读。  数据来自于总reducer的总state。 
    //第二个参数是函数属性，第二个参数是对象的形式。一般用于更新redux中的状态数据。简称写。  函数来自于对actions中 同步action对象/异步action函数 的包装。
    //调用函数后，（先dispatch） 然后reducer，这样完成redux中状态的更新。
    state => ({user: state.user}), //箭头函数参数是state，这里的state指的是总reducer的总state。因为函数体中要用到state.user。
    {login}
)(WrapLogin)