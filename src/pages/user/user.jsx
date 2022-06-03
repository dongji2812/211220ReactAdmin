import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqAddOrUpdateUser, reqDeleteUser, reqUsers } from '../../api'
import UserForm from './user-form'

export default class User extends Component {
    state = {
        users: [],
        roles: [],
        isShow: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username' //要用字符串格式。
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id] //得到对象中，属性名role_id对应的属性值role.name。
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    initRoleNames = (roles) => { //创建一个 属性名role_id和属性值role.name相对应 的对象。
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames //this.roleNames是个对象。
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const {users, roles} = result.data
            this.initRoleNames(roles) //先这个。
            this.setState({ //再这个。才不会报错。
                users,
                roles
            })
        }
    }

    showAdd = () => {
        this.user = null
        this.setState({isShow: true})
    }

    showUpdate = (user) => {
        this.user = user
        this.setState({isShow: true})
    }

    addOrUpdateUser = () => {//三步走: 1.收集数据 2.发请求 3.更新列表。
        //const user = this.form.getFieldsValue() //获得的user是对象。   讲授用的是这种写法。
        //和以前不同，没有判断error，直接取 收集的对象。  
        //这样的话不满足验证规则，也可以提交。
        this.form.validateFields(async (error, values) => { //这里写的 和 讲授的 不一样。但是最终效果是一样的。
            //validateFields()和getFieldsValue() 是两个函数，别混淆。
            if (!error) {
                const {username, password, phone, email, role_id} = values
                const user = {username, password, phone, email, role_id}
                if (this.user) { //如果是更新。
                    user._id = this.user._id
                }
                this.form.resetFields()

                const result = await reqAddOrUpdateUser(user)
                if (result.status === 0) {
                    message.success(`${this.user ? '更新' : '添加'}角色成功！`)
                    this.getUsers()
                }

                this.setState({isShow: false})
            }
        })   
    }

    deleteUser = (user) => { //直接写Modal框。
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            /* icon: <ExclamationCircleOutlined />, */
            onOk: async () => {
              const result = await reqDeleteUser (user._id)
              if (result.status === 0) {
                message.success(`删除${user.username}用户成功！`)
                this.getUsers()
              }
            }                                                                   
        })
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getUsers()
    }

    render() {

        const title = <Button type='primary' onClick={() => this.showAdd()}>创建用户</Button> 
        //=直接写标签， 或=后先写()，()内再写标签。
        //注意onClick内是回调函数。
        const {users, roles, isShow} = this.state
        const user = this.user || {}

        return (
            <Card title={title}>
                <Table  //复制的以前的Table.
                bordered
                rowKey='_id'  
                dataSource={users} 
                columns={this.columns}
                pagination={{defaultPageSize: PAGE_SIZE}}
                />

                <Modal
                    title={user._id ? '更新用户' : '添加用户'} 
                    visible={isShow}
                    onOk={this.addOrUpdateUser} 
                    onCancel={() => { //回调函数内 要执行两个函数。
                        this.setState({isShow: false})
                        this.form.resetFields() //不管是点击ok还是点击cancel都需要置空。
                    }}
                >
                    <UserForm
                        setForm={(form) => {this.form = form}}
                        roles = {roles}
                        user = {user}
                    /> 
                </Modal>
            </Card>
        )
    }
}