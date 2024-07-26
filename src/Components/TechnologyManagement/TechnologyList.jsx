import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message, TreeSelect } from 'antd';
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
    const [tagsFromStorage, setTagsFromStorage] = useState([]);

    useEffect(() => {
        const fetchTechnologies = () => {
            const storedTechnologies = localStorage.getItem('technologies');
            if (storedTechnologies) {
                const parsedTechnologies = JSON.parse(storedTechnologies);
                setTechnologies(parsedTechnologies);
                setFilteredTechnologies(parsedTechnologies);
            }
        };

        const fetchTags = () => {
            const storedTags = localStorage.getItem('technologyTags');
            if (storedTags) {
                const parsedTags = JSON.parse(storedTags);
                setTagsFromStorage(parsedTags.map(tag => ({ title: tag, value: tag })));
            }
        };

        fetchTechnologies();
        fetchTags();
    }, []);

    useEffect(() => {
        const results = technologies.filter(technology =>
            technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            technology.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (technology.tags && technology.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        );
        setFilteredTechnologies(results);
    }, [searchTerm, technologies]);

    const updateTags = (updatedTags) => {
        setTagsFromStorage(updatedTags.map(tag => ({ title: tag, value: tag })));
    };

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

    const getRandomColor = () => {
        const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleTagFilter = (value) => {
        if (value.length > 0) {
            const filtered = technologies.filter(technology =>
                technology.tags.some(tag => value.includes(tag))
            );
            setFilteredTechnologies(filtered);
        } else {
            setFilteredTechnologies(technologies);
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
                            setFilteredTechnologies(technologies);
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
                <TechnologyCreate onCreate={handleCreateSuccess} onTagsChange={updateTags} />
            </Modal>
        </div>
    );
};

export default TechnologyList;
