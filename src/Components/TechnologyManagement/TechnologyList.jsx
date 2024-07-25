import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TechnologyEdit from './TechnologyEdit';
import TechnologyCreate from './TechnologyCreate';

const { Search } = Input;

const TechnologyList = () => {
    const [technologies, setTechnologies] = useState([]);
    const [filteredTechnologies, setFilteredTechnologies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTechnology, setEditingTechnology] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    useEffect(() => {
        const fetchTechnologies = () => {
            const storedTechnologies = localStorage.getItem('technologies');
            if (storedTechnologies) {
                const parsedTechnologies = JSON.parse(storedTechnologies);
                setTechnologies(parsedTechnologies);
                setFilteredTechnologies(parsedTechnologies);
            }
        };

        fetchTechnologies();
    }, []);

    useEffect(() => {
        if (technologies.length > 0) {
            const results = technologies.filter(technology =>
                technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                technology.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (technology.tags && technology.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
            setFilteredTechnologies(results);
        }
    }, [searchTerm, technologies]);

    const saveTechnologies = (technologies) => {
        localStorage.setItem('technologies', JSON.stringify(technologies));
    };

    const handleEdit = (record) => {
        setEditingTechnology(record);
        setIsEditModalVisible(true);
    };

    const handleDelete = (record) => {
        const updatedTechnologies = technologies.filter(technology => technology.id !== record.id);
        setTechnologies(updatedTechnologies);
        setFilteredTechnologies(updatedTechnologies);
        saveTechnologies(updatedTechnologies);
        message.success('Technology deleted successfully');
    };

    const handleCreate = () => {
        setIsCreateModalVisible(true);
    };

    const handleUpdate = () => {
        setIsEditModalVisible(false);
        setEditingTechnology(null);
        const storedTechnologies = JSON.parse(localStorage.getItem('technologies'));
        setTechnologies(storedTechnologies);
        setFilteredTechnologies(storedTechnologies);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
        setEditingTechnology(null);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        const storedTechnologies = JSON.parse(localStorage.getItem('technologies'));
        setTechnologies(storedTechnologies);
        setFilteredTechnologies(storedTechnologies);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
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
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchTerm(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchTerm('');
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
            render: tags => (
                <>
                    {tags.map(tag => (
                        <Tag color={tag.length > 5 ? 'geekblue' : 'green'} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    ))}
                </>
            ),
            filters: [
                { text: 'React Native', value: 'React Native' },
                { text: 'Flutter', value: 'Flutter' },
                { text: 'Ionic', value: 'Ionic' },
                { text: 'Cordova', value: 'Cordova' },
                { text: 'MySQL', value: 'MySQL' },
                { text: 'Postgres', value: 'Postgres' },
                { text: 'SQLite', value: 'SQLite' },
                { text: 'Neo4J', value: 'Neo4J' },
                { text: 'Amazon (AWS)', value: 'Amazon (AWS)' },
                { text: 'Google (Google Cloud Platform, Firebase)', value: 'Google (Google Cloud Platform, Firebase)' },
                { text: 'Microsoft (Azure)', value: 'Microsoft (Azure)' },
            ],
            onFilter: (value, record) => record.tags.includes(value),
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
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
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
                Create Technology
            </Button>
            <Search
                placeholder="Search technologies"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Table columns={columns} dataSource={filteredTechnologies} rowKey="id" pagination={{ pageSize: 7 }} />
            <Modal
                title="Edit Technology"
                visible={isEditModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <TechnologyEdit
                    technology={editingTechnology}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                />
            </Modal>
            <Modal
                title="Create Technology"
                visible={isCreateModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <TechnologyCreate onCreate={handleCreateSuccess} />
            </Modal>
        </div>
    );
};

export default TechnologyList;
