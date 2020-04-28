import React from 'react';
import { Input, Button, Form, Row, Col } from 'antd';
import * as api from './api'

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
    data: null
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
          if (id) {
            let result = await api.getItem(id)
            console.log('---detail--',  result)
            state = { data: result }
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
  render() {
    const { data } = this.state;
    console.log('---data----', data)
      return (
        <div>
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
        </div>
      )
  }
}