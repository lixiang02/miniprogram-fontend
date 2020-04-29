import React from 'react';
import { Input, Tag, Button, Form, Row, Col, Select, InputNumber, message } from 'antd';
import * as api from './api'

const colors = [
  'magenta', 'red', 'volcano', 'gold', 'orange', 'green', 'lime', 
  'blue', 'cyan', 'purple', 'geekblue'
]
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

export default class Container extends React.Component {
  state={
    data: null,
    types: [],
    images:[],
    urlSelect: false
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
            if (!result.url) {
              result.url = result.images[0] && result.images[0].url || ''
            }
            state = { 
              data: result, 
              types: result.types, 
              images: result.images
            }
          } else {
            const [
              types,
              images
            ] = await Promise.all([
              api.getTypes(),
              api.getImages({ type: 'list' })
            ])
             state = { data: {}, types, images }
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

    message.info('保存数据成功')
    this.goBack()()
  }

  onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
    message.error('保存数据错误')
  }
  goBack() {
    return () => {
      this.props.history.goBack(-1)
    }
  }
  renterLeft() {
    const { types } = this.state;
    return (
      <div>
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
          name="typeId"
          key="typeId"
          rules={[
            {
              required: true,
              message: '请选择标签类型!',
            },
          ]}
        >
          <Select allowClear>
            {
              types.map(({ _id, name }) => {
                return <Option key={_id} value={_id}>
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
      </div>
    )
  }
  renderImageView() {
    const { data: { url } } = this.state
    if (!url) { return this.renderSelectImageButton() }
    return (<div>
        <img src={url} style={{ maxWidth: '250px' }} alt="avatar" />
        {
          this.renderSelectImageButton()
        }
      </div>
    )
  }
  renderSelectImage() {
    const { data, images } = this.state;
    return (
      <Select
        allowClear
        size='large'
        onChange={(_id) => {
          const image = images.find(e => e._id === _id)
          data.url = image.url || ''
          this.setState({ urlSelect: false, data })
        }}
      >
        {
          images.map(({ _id, name, url }) => {
            return <Option key={_id} value={_id}>
              <img src={url} style={{ maxHeight: '64px' }} alt="avatar" />
              {name}
            </Option>
          })
        }
      </Select>
    )
  }
  renderSelectImageButton() {
    return <Button onClick={() => this.setState({ urlSelect: true })}>选择图片</Button>
  }
  renderRight() {
    const { urlSelect } = this.state;
    return (
      <Form.Item
        label="商品图片"
        name="imageId"
        key="imageId"
        rules={[
          {
            required: true,
            message: '请选择商品图片!',
          },
        ]}
      >
        {
          urlSelect ? 
            this.renderSelectImage() 
          : 
            this.renderImageView()
        }
      </Form.Item>
    )
  }
  renderFooter() {
    return (
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
    )
  }
  render() {
    const { data } = this.state;
    if (!data) { return null } 
    return (<Form
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
            {
              this.renterLeft()
            }
          </Col>
          <Col span={8}>
            {
              this.renderRight()
            }
          </Col>
        </Row>
        {
          this.renderFooter()
        }
      </Form>
    )
  }
}