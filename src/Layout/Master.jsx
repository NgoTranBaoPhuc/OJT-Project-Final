import React from 'react';
import { Layout, Space } from 'antd';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AccountList from '../Components/AccountManagement/AccountList';
import PositionList from '../Components/PositionManagement/PositionList';
import TechnologyList from '../Components/TechnologyManagement/TechnologyList';
import ProgramingLanguageList from '../Components/ProgramingLanguageManagement/ProgramingLanguageList';

const { Content } = Layout;

const Master = () => {
    return (
        <Router>
            <Layout style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
                <Sidebar />
                <Layout style={{ marginLeft: 200, width: 'calc(100% - 200px)', background: '#fff' }}>
                    <Content style={{ margin: '30px 90px ', background: '#fff', minHeight: 280 }}>
                        <Space direction="vertical" size="large">
                            <Routes>
                                <Route path="/accounts" element={<AccountList />} />
                                <Route path="/positions" element={<PositionList />} />
                                <Route path="/technologies" element={<TechnologyList />} />
                                <Route path="/programming-languages" element={<ProgramingLanguageList />} />
                                <Route path="*" element={<Navigate to="/accounts" replace />} />
                            </Routes>
                        </Space>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
};

export default Master;
