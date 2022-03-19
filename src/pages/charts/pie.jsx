import React, {Component} from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react' //ReactEcharts 或 ReactECharts 效果都是对的。

export default class Pie extends Component {

    getOption = () => {
        return  {
            title: {
                text: 'Referer of a Website',
                subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
    }

    getOption2 = () => {
        return {
            backgroundColor: '#2c343c',
            title: {
              text: 'Customized Pie',
              left: 'center',
              top: 20,
              textStyle: {
                color: '#ccc'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            visualMap: {
              show: false,
              min: 80,
              max: 600,
              inRange: {
                colorLightness: [0, 1]
              }
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                  { value: 335, name: 'Direct' },
                  { value: 310, name: 'Email' },
                  { value: 274, name: 'Union Ads' },
                  { value: 235, name: 'Video Ads' },
                  { value: 400, name: 'Search Engine' }
                ].sort(function (a, b) {
                  return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                labelLine: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                },
                itemStyle: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                  return Math.random() * 200;
                }
              }
            ]
        }
    }

    /* update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            stores: state.stores.map(store => store - 1)
        }))
    } */

    render() {
        //const {sales, stores} = this.state

        return (
            <div>
                {/* <Card>
                    <Button type='primary' onClick={this.update}>更新</Button> 
                </Card> */}
                
                <Card title='饼图一'>
                    <ReactEcharts option={this.getOption()} style={{height: 300}}/>
                </Card>

                <Card title='饼图二'>
                    <ReactEcharts option={this.getOption2()} style={{height: 300}}/>
                </Card>
            </div>
        )
    }
}