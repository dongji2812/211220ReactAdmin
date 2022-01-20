import React, {Component} from 'react'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const Option = Form.Option


class AddForm extends Component {
    
    render() {
        const {parentId} = this.props
        const {getFieldDecorator} = this.props.form
        return (
            <Form> {/* Form外不用套div */}
                <Item> {/* 用Item包一下Select和Input。 */}
                    {
                        getFieldDecorator('parentId')()
                    }
                    <Select>
                        <Option></Option>
                    </Select>
                </Item>
                <Item>
                    <Input placeholder='请输入分类名称'></Input>
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)