import React, {Component} from 'react'
import { Card, Form, Icon, Input, Cascader, Button, message } from 'antd'

import memoryUtils from '../../utils/memoryUtils'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import { reqAddOrUpdateProduct, reqCategorys } from '../../api'

const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {
    state = {
        options: [] //最终结果为二维数组。
    }

    constructor(props) {
        super(props)

        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    /* 选中某项时的回调函数。 */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true

        /* 选中的option有可能为二级列表、一级列表。 */
        const subCategorys = await this.getCategorys(targetOption.value) //targetOption.value即parentId。
        targetOption.loading = false

        if (subCategorys && subCategorys.length > 0) { //返回值存在，表示选中的option即selectedOptions是二级列表。
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            targetOption.children = childOptions
        } else { //返回值不存在，表示选中的option即selectedOptions是一级列表。
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options]
        })
    }

    /* 该函数的作用是 判断是一级列表还是二级列表。 */
    getCategorys = async(parentId) => { 
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data

            if (parentId === '0'){ //如果是一级列表，就调用initOptions()函数。
                this.initOptions(categorys) //当前async函数返回的promsie 是成功状态 且 值为undefined。
            }else {
                return categorys //如果是二级列表，就返回二级列表的数组。
                //当前async函数返回的promsie 是成功状态 且 值为categorys。这里是async函数返回promise对象。
            } 
        }
    }

    initOptions = async (categorys) => { //初始化options，一级列表叶子节点还没确定最终结果，二级列表还没初始化。
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        /* 修改时需要提前初始化二级列表。 */
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if (isUpdate && pCategoryId !== '0') {//if内是个整体，表示是 修改情况下的二级分类下的商品。
            const subCategorys = await this.getCategorys(pCategoryId) 
            //await后面是一个promise对象。如果有一个promise对象，那么await promise对象，就可以直接取到promise对象的结果值。
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = childOptions
        }

        /* 一级列表、二级列表都需要更新options。 */
        this.setState({options})
    }

    submit = () => {
        this.props.form.validateFields(async (error, values) => { //注意error, values的顺序，一定不能变。
            if (!error) {
                const {name, desc, price, categoryIds} = values //收集受控子组件的数据。
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                /* 收集非受控子组件的数据。 */
                const imgs = this.pw.current.getImgs() //调用getImgs，加括号。
                const detail = this.editor.current.getDetail()
                const product = {name, desc, price, pCategoryId, categoryId, imgs, detail} //imgs, detail不是必填项。

                if (this.isUpdate) {
                    product._id = this.product._id
                }

                const result = await reqAddOrUpdateProduct(product)
                if (result.status === 0) {
                    message.success(`${this.isUpdate? '修改': '添加'}商品成功！`) //``内是模板字符串，通过`${变量} 文字`可拼接变量和文字。
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate? '修改': '添加'}商品失败！`)
                }
            }
        })
    }

    validatePrice = (rule, value, callback) =>{ //rule没用上。
        if (value*1 > 0) {
            callback() //验证通过。
        } else {
            callback('商品价格必须大于0')
        }
    }

    componentWillMount () {
        //const product = this.props.location.state
        const product = memoryUtils.product
        //this.isUpdate = !!product
        this.isUpdate = !!product._id
        this.product = product || {} //注意一定要有||{}。
    }

    componentDidMount () {
        this.getCategorys('0') //初始化列表。一级列表叶子节点还没确定最终结果，二级列表还没初始化。修改时需要提前初始化二级列表。
    }

    componentWillUnmount () {
        memoryUtils.product = {}
    }

    render() {
        const {isUpdate, product} = this

        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = [] //添加时，数组为空。
        if (isUpdate) { //修改时，数组一个元素或两个元素。
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
                <Form {...formItemLayout}> {/* 这里formItemLayout指定在form上。也可以单独指定在某个item上，表示该item特别的配置。 */}
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
                                initialValue: categoryIds, //默认值为数组，该数组包含一个元素或两个元素。
                                rules:[
                                    {required: true, message: '必须选择商品分类'},
                                ]
                            })(<Cascader 
                                    placeholder='请选择商品分类'
                                    options={this.state.options} //要展示的数据，options可以实时变化。比如从一维数组到二维数组。
                                    loadData={this.loadData} //选中某项时的回调函数。
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