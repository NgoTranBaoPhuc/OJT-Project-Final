import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message } from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AccountEdit from './AccountEdit';
import AccountCreate from './AccountCreate';

const { Search } = Input;

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingAccount, setEditingAccount] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/accounts');
                setAccounts(response.data);
                setFilteredAccounts(response.data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };

        fetchAccounts();
    }, []);

    useEffect(() => {
        if (accounts.length > 0) {
            const results = accounts.filter(account =>
                account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAccounts(results);
        }
    }, [searchTerm, accounts]);

    const handleEdit = (record) => {
        setEditingAccount(record);
        setIsEditModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await axios.delete(`http://localhost:5000/accounts/${record.id}`);
            message.success('Account deleted successfully');
            const updatedAccounts = accounts.filter(account => account.id !== record.id);
            setAccounts(updatedAccounts);
            setFilteredAccounts(updatedAccounts);
        } catch (error) {
            console.error('Error deleting account:', error);
            message.error('Failed to delete account');
        }
    };

    const handleCreate = () => {
        setIsCreateModalVisible(true);
    };

    const handleUpdate = () => {
        setIsEditModalVisible(false);
        setEditingAccount(null);
        axios.get('http://localhost:5000/accounts').then((response) => {
            setAccounts(response.data);
            setFilteredAccounts(response.data);
        });
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
        setEditingAccount(null);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        axios.get('http://localhost:5000/accounts').then((response) => {
            setAccounts(response.data);
            setFilteredAccounts(response.data);
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Tag color={status === 'Active' ? 'green' : 'volcano'} key={status}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{ marginBottom: 16 }}
            >
                Create Account
            </Button>
            <Search
                placeholder="Search accounts"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Table columns={columns} dataSource={filteredAccounts} rowKey="id" />
            <Modal
                title="Edit Account"
                visible={isEditModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <AccountEdit
                    account={editingAccount}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                />
            </Modal>
            <Modal
                title="Create Account"
                visible={isCreateModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <AccountCreate onCreate={handleCreateSuccess} />
            </Modal>
        </div>
    );
};

export default AccountList;
