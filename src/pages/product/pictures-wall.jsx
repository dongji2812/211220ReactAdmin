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
    } 课程讲授中并没有把这部分注释掉，但是这里注释掉并没有报错。*/

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

    handleChange = async ({file, fileList}) => {
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
        return this.state.fileList.map(file => file.name) //是return。
    }

    render () {
        const { previewVisible, previewImage, fileList } = this.state
        return (
            <div>
                <Upload
                action="/manage/img/upload"
                accept='image/*'
                name='image'
                listType="picture-card"
                fileList={fileList}
                onChange={this.handleChange}
                onPreview={this.handlePreview}
                >
                {fileList.length < 5 && '+ Upload'}     {/* 和讲授的语法不一致，效果一样 */}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}> 
                    <img alt="example" style={{ width: '100%' }} src={previewImage} /> 
                </Modal>
            </div>
        )
    }
}
