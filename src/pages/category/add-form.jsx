import React, {Component} from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option


class AddForm extends Component {
    static propTypes = {
        parentId: PropTypes.string.isRequired,
        categorys: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired,
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    
    render() {
        const {parentId, categorys} = this.props
        const {getFieldDecorator} = this.props.form
        return (
            <Form> {/* Form外不用套div */}
                <Item> {/* 用Item包一下Select和Input。 */}
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                        <Select>
                            <Option value='0'>一级分类</Option> {/* 字符串放在''里。 */}
                            {
                                categorys.map(c => <Option value={c._id}>{c.name}</Option>)  //遍历元素c生成标签。标签不要加{}。      变量放在{}里。
                            }
                        </Select>
                        )
                    } 
                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules:[
                                {required: true, message: '必须输入分类名称'}
                            ]
                        })(<Input placeholder='请输入分类名称'></Input>)
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)