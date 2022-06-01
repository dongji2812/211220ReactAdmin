import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd'

import { reqDeleteImg } from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'


export default class PicturesWall extends React.Component { 

    static propTypes = {
        imgs: PropTypes.array
    }
    
    /* state = {
        previewVisible: false,
        previewImage: '', 
        fileList: []
    }*/

    constructor (props) {
        super(props)

        let fileList = []
        const {imgs} = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({ //注意这里的括号们。
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }

        this.state = {
            previewVisible: false,
            previewImage: '', 
            fileList
        }
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,   
            previewVisible: true,
        })
    }

    handleChange = async ({file, fileList}) => { //图片上传成功/删除成功 后的监听回调函数。
        if (file.status === 'done') {
            const result = file.response//这里特殊。它是通过response获取结果，其它是调用函数获取结果。

            if (result.status === 0) {
                message.success('上传图片成功！')
                
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败！')
            } 
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功！')
            } else {
                message.error('删除图片失败！')
            } 
        }
        this.setState({fileList})
    }

    getImgs = () => {
        return this.state.fileList.map(file => file.name) //是return。 父组件调用的时候要这个返回结果。
    }

    render () {
        const { previewVisible, previewImage, fileList } = this.state
        /* const uploadButton = (
            <div>
              <Icon type="plus" />
              <div>Upload</div>
            </div>
        )*/
        return (
            <div>
                <Upload
                    action="/manage/img/upload" //这里写了接口地址，这里也会发送请求，是组件内部发送请求。
                    accept='image/*'
                    name='image' //因为后台接口函数的key叫image，value是上传的图片。 所以这里name也设置为image。
                    listType="picture-card"
                    fileList={fileList}
                    onChange={this.handleChange}
                    onPreview={this.handlePreview} //大图预览。
                    >
                    {/* {fileList.length >= 4 ? null : uploadButton} 讲授的语法。*/}
                    {/*uploadButton代表没有数量限制，一直有uploadButton的加号*/}
                    {fileList.length < 5 && '+ Upload'}     {/* 满足前面条件，才执行后面语句。和讲授的语法不一致，效果一样。 */}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}> 
                    <img alt="example" style={{ width: '100%' }} src={previewImage} /> 
                </Modal>
            </div>
        )
    }
}
