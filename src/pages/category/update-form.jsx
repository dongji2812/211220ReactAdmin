import React, {Component} from 'react'
import { Form, Input } from 'antd'

const Item = Form.item

class updateForm extends Component {
    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    render() {
        const categoryName = this.props
        const {getFieldDecorator} = this.props.form //写在render函数下，不能直接写在类组件下，为何？

        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName,
                            rules: [
                                {required: true, message: '分类名称必须输入'} //rules是个数组，每个数组元素是个对象。
                            ]
                        })(<Input placeholder='请输入分类名称'></Input> /*  在没有没有文本的时候显示？ */)
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(updateForm)