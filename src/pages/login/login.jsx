import React,{Component} from 'react'; 
import {
    Form,
    Icon,//框里的图标。
    Input,
    Button,
    message
  } from 'antd';

import './login.less'
import logo from '../../assets/images/logo.png' //引入图片。
import {repLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { Redirect } from 'react-router-dom';

const Item = Form.Item; 

class Login extends Component{

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                //console.log('校验成功');
                const {username, password} = values;
                const result = await repLogin (username, password);
                if (result.status === 0) {
                    message.success('登陆成功');

                    const user = result.data;
                    storageUtils.saveUser(user);                   
                    memoryUtils.user = user;
                    

                    this.props.history.replace('/');                   
                } else {
                    message.error(result.msg);
                }
            } else {
                console.log('校验失败');
            }
        })
    }

    render () {
        const user = memoryUtils.user;
        if (user && user._id) {
            return <Redirect to='/'/>
        }

        const form = this.props.form;
        const {getFieldDecorator} = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
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
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} //prefix是带有前缀图标的input。它的值可以是ReactNode即标签结构。Icon是图标，图标的类型是user。
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
const WrapLogin = Form.create()(Login);
export default WrapLogin;