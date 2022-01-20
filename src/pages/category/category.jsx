import React, {Component} from 'react'
import { Card, Button, Icon, Table, message, Modal} from 'antd';
import LinkButton from '../../components/link-button';
import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api';
import addForm from './add-form';
import updateForm from './update-form';

export default class Category extends Component {
    state = {
        /* loading: false, */
        categorys: [],
        subcategorys: [],
        parentId: '0',//字符串的格式，字符串'0'。
        parentName: '',
        showStatus: 0 //数字0.
    }

    initColumns = () => {
        this.columns = [//这个数组渲染一次就够了，没必要放在render里。
            {
              title: '分类的名称',
              dataIndex: 'name', //字符串指定数组中每个对象的name。
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (//看Table文档，render是个函数。
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton> {/* 点击后调用xx函数，传入的参数为本行category，调用时传入的参数为实参。 */}
                        {this.state.parentId === '0'? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
          ];
    }

    getCategorys = async() => {
        this.setState({loading: true})
        const {parentId} = this.state
        const result = await reqCategorys(parentId)
        this.setState({loading: false})
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.setState({categorys})
            } else {
                this.setState({subcategorys: categorys})
            }
        }else {
            message.error('获取分类列表失败')
        }
    }

    showSubCategorys = (category) => { //这里的category是形参。函数调用时候传入参数为实参。
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //看React的API文档，找到API中的React.Component，找到setState()使用说明，发现它的第二个参数可以是回调函数。           回调函数在this.setState()函数括号内。
            this.getCategorys()
        })
    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subcategorys: []
        })
    }

    showAdd = () => {
        this.setState({showStatus: 1})
    }

    showUpdate = (category) => { //这里的category是形参。函数调用时候传入参数为实参。
        this.category = category //保存该行category。再在render中读取this.category。
        this.setState({showStatus: 2})
    }

    handleCancel = () => {
        this.form.resetFields()
        this.setState({showStatus: 0})
    }

    addCatrgory = () => {
        this.setState({showStatus: 0})
    }

    updateCatrgory = async() => {
        this.setState({showStatus: 0})

        const categoryId = this.category._id  //上面的函数 已经在this中存过category了。
        const categoryName = this.form.getFieldValue('categoryName')
        this.form.resetFields() //清除在Input框中输入的数据。
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status === 0) {
            this.getCategorys()
        }
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getCategorys()
    }
    
    render() {
        const {parentId, parentName, categorys, subcategorys, showStatus, loading} = this.state
        const category = this.category || {} //点击修改分类时会把当前行的category存到这里，刚开始没点击时category是没有值的，所以或上空对象，防止报错。

        const title = parentId === '0'? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{margin: 5}}></Icon>
                <span>{parentName}</span>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={this.showAdd}>  {/* 是antd的Button，不是自带的button。 */}
                <Icon type='plus'></Icon>
                添加
            </Button>
        )    

        return (
            <Card title={title} extra={extra}> {/* Card外不用套div。 */}
                <Table 
                loading={loading}
                bordered
                rowKey='_id' //指定唯一行，不然会报错。   字符串格式 指定数组中每个对象的_id。 
                dataSource={parentId === '0'? categorys : subcategorys} 
                columns={this.columnss}
                pagination={{defaultPageSize: 5, showQuickJumper: true}} //看table的API找到pagination，看到其为对象类型。再看pagination文档的API，找到defaultPageSize和showQuickJumper。
                />

                <Modal /* Modal要写在card里。 */
                    title="添加分类" 
                    visible={showStatus === 1} 
                    onOk={this.addCatrgory} 
                    onCancel={this.handleCancel}>
                        <addForm
                        /* parentId={} */
                        >
                        </addForm>
                </Modal>

                <Modal 
                    title="修改分类" 
                    visible={showStatus === 2} 
                    onOk={this.updateCatrgory} 
                    onCancel={this.handleCancel}>
                </Modal>
                <updateForm
                    categoryName={category.name} //自己设置的categoryName属性。  render中读取了 点击修改分类函数调用时传入的实参该行category。
                    setForm={(form) => {this.form = form}} //传过来的数据存到this.form中。
                >
                </updateForm>
            </Card>
        )
    }
}