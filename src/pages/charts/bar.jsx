import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactECharts from 'echarts-for-react'

export default class Bar extends Component {

    state = {
        sales: [5, 20, 36, 10, 10, 20],
        stores: [7, 27, 37, 17, 17, 27]
    }

    getOption = (sales, stores) => {
        return  { //返回一个对象。
            title: {
              text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
              data: ['销量', '库存']
            },
            xAxis: {
              data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [
              {
                name: '销量',
                type: 'bar',
                data: sales
              },
              {
                name: '库存',
                type: 'bar',
                data: stores
              }
            ]
        }
    }

    update = () => {
        this.setState(state => ({ // 箭头函数的返回值是对象，形式为() => ({})。
            sales: state.sales.map(sale => sale + 1),
            stores: state.stores.map(store => store - 1)
        }))
    }

    render() {
        const {sales, stores} = this.state

        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button> {/* 这里不用箭头函数，为何？*/}
                    {/* 用不用箭头函数的区别？效果的不同？   调用函数时加不加括号的区别？*/}
                </Card>
                
                <Card title='柱状图'>
                    <ReactECharts option={this.getOption(sales, stores)}/>
                </Card>
            </div>
        )
    }
}