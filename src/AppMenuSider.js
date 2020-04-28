import React from 'react';
import {Link} from 'react-router-dom';
import { Menu, Layout } from 'antd';
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

class SiderContainer extends React.Component {
  state = {
    theme: 'dark',
    current: '1',
  };

  changeTheme = value => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  };

  getSubKeyByUrl() {
    let subKey = 'product'
    const url = this.props.history.location.pathname 
    const subArr = url.split('/').filter(Boolean)
    const firstUrl = subArr[0]
    if (firstUrl) {
      switch (firstUrl) {
        case 'images':
        case 'types':
            subKey = 'rescences'
          break;
        default:
            break;
      }
    }
    return [subKey]
  }
  getSelectKeyByUrl() {
    let selectKey = 'products'
    const url = this.props.history.location.pathname
    let subArr = url.split('?').filter(Boolean)
    const subUrl = subArr[0]
    if (subUrl) {
      subArr = subUrl.split('/').filter(Boolean)
      const firstUrl = subArr[0]
      if (firstUrl) {
        selectKey = firstUrl
      }
    }
    return [selectKey]
  }

  render() {
    return (
      <Sider>
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          defaultOpenKeys={this.getSubKeyByUrl()}
          selectedKeys={this.getSelectKeyByUrl()}
          mode="inline"
        >
          <SubMenu
            key="product"
            title={
              <span>
                <MailOutlined />
                <span>商品管理</span>
              </span>
            }
          >
            <Menu.Item key="products">
              <Link to={{pathname: "/products", state: {refresh: true}}}>
                <span>商品列表</span>
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="rescences"
            title={
              <span>
                <AppstoreOutlined />
                <span>资源管理</span>
              </span>
            }
          >
            <Menu.Item key="images">
              <Link to={{pathname: "/images", state: {refresh: true}}}>
                <span>图片列表</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="types">
              <Link to={{pathname: "/types", state: {refresh: true}}}>
                <span>标签列表</span>
              </Link>
            </Menu.Item>
            {/* <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu> */}
          </SubMenu>
          {/* <SubMenu
            key="sub4"
            title={
              <span>
                <SettingOutlined />
                <span>用户管理</span>
              </span>
            }
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu> */}
        </Menu>
      </Sider>
    );
  }
}

export default SiderContainer;