import { Card, Form, Icon, Input, Cascader, Button } from 'antd'
import React, {Component} from 'react'
import { reqCategorys } from '../../api'
import LinkButton from '../../components/link-button'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    state = {
        options: []
    }

    initOptions = (categorys) => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        this.setState({options})
    }

    getCategorys = async(parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0'){
                this.initOptions(categorys) //再单独创建一个initOptions（）函数。
            }else {
                return categorys
            } 
        }
    }

    validatePrice = (rule, value, callback) =>{ //rule没用上。
        if (value*1 > 0) {
            callback()
        } else {
            callback('商品价格必须大于0')
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false

        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options]
        })
    }
        

    submit = () => {
        this.props.form.validateFields((value,error) => {
            if (!error) {
                alert('发送ajax请求')
            }
        })
    }

    componentDidMount () {
        this.getCategorys('0')
    }

    render() {
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{fontSize: 20}} onClick={() => this.props.history.goBack()}></Icon>
                </LinkButton>
                <span>添加商品</span>
            </span>
        )
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        }
        const {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue:'',
                                rules:[{required: true, message: '必须输入商品名称'}]
                            })(<Input placeholder='请输入商品名称'></Input>)
                        }
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue:'',
                                rules:[{required: true, message: '必须输入商品描述'}]
                            })(<TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }}/>)
                        }
                        
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue:'',
                                rules:[
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>)
                        }
                    </Item>
                    <Item label='商品分类'>
                        <Cascader 
                            options={this.state.options} 
                            loadData={this.loadData} 
                            /* onChange={onChange} 
                            changeOnSelect  */
                        />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)