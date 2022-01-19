import React, {Component} from 'react'
import { Card, Button, Icon, Table} from 'antd';
import LinkButton from '../../components/link-button';

export default class Category extends Component {
    
    render() {
        const title = '一级分类列表'

        const extra = (
            <Button type='primary'> 
                <Icon type='plus'></Icon>
                添加
            </Button>
        )
        const dataSource = [
            {
                "parentId": "61e7688b6bc9ec83b89160d6",
                "_id": "61e7691a6bc9ec83b89160d7",
                "name": "二级分类1",
                "__v": 0
            },
            {
                "parentId": "61e7688b6bc9ec83b89160d6",
                "_id": "61e76b2a6bc9ec83b89160d8",
                "name": "分类11",
                "__v": 0
            },
            {
                "parentId": "61e7688b6bc9ec83b89160d6",
                "_id": "61e76c986bc9ec83b89160d9",
                "name": "分类11",
                "__v": 0
            }
        ];
          
          const columns = [
            {
              title: '分类的名称',
              dataIndex: 'name', //字符串指定数组中每个对象的name。
            },
            {
                title: '操作',
                width: 300,
                render: () => (//看Table文档，render是个函数。
                    <span>
                        <LinkButton>修改分类</LinkButton>
                        <LinkButton>查看子分类</LinkButton>
                    </span>
                )
            }
          ];
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table 
                    bordered
                    rowKey='_id' //字符串指定数组中每个对象的_id。
                    dataSource={dataSource} 
                    columns={columns} />
                </Card>
            </div>
        )
    }
}