import React from 'react';
import { Table, Tag, Button, message, Popconfirm } from 'antd';
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
          return {
            key: item._id,
            name: item.name
          }
        })
        console.log('---result--',result)
        
        self.setState({ 
          data, 
          pagination: Object.assign({}, pagination, {
            total: result.pager.Total,
            Offset: result.pager.Offset,
            Limit: result.pager.Limit
          })
        })
        resolve()
      })
    }
    editItem(id) {
      return () => {
        console.log('---edit--',id)
        this.props.history.push(`/types/edit?id=${id}`)
      } 
    }
    onAddItem() {
      this.props.history.push('/types/add')
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
          title: '名称',
          key: 'name',
          dataIndex: 'name',
          render: tag => (tag ? (
            <span>
              <Tag color={colors[Math.round(Math.random() * colors.length)]} key={tag}>
                {tag}
              </Tag>
            </span>) : ''
          ),
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