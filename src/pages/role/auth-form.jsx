import React, {PureComponent} from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree

export default class AuthForm extends PureComponent {//Role是父组件，AuthForm是子组件。 父组件要取子组件中的内容。

    static propTypes = {
        role: PropTypes.object
    }

    constructor (props) {
        super(props)

        const {menus} = this.props.role 
        this.state = { //constructor()中是this.state={}，不再是外面直接写state={}。
            checkedKeys: menus
        }
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode> 
            )
            return pre
        },[])
    }

    onCheck = checkedKeys => {
        /* console.log('onCheck', checkedKeys); */
        this.setState({ checkedKeys })
    }

    /* 获取所有选中的树节点checkedKeys，即选中元素的key构成的数组。 */
    getMenus = () => this.state.checkedKeys

    componentWillMount () {
        this.treeNodes = this.getTreeNodes(menuList) //返回值是数组的形式。
    }

    componentWillReceiveProps (nextProps) { //初始显示时不会调用，后续每打开一个角色，保证 都是该角色对应的menus。
        const {menus} = nextProps.role
        this.setState({checkedKeys: menus})
    }
    
    render() {

        const {role} = this.props
        const {checkedKeys} = this.state

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 },
        }

        return (
            <div>
                <Item label='角色名称：' {...formItemLayout}>
                    <Input value={role.name} disabled></Input>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys} //key是menuList数组中每项元素的key，checkedKeys是选中元素的key。
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>  
                </Tree>
            </div>
        )
    }
}