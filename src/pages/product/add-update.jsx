import { Card, Form, Icon, Input, Button } from 'antd'
import React, {Component} from 'react'
import { reqCategorys } from '../../api'
import LinkButton from '../../components/link-button'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    state = {
        options: []
    }

    getCategorys = async(parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            this.initOptions(categorys)
        }
    }

    validatePrice = (rule, value, callback) =>{ //rule没用上。
        if (value*1 > 0) {
            callback()
        } else {
            callback('商品价格必须大于0')
        }
    }

    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
    
        // load options lazily
        setTimeout(() => {
          targetOption.loading = false;
          targetOption.children = [
            {
              label: `${targetOption.label} Dynamic 1`,
              value: 'dynamic1',
            },
            {
              label: `${targetOption.label} Dynamic 2`,
              value: 'dynamic2',
            },
          ];
          setOptions([...options]);
        }, 1000);
      };

    submit = () => {
        this.props.form.validateFields((value,error) => {
            if (!error) {
                alert('发送ajax请求')
            }
        })
    }

    componentDidMount () {
        getCategorys('0')
    }

    render() {
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{fontSize: 20}}></Icon>
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
                    <Item>
                        <Cascader options={options} loadData={loadData} onChange={onChange} changeOnSelect />
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