import React from 'react'
import { Upload, Modal, message } from 'antd'


export default class PicturesWall extends React.Component { 
    state = {
        previewVisible: false,
        previewImage: '', 
        fileList: []
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,   
            previewVisible: true,
        })
    }

    handleChange = ({file, fileList}) => {
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
                {fileList.length < 5 && '+ Upload'}     {/* 和之前的语法不一致，效果一样 */}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}> 
                    <img alt="example" style={{ width: '100%' }} src={previewImage} /> 
                </Modal>
            </div>
        )
    }
}
