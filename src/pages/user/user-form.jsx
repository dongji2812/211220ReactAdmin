import React, {PureComponent} from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    
    render() {

        const {getFieldDecorator} = this.props.form

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        }

        return (
            <Form {...formItemLayout}>
                <Item label='用户名：'>
                    {
                        getFieldDecorator('username ', {
                            initialValue: '',
                            rules:[
                                {required: true, message: '必须输入用户名'}
                            ]
                        })(<Input placeholder='请输入用户名'></Input>)
                    }
                </Item>
                <Item label='密码：'>
                    {
                        getFieldDecorator('password', {
                            initialValue: '',
                            rules:[
                                {required: true, message: '必须输入密码'}
                            ]
                        })(<Input type='password' placeholder='请输入密码'></Input>)
                    }
                </Item>
                <Item label='手机号：'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: '',
                            rules:[
                                {required: true, message: '必须输入手机号'}
                            ]
                        })(<Input placeholder='请输入手机号'></Input>)
                    }
                </Item>
                <Item label='邮箱：'>
                    {
                        getFieldDecorator('email', {
                            initialValue: '',
                            rules:[
                                {required: true, message: '必须输入邮箱'}
                            ]
                        })(<Input placeholder='请输入邮箱'></Input>)
                    }
                </Item>
                <Item label='角色：'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: '',
                            rules:[
                                {required: true, message: '必须选择角色'}
                            ]
                        })(
                            <Select>
                                <Option value='1'>A</Option>
                                <Option value='2'>B</Option>
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)