import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Tag, Modal, message } from 'antd';
import axios from 'axios';
import PositionEdit from './PositionEdit';
import PositionCreate from './PositionCreate';

const { Search } = Input;
const { confirm } = Modal;

const PositionList = () => {
    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editVisible, setEditVisible] = useState(false);
    const [createVisible, setCreateVisible] = useState(false);
    const [currentPositionId, setCurrentPositionId] = useState(null);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/positions');
                setPositions(response.data);
                setFilteredPositions(response.data);
            } catch (error) {
                console.error('Error fetching positions:', error);
            }
        };

        fetchPositions();
    }, []);

    useEffect(() => {
        const results = positions.filter(position =>
            position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            position.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPositions(results);
    }, [searchTerm, positions]);

    const handleEdit = (id) => {
        setCurrentPositionId(id);
        setEditVisible(true);
    };

    const handleCreate = () => {
        setCreateVisible(true);
    };

    const handleUpdate = () => {
        setEditVisible(false);
        setCreateVisible(false);
        // Fetch positions again to update the list
        axios.get('http://localhost:5000/positions')
            .then(response => setPositions(response.data))
            .catch(error => console.error('Error fetching positions:', error));
    };

    const handleDelete = async (id) => {
        try {
            const position = positions.find(pos => pos.id === id);
            if (position.status === 'Active') {
                message.error('Only inactive positions can be deleted.');
                return;
            }

            await axios.delete(`http://localhost:5000/positions/${id}`);
            message.success('Position deleted successfully.');
            // Update the positions list
            const newPositions = positions.filter(pos => pos.id !== id);
            setPositions(newPositions);
            setFilteredPositions(newPositions);
        } catch (error) {
            console.error('Error deleting position:', error);
            message.error('Failed to delete position.');
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure delete this position?',
            content: 'Deleted position information including: Name, Description, etc.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDelete(id);
            },
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
                    <Button type="link" onClick={() => handleEdit(record.id)}>Edit</Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
                Create Position
            </Button>
            <Search
                placeholder="Search positions"
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Table columns={columns} dataSource={filteredPositions} rowKey="id" />
            <PositionEdit
                visible={editVisible}
                onClose={() => setEditVisible(false)}
                positionId={currentPositionId}
                onUpdate={handleUpdate}
            />
            <PositionCreate
                visible={createVisible}
                onClose={() => setCreateVisible(false)}
                onCreate={handleUpdate}
            />
        </div>
    );
};

export default PositionList;
