import React from 'react';
import { Layout } from 'antd';
import MenuSider from './AppMenuSider'
import MenuHeader from './AppHeader'
import './App.css';
import Routers from './routers/index';

const { Content, Footer } = Layout;

export const BaseUrl = '/app';

class Container extends React.Component {
  render() {
    return (
      <Layout className="layout">
        <MenuHeader />
        <Layout>
          <MenuSider {...this.props}/>
          <Content style={{ padding:  '25px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb> */}
            <Routers /> 
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    );
  }
}

export default Container;
