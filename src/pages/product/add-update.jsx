import { Card, Form, Icon, Input, Cascader, Button, message } from 'antd'
import React, {Component} from 'react'
import { reqAddOrUpdateProduct, reqCategorys } from '../../api'
import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    state = {
        options: []
    }

    constructor(props) {
        super(props)

        this.pw = React.createRef()
        this.editor = React.createRef()
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
        this.props.form.validateFields(async (error, values) => { //注意error, values的顺序，一定不能变。
            if (!error) {
                const {name, desc, price, categoryIds} = values
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs() //调用getImgs，加括号。
                const detail = this.editor.current.getDetail()
                const product = {name, desc, price, pCategoryId, categoryId, imgs, detail} //imgs, detail不是必填项。

                if (this.isUpdate) {
                    product._id = this.product._id
                }

                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate? '修改': '添加'} 商品成功！`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate? '修改': '添加'} 商品失败！`)
                }
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

        const {pCategoryId, categoryId, imgs, detail} = product
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
                        <PicturesWall ref={this.pw} imgs={imgs}/> {/* imgs={imgs}让 从修改点击进去 页面显示imgs。 */}
                    </Item>
                    <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/> {/* detail={detail}让 从修改点击进去 页面显示detail。 */}
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