import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ProfileOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
    return (
        <Sider width={200} style={{ height: '100vh', position: 'fixed', left: 0 }}>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    <Link to="/accounts">Accounts</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<ProfileOutlined />}>
                    <Link to="/positions">Positions</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
