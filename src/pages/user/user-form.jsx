import React, {PureComponent} from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    
    render() {

        const {getFieldDecorator} = this.props.form
        const {roles, user} = this.props

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        }

        return (
            <Form {...formItemLayout}>
                <Item label='用户名：'>
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules:[
                                {required: true, message: '必须输入用户名'}
                            ]
                        })(<Input placeholder='请输入用户名'></Input>)
                    }
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码：'>
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                    rules:[
                                        {required: true, message: '必须输入密码'}
                                    ]
                                })(<Input type='password' placeholder='请输入密码'></Input>)
                            }
                        </Item>
                    )
                }
                <Item label='手机号：'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                            rules:[
                                {required: true, message: '必须输入手机号'}
                            ]
                        })(<Input placeholder='请输入手机号'></Input>)
                    }
                </Item>
                <Item label='邮箱：'>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                            rules:[
                                {required: true, message: '必须输入邮箱'}
                            ]
                        })(<Input placeholder='请输入邮箱'></Input>)
                    }
                </Item>
                <Item label='角色：'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                            rules:[
                                {required: true, message: '必须选择角色'}
                            ]
                        })(
                            <Select>
                                {roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)}
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)