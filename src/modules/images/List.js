import React from 'react';
import { Table, Tag, Button, message, Popconfirm, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import * as api from './api'

const colors = [
  'magenta', 'red', 'volcano', 'gold', 'orange', 'green', 'lime', 
  'blue', 'cyan', 'purple', 'geekblue'
]
export default class Container extends React.Component {
    state = {
      data: []
    }
    componentDidMount() {
      const self = this
      new Promise(async (resolve, reject) => {
        const result = await api.getList()
        const data = (result.data || []).map(item => {
          return Object.assign({}, item, {
            key: item._id
          })
        })
        self.setState({ data })
        resolve()
      })
    }
    editItem(id) {
      return () => {
        console.log('---edit--',id)
        this.props.history.push(`/images/edit?id=${id}`)
      } 
    }
    onAddItem() {
      this.props.history.push('/images/add')
    }
    refresh() {
      console.log('----refresh---', this.props.match.url)
      this.props.history.go(this.props.match.url)
    }
    confirm(id) {
      return async () => {
        console.log('---remove--',id)
        // 删除单个Item
        await api.deleteItem(id)
        message.info('已删除')
        this.refresh()
      }
    }
    render() {
      const columns = [
        {
          title: '图片',
          key: 'url',
          dataIndex: 'url',
          render: url => (url ? (
              <Avatar shape="square" size={64} src={url} icon={<UserOutlined />} />
            ) : ''
          ),
        },
        {
          title: '名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '类型',
          key: 'type',
          dataIndex: 'type',
          render: tag => (tag ? (
            <span>
              <Tag color={colors[Math.round(Math.random() * colors.length)]} key={tag}>
                {tag}
              </Tag>
            </span>) : ''
          ),
        },
        {
          title: '文件大小',
          key: 'sizeStr',
          dataIndex: 'sizeStr'
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <Button 
                type="link" 
                onClick={this.editItem(record.key)}
                style={{ paddingLeft: '0' }}
              >
                编辑
              </Button>
              <Popconfirm
                placement="top"
                title={"确认删除吗？"} 
                onConfirm={this.confirm(record.key)} 
                okText="确认" 
                cancelText="取消"
              >
                <Button type="link" >删除</Button>
              </Popconfirm>
            </span>
          ),
        },
      ];
      return <div>
        <div>
          <Button
            type="primary" 
            size="large" 
            style={{ marginBottom: '10px', borderRadius: '10px' }} 
            onClick={this.onAddItem.bind(this)}
          >
              增 加
          </Button>
        </div>
        <Table columns={columns} dataSource={this.state.data} />
      </div>
    }
}