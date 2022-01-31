import React, {Component} from 'react'
import { Card, Icon, List } from 'antd'
import LinkButton from '../../components/link-button' //引入文件要加''。   默认整体暴露 就直接写组件名，分别暴露 就写{暴露部分}。
import {BASE_IMG_URL} from '../../utils/constants'

const Item = List.Item 

export default class ProductDetail extends Component {

    render() {
        const {name, desc, price, imgs, detail} = this.props.location.state.product
        const title = (
            <span>
                <LinkButton>
                    <Icon 
                    type='arrow-left'
                    style={{marginRight: 10, fontSize:20}}
                    onClick={()=>this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card title={title} className='product-detail'>    {/* title是const类型的，所以用{}。 */}
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span>商品</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span>   {/* 图片放在span里。 {js语句}也放在span里。*/}
                            {
                                imgs.map(img => 
                                    <img
                                        /* key={img}  不写也没报错，写不写这个有区别吗？？*/  
                                        className='product-img' 
                                        src={BASE_IMG_URL + img} 
                                        alt="img" 
                                    />)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}