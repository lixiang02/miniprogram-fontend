import React from 'react';
import { Button, Form, Row, Col, Select, Tag, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import * as api from './api'

const { Option } = Select;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: { 
    offset: 8,
    span: 16 
  },
}
const colors = [
  'magenta', 'red', 'volcano', 'gold', 'orange', 'green', 'lime', 
  'blue', 'cyan', 'purple', 'geekblue'
]

export default class Container extends React.Component {
  state={
    data: null,
    loading: false
  }
  componentDidMount() {
    const self = this
    let id = null
    if (this.props.location.search) {
      const tmpId = this.props.location.search.split(/id=|&/g).filter(e => e && e.indexOf('=') === -1 && e !== '?')[0]
      if (tmpId) {
        id = tmpId
      }
    }
    new Promise(async (resolve, reject) => {
        try {
          let state = { data: {} }
          console.log('---id--', id)

          if (id) {
            let result = await api.getItem(id)
            console.log('---detail--',  result)
            state = { 
              data: result, 
              imageUrl: result.url,
              type: result.type
            }
          } else {
            const imageTypes = await api.getALlTypes()
            console.log('---imageTypes--',  imageTypes)
            const type = imageTypes[0]
            state = {
              type,
              data: {
                type,
                imageTypes
              }
            }
          }
          self.setState(state)
          resolve()
        } catch (error) {
          reject(error)
        }
    })
  }
  async onFinish (values) {
    console.log('Success:', values);
    console.log('Success:', this.state);
    const { data: { _id } } = this.state

    if (_id) {
      values.id = _id
      await api.updateItem(values)
    } else {
      await api.addItem(values)
    }
    
    console.log('Result:', values)
    this.goBack()()
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }
  goBack() {
    return () => {
      this.props.history.goBack(-1)
    }
  }
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // this.getBase64(info.file.originFileObj, imageUrl =>
      //   this.setState({
      //     imageUrl,
      //     loading: false,
      //   }),
      // );
      this.goBack()()

    }
  };
  handleSelectChange(type) {
    this.setState({ type })
  }
  uploadButton() {
    return (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    )
  }

  render() {
    const { data, imageUrl, type } = this.state;
    const types = data && data.imageTypes ? data.imageTypes : []
    console.log('detail: ', data)
    return <div>
      {
        !data ? null : (
        <Form
          {...layout}
          name="basic"
          initialValues={{
            ...data
          }}
          onFinish={this.onFinish.bind(this)}
          onFinishFailed={this.onFinishFailed.bind(this)}
        >
          <Row>
            <Col span={16}>
              <Form.Item
                  label="图片类型"
                  name="type"
                  key="type"
                  rules={[
                    {
                      required: true,
                      message: '请选择标签类型!',
                    },
                  ]}
                >
                  <Select
                    allowClear
                    value={type}
                    onChange={this.handleSelectChange.bind(this)}
                  >
                    {
                      types.map((type) => {
                        return <Option key={type} value={type}>
                          <Tag 
                            color={colors[Math.round(Math.random() * colors.length)]} 
                            key={type}>
                              {type}
                          </Tag>
                        </Option>
                      })
                    }
                  </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Form.Item
                  label="列表图片"
                  name="image"
                  key="image"
                >
                  {
                    data._id ? (
                      <img src={data.url} style={{ maxWidth: '595px' }} alt="avatar" />
                    ) : (
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        data={{ type }}
                        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        action="http://ldx520.top/images"
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                      >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ maxWidth: '595px' }} /> : this.uploadButton()}
                      </Upload>
                    )
                  }
              </Form.Item>
            </Col>
          </Row>
          <Form.Item {...tailLayout}>
            <Row>
              {/*  */}
              {
                data && data._id ? (
                  <Col span={6}>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Col>
                ) : null
              }
              <Col span={6}>
                <Button className="goback" onClick={this.goBack()} >
                  返回
                </Button>
              </Col>
              <Col span={6}>
              </Col>
            </Row>
          </Form.Item>
        </Form>
        )
      }
    </div>
  }
}