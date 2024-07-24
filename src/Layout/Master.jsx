import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import AccountList from '../Components/AccountManagement/AccountList';
import PositionList from '../Components/PositionManagement/PositionList';

const { Header, Content } = Layout;

const Master = () => {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '16px' }}>
                        <Routes>
                            <Route path="/accounts" element={<AccountList />} />
                            <Route path="/positions" element={<PositionList />} />
                        </Routes>
                    </Content>

                </Layout>
            </Layout>
        </Router>
    );
};

export default Master;
