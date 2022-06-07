import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input} from 'antd'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }
    
    render() {
        const {categorys, parentId} = this.props
        const {getFieldDecorator} = this.props.form

        return (
            <Form> {/* Form外不用套div */}
                <Item> {/* 用Item包一下Select和Input。 */}
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId //默认值。
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
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
                        })(
                        <Input placeholder='请输入分类名称'></Input>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create() (AddForm)