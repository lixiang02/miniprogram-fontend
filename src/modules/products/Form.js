import React from 'react';
import { Input, Tag, Button, Form, Row, Col, Select, Upload, Modal, InputNumber } from 'antd';
import * as api from './api'

const colors = [
  'magenta', 'red', 'volcano', 'gold', 'orange', 'green', 'lime', 
  'blue', 'cyan', 'purple', 'geekblue'
]
// const types = ['花篮礼盒', '企业花篮', '每周鲜花', '家养鲜花']
const imageUrl = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
// const coverUrl = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
const { Option } = Select;
const { TextArea } = Input;
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
const fileList = [
  {
    uid: '1',
    name: 'image.png',
    status: 'done',
    url: imageUrl
  }
]
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class Container extends React.Component {
  state={
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: fileList,
    data: null,
    types: [],
    typeId: null,
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
          let state = null
          if (id) {
            let result = await api.getItem(id)
            console.log('---detail--',  result)
            const type =  result.types.find(e => e.name === result.type)
            state = { data: result, types: result.types, typeId: type ? type._id : null }
          } else {
            const types = await api.getTypes()
             state = { data: {}, types, typeId: null }
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
    const { typeId, data: { _id } } = this.state
    delete values.type

    const result = Object.assign({}, values, { typeId })
    if (_id) {
      result.id = _id
      await api.updateItem(result)
    } else {
      await api.addItem(result)
    }

    // let formData = new FormData();
    // formData.append('name', this.name);
    // formData.append('age', this.age);
    // formData.append('file', this.file);
    
    console.log('Result:', result)
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
  onChangeSelect(key) {
    return (value) => {

      if (key === 'type') {
        // ...
        const type =  this.state.types.find(e => e.name === value)
        this.setState({ typeId: type ? type._id : null })
      }
    }
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    console.log('-handlePreview--file--', file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });
  render() {
    const { previewVisible, previewImage, fileList, previewTitle, data, types } = this.state;
    console.log('---fileList----', fileList)
    console.log('---data----', data)
      return (
        <div>
          {
            !data ? null : (
            <Form
              {...layout}
              name="basic"
              initialValues={{
                remember: true,
                ...data
              }}
              onFinish={this.onFinish.bind(this)}
              onFinishFailed={this.onFinishFailed.bind(this)}
            >
              <Row>
                <Col span={16}>
                  <Form.Item
                      label="名称"
                      name="name"
                      key="name"
                      rules={[
                        {
                          required: true,
                          message: '请输入名称!',
                        },
                      ]}
                    >
                    <Input />
                  </Form.Item>
                  <Form.Item
                      label="售价"
                      name="price"
                      key="price"
                      rules={[
                        {
                          required: true,
                          message: '请输入价格!',
                        }
                      ]}
                    >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                      label="折后价格"
                      name="realPrice"
                      key="realPrice"
                      rules={[
                        {
                          required: true,
                          message: '请输入折后价格!',
                        },
                      ]}
                    >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                      label="评论数量"
                      name="commentCount"
                      key="commentCount"
                      rules={[
                        {
                          required: true,
                          message: '请输入评论数量!',
                        },
                      ]}
                    >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                      label="销售数量"
                      name="sellCount"
                      key="sellCount"
                      rules={[
                        {
                          required: true,
                          message: '请输入销售数量!',
                        },
                      ]}
                    >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                      label="标签类型"
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
                        onChange={this.onChangeSelect('type')}
                        allowClear
                      >
                        {
                          types.map(({ _id, name }) => {
                          return <Option key={_id} value={name}>
                              <Tag 
                                color={colors[Math.round(Math.random() * colors.length)]} 
                                key={_id}>
                                  {name}
                              </Tag>
                            </Option>
                          })
                        }
                      </Select>
                  </Form.Item>
                  <Form.Item
                      label="商品描述"
                      name="desc"
                      key="desc"
                      rules={[
                        {
                          required: true,
                          message: '请输入商品描述!',
                        },
                      ]}
                    >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                    <Upload
                      name="imageUrl"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {/* {fileList.length >= 8 ? null : uploadButton} */}
                    </Upload>
                </Col>
              </Row>
              <Form.Item {...tailLayout}>
                <Row>
                  <Col span={6}>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </Col>
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

          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      )
  }
}