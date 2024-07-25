import React from 'react';
import { Layout, Space } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import AccountList from '../Components/AccountManagement/AccountList';
import PositionList from '../Components/PositionManagement/PositionList';

const { Content } = Layout;

const Master = () => {
    return (
        <Router>
            <Layout style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <Layout style={{ marginLeft: 200, flex: 1 }}>
                    <Content style={{ padding: '30px', background: '#fff', minHeight: '100vh', width: '85vw' }}>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Routes>
                                <Route path="/accounts" element={<AccountList />} />
                                <Route path="/positions" element={<PositionList />} />
                            </Routes>
                        </Space>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
};

export default Master;
