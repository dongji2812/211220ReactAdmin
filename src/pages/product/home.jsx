import React, {Component} from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option

export default class ProductHome extends Component {
    state = { //状态的 所有属性名 都是变量。
        loading: false,
        total: 0,
        products: [],
        searchType: 'productName',
        searchName: ''
    }

    initColumns = () => {
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (price) => '￥' + price //render是个箭头函数。
            },
            {
              width: 100,
              title: '状态',
              /* dataIndex: 'status', */
              render: (product) => {//render是个箭头函数。  有标签有文本，结构比较复杂，所以自己写一个return。
                const {_id, status} = product
                const newStatus = status === 1 ? 2 : 1
                  return(
                      <span>
                          <Button
                              type='primary' 
                              onClick={() => {this.updateStatus(_id, newStatus)}}
                          >
                              {status === 1 ? '下架' : '上架'}
                          </Button>
                          <span>{status === 1 ? '在售' : '已下架'}</span>
                      </span>
                  )
                }
            },
            {
              width: 100,
              title: '操作',
              render: (product) => { //每个product是对象的形式。
                  return (
                    <span>
                      <LinkButton onClick={()=>this.props.history.push('/product/detail', {product})}>详情</LinkButton>    {/* push()内 传递的是字符串格式。  push()内传递两个参数，第一个参数是目标组件的路径，第二个参数是要传递给目标组件的数据。 */}
                      <LinkButton>修改</LinkButton>
                    </span>
                  )
                }
            },
        ];
    }

    getProducts = async(pageNum) => { //getProducts()一个参数。
        this.pageNum = pageNum
        this.setState({loading: true})

        const {searchType, searchName} = this.state
        let result
        if (searchName) {
            result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchType, searchName}) //reqSearchProducts一个参数，是对象的形式。   对象中，有的属性值可简写。
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE) //reqProducts两个参数。
        }
        
        this.setState({loading: false})
        if (result.status === 0) {
            const {total, list} = result.data;
            this.setState({
                total,
                products: list
            })
        }
    }

    updateStatus = async(productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getProducts(1) //调用该函数，传递的实参都是1，展示pageNum=1的结果，即第一页的结果。    展示其他页，页码切换，用的是table的onchange函数。
    }

    render() {
        const {loading, total, products, searchType, searchName} = this.state
        const title = (
            <span>
                <Select 
                value={searchType} //Select的默认值 要看变量searchType 和 下面option的哪个value常量值匹配。
                style={{width:150}} 
                onChange={value => this.setState({searchType: value})} //选中的option发生改变时（value发生改变时），变量searchType改变。
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input 
                placeholder='请输入关键字' 
                value={searchName} //Input的默认值 是变量searchName。
                style={{width:150, margin:'0 15px'}} 
                onChange={event => this.setState({searchName: event.target.value})} //input框的内容发生改变时（value发生改变时），变量searchName改变。
                >
                </Input>
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>    {/* 调用该函数，传递的实参都是1，展示pageNum=1的结果，即第一页的结果。    展示其他页，页码切换，用的是table的onchange函数。 */}
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus'></Icon>     {/* type类型是字符串格式的。 */}
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
            <Table
            bordered
            loading={loading}
            rowKey='_id' 
            dataSource={products} 
            columns={this.columns}
            pagination={{
                total,
                defaultPageSize: PAGE_SIZE,
                showQuickJumper: true,
                onChange: this.getProducts //onChange的值是个函数。如果值是函数，那么意思就是回调函数。     回调函数传入的形参就是调用函数的实参，所以这里简写成这样。
            }} 
            />
            </Card>
        )
    }
}