import { Card, Form, Icon, Input, Cascader, Button } from 'antd'
import React, {Component} from 'react'
import { reqCategorys } from '../../api'
import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    state = {
        options: []
    }

    initOptions = async (categorys) => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0') {//if内是个整体，表示是 修改情况下的二级分类下的商品。
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = childOptions
        }
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
                isLeaf: true
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

    componentWillMount () {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {} //注意一定要有||{}。
    }

    componentDidMount () {
        this.getCategorys('0')
    }

    render() {
        const {isUpdate, product} = this

        const {pCategoryId, categoryId} = product
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            } 
        }

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        }

        const {getFieldDecorator} = this.props.form

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{fontSize: 20}} onClick={() => this.props.history.goBack()}></Icon>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules:[{required: true, message: '必须输入商品名称'}]
                            })(<Input placeholder='请输入商品名称'></Input>)
                        }
                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules:[{required: true, message: '必须输入商品描述'}]
                            })(<TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }}/>)
                        }
                        
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules:[
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>)
                        }
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules:[
                                    {required: true, message: '必须选择商品分类'},
                                ]
                            })(<Cascader 
                                placeholder='请选择商品分类'
                                options={this.state.options} 
                                loadData={this.loadData} 
                                /* onChange={onChange} 
                                changeOnSelect  */
                            />)
                        }
                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall/>
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