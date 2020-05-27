import React from 'react';
import { Table, Tag, Button, message, Popconfirm, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import * as api from './api'

const colors = [
  'magenta', 'red', 'volcano', 'gold', 'orange', 'green', 'lime', 
  'blue', 'cyan', 'purple', 'geekblue'
]
const pagination = {
  pageSize: 7, 
  size:"small", 
  total: 7
}
export default class Container extends React.Component {
    state = {
      data: [],
      pagination
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
        self.setState({ 
          data,
          pagination: Object.assign({}, pagination, {
            total: result.pager ? result.pager.Total : data.length,
            Offset: result.pager && result.pager.Offset ? result.pager.Offset : 0,
            size: pagination.size,
            Limit: result.pager && result.pager.Limit ? result.pager.Limit : pagination.pageSize
          })
        })
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
        const result = await api.deleteItem(id)
        if (result.code === 0) {
           message.info('已删除')
           this.refresh()
        } else {
          if (!result.success) {
            message.error('删除图片出错，产品中正在使用的图片不允许删除')
          }
        }
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
        <Table columns={columns} dataSource={this.state.data} pagination={this.state.pagination} />
      </div>
    }
}