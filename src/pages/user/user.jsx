import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqDeleteUser, reqUsers } from '../../api'
import UserForm from './user-form'

export default class User extends Component {
    state = {
        users: [],
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
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    initRoleNames = (roles) => {
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
            this.setState({
                users,
                roles
            })
            this.initRoleNames(roles)
        }
    }

    addOrUpdateUser = () => {

    }

    deleteUser = (user) => { //直接写Modal框。
        Modal.confirm({
            title: `确认删除${user.name}吗？`,
            /* icon: <ExclamationCircleOutlined />, */
            onOk: async () => {
              const result = await reqDeleteUser (user._id)
              if (result.status === 0) {
                  message.success(`删除${user.name}用户成功！`)
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

        const title = <Button type='primary' onClick={() => this.setState({isShow: true})}>创建用户</Button> 
        //=直接写标签， 或=后先写()，()内再写标签。
        //注意onClick内是回调函数。
        const {users, isShow} = this.state

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
                    title="添加用户" 
                    visible={isShow} 
                    onOk={this.addOrUpdateUser} 
                    onCancel={() => this.setState({isShow: false})}
                >
                    <UserForm
                        setForm={(form) => {this.form = form}}
                    /> 
                </Modal>
            </Card>
        )
    }
}