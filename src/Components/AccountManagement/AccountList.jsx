import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
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
        const fetchAccounts = () => {
            const storedAccounts = localStorage.getItem('accounts');
            if (storedAccounts) {
                const parsedAccounts = JSON.parse(storedAccounts);
                setAccounts(parsedAccounts);
                setFilteredAccounts(parsedAccounts);
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

    const saveAccounts = (accounts) => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    };

    const handleEdit = (record) => {
        setEditingAccount(record);
        setIsEditModalVisible(true);
    };

    const handleDelete = (record) => {
        const updatedAccounts = accounts.filter(account => account.id !== record.id);
        setAccounts(updatedAccounts);
        setFilteredAccounts(updatedAccounts);
        saveAccounts(updatedAccounts);
        message.success('Account deleted successfully');
    };

    const handleCreate = () => {
        setIsCreateModalVisible(true);
    };

    const handleUpdate = () => {
        setIsEditModalVisible(false);
        setEditingAccount(null);
        const storedAccounts = JSON.parse(localStorage.getItem('accounts'));
        setAccounts(storedAccounts);
        setFilteredAccounts(storedAccounts);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
        setEditingAccount(null);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        const storedAccounts = JSON.parse(localStorage.getItem('accounts'));
        setAccounts(storedAccounts);
        setFilteredAccounts(storedAccounts);
    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search  ${dataIndex} `}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text => text,
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchTerm(selectedKeys[0]);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchTerm('');
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
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
            <Table columns={columns} dataSource={filteredAccounts} rowKey="id" pagination={{ pageSize: 7 }} />
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
