import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ProfileOutlined, AppstoreOutlined, CodeOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
    return (
        <Sider width={200} style={{ height: '100vh', position: 'fixed', left: 0 }}>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={[
                {
                    key: '1',
                    icon: <UserOutlined />,
                    label: <Link to="/accounts">Accounts</Link>,
                },
                {
                    key: '2',
                    icon: <ProfileOutlined />,
                    label: <Link to="/positions">Positions</Link>,
                },
                {
                    key: '3',
                    icon: <AppstoreOutlined />,
                    label: <Link to="/technologies">Technologies</Link>,
                },
                {
                    key: '4',
                    icon: <CodeOutlined />,
                    label: <Link to="/programming-languages">Programming Languages</Link>,
                },
                {
                    key: '5',
                    icon: <TeamOutlined />,
                    label: <Link to="/employee-management">Employee Management</Link>,
                },
            ]}>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
