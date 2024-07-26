import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message, TreeSelect } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ProgramingLanguageEdit from './ProgramingLanguageEdit';
import ProgramingLanguageCreate from './ProgramingLanguageCreate';

const { Search } = Input;

const ProgramingLanguageList = () => {
    const [languages, setLanguages] = useState([]);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [tagsFromStorage, setTagsFromStorage] = useState([]);

    useEffect(() => {
        const fetchLanguages = () => {
            const storedLanguages = localStorage.getItem('programingLanguages');
            if (storedLanguages) {
                const parsedLanguages = JSON.parse(storedLanguages);
                setLanguages(parsedLanguages);
                setFilteredLanguages(parsedLanguages);
            }
        };

        const fetchTags = () => {
            const storedTags = localStorage.getItem('programingLanguageTags');
            if (storedTags) {
                const parsedTags = JSON.parse(storedTags);
                setTagsFromStorage(parsedTags.map(tag => ({ title: tag, value: tag })));
            }
        };

        fetchLanguages();
        fetchTags();
    }, []);

    useEffect(() => {
        const results = languages.filter(language =>
            language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            language.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (language.tags && language.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        );
        setFilteredLanguages(results);
    }, [searchTerm, languages]);

    const updateTags = (updatedTags) => {
        setTagsFromStorage(updatedTags.map(tag => ({ title: tag, value: tag })));
    };

    const saveLanguages = (languages) => {
        localStorage.setItem('programingLanguages', JSON.stringify(languages));
    };

    const handleEdit = (record) => {
        setEditingLanguage(record);
        setIsEditModalVisible(true);
    };

    const handleDelete = (record) => {
        const updatedLanguages = languages.filter(language => language.id !== record.id);
        setLanguages(updatedLanguages);
        setFilteredLanguages(updatedLanguages);
        saveLanguages(updatedLanguages);
        message.success('Programing language deleted successfully');
    };

    const handleCreate = () => {
        setIsCreateModalVisible(true);
    };

    const handleUpdate = () => {
        setIsEditModalVisible(false);
        setEditingLanguage(null);
        const storedLanguages = JSON.parse(localStorage.getItem('programingLanguages'));
        setLanguages(storedLanguages);
        setFilteredLanguages(storedLanguages);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
        setEditingLanguage(null);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        const storedLanguages = JSON.parse(localStorage.getItem('programingLanguages'));
        setLanguages(storedLanguages);
        setFilteredLanguages(storedLanguages);
    };

    const getRandomColor = () => {
        const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleTagFilter = (value) => {
        if (value.length > 0) {
            const filtered = languages.filter(language =>
                language.tags.some(tag => value.includes(tag))
            );
            setFilteredLanguages(filtered);
        } else {
            setFilteredLanguages(languages);
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
                            setFilteredLanguages(languages);
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
                Create Programing Language
            </Button>
            <Search
                placeholder="Search programing languages"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Table columns={columns} dataSource={filteredLanguages} rowKey="id" pagination={{ pageSize: 7 }} />
            <Modal
                title="Edit Programing Language"
                visible={isEditModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <ProgramingLanguageEdit
                    language={editingLanguage}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                />
            </Modal>
            <Modal
                title="Create Programing Language"
                visible={isCreateModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <ProgramingLanguageCreate onCreate={handleCreateSuccess} onTagsChange={updateTags} />
            </Modal>
        </div>
    );
};

export default ProgramingLanguageList;
