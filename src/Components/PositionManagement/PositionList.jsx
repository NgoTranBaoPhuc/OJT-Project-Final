import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PositionEdit from './PositionEdit';
import PositionCreate from './PositionCreate';

const { Search } = Input;

const PositionList = () => {
    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPosition, setEditingPosition] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    useEffect(() => {
        const fetchPositions = () => {
            const storedPositions = localStorage.getItem('positions');
            if (storedPositions) {
                const parsedPositions = JSON.parse(storedPositions);
                setPositions(parsedPositions);
                setFilteredPositions(parsedPositions);
            }
        };

        fetchPositions();
    }, []);

    useEffect(() => {
        if (positions.length > 0) {
            const results = positions.filter(position =>
                position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                position.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                position.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPositions(results);
        }
    }, [searchTerm, positions]);

    const savePositions = (positions) => {
        localStorage.setItem('positions', JSON.stringify(positions));
    };

    const handleEdit = (record) => {
        setEditingPosition(record);
        setIsEditModalVisible(true);
    };

    const handleDelete = (record) => {
        const updatedPositions = positions.filter(position => position.id !== record.id);
        setPositions(updatedPositions);
        setFilteredPositions(updatedPositions);
        savePositions(updatedPositions);
        message.success('Position deleted successfully');
    };

    const handleCreate = () => {
        setIsCreateModalVisible(true);
    };

    const handleUpdate = () => {
        setIsEditModalVisible(false);
        setEditingPosition(null);
        const storedPositions = JSON.parse(localStorage.getItem('positions'));
        setPositions(storedPositions);
        setFilteredPositions(storedPositions);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
        setEditingPosition(null);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        const storedPositions = JSON.parse(localStorage.getItem('positions'));
        setPositions(storedPositions);
        setFilteredPositions(storedPositions);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
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
                Create Position
            </Button>
            <Search
                placeholder="Search positions"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Table columns={columns} dataSource={filteredPositions} rowKey="id" pagination={{ pageSize: 7 }} />
            <Modal
                title="Edit Position"
                visible={isEditModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <PositionEdit
                    position={editingPosition}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                />
            </Modal>
            <Modal
                title="Create Position"
                visible={isCreateModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <PositionCreate onCreate={handleCreateSuccess} />
            </Modal>
        </div>
    );
};

export default PositionList;
