import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd'; // Added Modal import
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EmployeeCreate from './EmployeeCreate';
import EmployeeEdit from './EmployeeEdit';
import * as XLSX from 'xlsx';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = () => {
            const storedEmployees = localStorage.getItem('employees');
            if (storedEmployees) {
                const parsedEmployees = JSON.parse(storedEmployees);
                setEmployees(parsedEmployees);
                setFilteredEmployees(parsedEmployees);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const results = employees.filter(employee =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(results);
    }, [searchTerm, employees]);

    const saveEmployees = (employees) => {
        localStorage.setItem('employees', JSON.stringify(employees));
    };

    const handleEdit = (record) => {
        setEditingEmployee(record);
        setIsEditModalVisible(true);
    };

    const handleDelete = (record) => {
        const updatedEmployees = employees.filter(employee => employee.id !== record.id);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
        saveEmployees(updatedEmployees);
        message.success('Employee deleted successfully');
    };

    const handleCreate = () => {
        setIsCreateModalVisible(true);
    };

    const handleUpdate = () => {
        setIsEditModalVisible(false);
        setEditingEmployee(null);
        const storedEmployees = JSON.parse(localStorage.getItem('employees'));
        setEmployees(storedEmployees);
        setFilteredEmployees(storedEmployees);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsCreateModalVisible(false);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
        const storedEmployees = JSON.parse(localStorage.getItem('employees'));
        setEmployees(storedEmployees);
        setFilteredEmployees(storedEmployees);
    };

    const handleView = (record) => {
        navigate(`/employee-detail/${record.id}`);
    };

    const exportToExcel = () => {
        const worksheetData = filteredEmployees.map(employee => ({
            Name: employee.name,
            Position: employee.position,
            Email: employee.email,
            'Phone Number': employee.phoneNumber,
            'Personal Details': employee.personalDetails,
            'Additional Data': employee.additionalData,
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
        XLSX.writeFile(workbook, "EmployeeList.xlsx");
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
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
                    <Button
                        type="default"
                        icon={<SearchOutlined />}
                        onClick={() => handleView(record)}
                    >
                        Detail
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
                Create Employee
            </Button>
            <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel}
                style={{ marginBottom: 16, marginLeft: 10 }}
            >
                Export list to Excel
            </Button>
            <Table columns={columns} dataSource={filteredEmployees} rowKey="id" pagination={{ pageSize: 7 }} />
            <Modal
                title="Edit Employee"
                visible={isEditModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <EmployeeEdit
                    employee={editingEmployee}
                    onUpdate={handleUpdate}
                    onCancel={handleCancel}
                />
            </Modal>
            <Modal
                title="Create Employee"
                visible={isCreateModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <EmployeeCreate onCreate={handleCreateSuccess} />
            </Modal>
        </div>
    );
};

export default EmployeeList;
