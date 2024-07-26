import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message, TreeSelect } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
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
    const [tagsFromStorage, setTagsFromStorage] = useState([]);
    const [statusFromStorage, setStatusFromStorage] = useState([]);

    useEffect(() => {
        const fetchPositions = () => {
            const storedPositions = localStorage.getItem('positions');
            if (storedPositions) {
                const parsedPositions = JSON.parse(storedPositions);
                setPositions(parsedPositions);
                setFilteredPositions(parsedPositions);
            }
        };

        const fetchTags = () => {
            const storedTags = localStorage.getItem('positionTags');
            if (storedTags) {
                const parsedTags = JSON.parse(storedTags);
                setTagsFromStorage(parsedTags.map(tag => ({ title: tag, value: tag })));
            }
        };

        const fetchStatus = () => {
            const storedStatus = localStorage.getItem('positionStatus');
            if (storedStatus) {
                const parsedStatus = JSON.parse(storedStatus);
                setStatusFromStorage(parsedStatus.map(status => ({ title: status, value: status })));
            }
        };

        fetchPositions();
        fetchTags();
        fetchStatus();
    }, []);

    useEffect(() => {
        const results = positions.filter(position =>
            position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            position.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (position.tags && position.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        );
        setFilteredPositions(results);
    }, [searchTerm, positions]);

    const updateTags = (updatedTags) => {
        console.log('Updated Tags:', updatedTags); // Kiểm tra giá trị thẻ được cập nhật
        setTagsFromStorage(updatedTags.map(tag => ({ title: tag, value: tag })));
    };

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

    const getRandomColor = () => {
        const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleTagFilter = (value) => {
        if (value.length > 0) {
            const filtered = positions.filter(position =>
                position.tags.some(tag => value.includes(tag))
            );
            setFilteredPositions(filtered);
        } else {
            setFilteredPositions(positions);
        }
    };

    const handleStatusFilter = (value) => {
        if (value.length > 0) {
            const filtered = positions.filter(position =>
                value.includes(position.status)
            );
            setFilteredPositions(filtered);
        } else {
            setFilteredPositions(positions);
        }
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
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <TreeSelect
                        treeData={tagsFromStorage}
                        value={selectedKeys}
                        onChange={(value) => {
                            setSelectedKeys(value);
                            handleTagFilter(value);
                            confirm();
                        }}
                        treeCheckable
                        showCheckedStrategy={TreeSelect.SHOW_PARENT}
                        placeholder="Filter by tags"
                        style={{ width: 200 }}
                    />
                    <Button
                        onClick={() => {
                            clearFilters();
                            setFilteredPositions(positions);
                        }}
                        style={{ width: 90, marginTop: 8 }}
                    >
                        Reset
                    </Button>
                </div>
            ),
            render: tags => (
                <>
                    {tags && tags.map(tag => (
                        <Tag color={getRandomColor()} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <TreeSelect
                        treeData={statusFromStorage}
                        value={selectedKeys}
                        onChange={(value) => {
                            setSelectedKeys(value);
                            handleStatusFilter(value);
                            confirm();
                        }}
                        treeCheckable
                        showCheckedStrategy={TreeSelect.SHOW_PARENT}
                        placeholder="Filter by status"
                        style={{ width: 200 }}
                    />
                    <Button
                        onClick={() => {
                            clearFilters();
                            setFilteredPositions(positions);
                        }}
                        style={{ width: 90, marginTop: 8 }}
                    >
                        Reset
                    </Button>
                </div>
            ),
            render: status => (
                <Tag color={status === 'Active' ? 'green' : 'volcano'} key={status}>
                    {status ? status.toUpperCase() : ''}
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
                <PositionCreate onCreate={handleCreateSuccess} onTagsChange={updateTags} />
            </Modal>
        </div>
    );
};

export default PositionList;
