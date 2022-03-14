import React, {Component} from 'react'
import {Card, Button, Table, Modal, message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles, reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils"
import {formateDate} from '../../utils/dateUtils'
 
export default class Role extends Component {//admin不占有角色，也不占有用户。

    state = {
        roles: [],
        role: {},
        isShowAdd: false,
        isShowAuth: false
    }

    constructor (props) {
        super(props) 

        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate //本来是 (create_time) => formateDate(create_time) 。
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data 
            this.setState({
                roles
            })
        }    
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }
        }
    }

    addRole = () => {//三步走。
        this.form.validateFields(async (error, values) => {
            if (!error) {
                const {roleName} = values
                this.form.resetFields()

                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success('添加角色成功！')

                    const role = result.data
                    this.setState(state => ({ //函数形式的state => ({})    注意这里的()。
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error('添加角色失败！')
                }

                this.setState({isShowAdd: false})
            }
        })
    }

    updateRole = async () => {
        const role = this.state.role //得到的role是对象的形式。
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now() //接口函数 根据Date.now()返回 授权时间的默认结果，再通过formateDate函数 格式化时间。
        role.auth_name = memoryUtils.user.username

        const result = await reqUpdateRole(role) //传入的role是对象的形式。
        if (result.status === 0) {
            message.success('设置角色权限成功！')
            this.setState({
                roles: [...this.state.roles]
            })
        }
        this.setState({isShowAuth: false})   
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getRoles()
    }

    render() {
        const {roles, role, isShowAdd, isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered //先设置bordered后添加角色列表  与 先添加角色列表后设置bordered 不同。前者会第一栏很长。
                    rowKey='_id' 
                    dataSource={roles}  
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={{type: 'radio', selectedRowKeys: [role._id]}}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色" 
                    visible={isShowAdd} 
                    onOk={this.addRole} 
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => {this.form = form}}
                    /> 
                </Modal>

                <Modal
                    title="设置角色权限" 
                    visible={isShowAuth} 
                    onOk={this.updateRole} 
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm ref={this.auth} role={role}/> 
                </Modal>
            </Card>
        )
    }
}