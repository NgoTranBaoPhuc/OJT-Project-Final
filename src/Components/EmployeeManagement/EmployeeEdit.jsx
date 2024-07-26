import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { editEmployeeProfile } from '../../services/EmployeeService';

const { Option } = Select;
const { TextArea } = Input;

const EmployeeEdit = ({ employee, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [positions, setPositions] = useState([]);
    const [cvFile, setCvFile] = useState(null);

    useEffect(() => {
        const storedPositions = JSON.parse(localStorage.getItem('positions')) || [];
        setPositions(storedPositions);
        if (employee) {
            form.setFieldsValue(employee);
            setCvFile(employee.cv);
        }
    }, [employee, form]);

    const handleFinish = (values) => {
        const updatedEmployee = { ...values, cv: cvFile };
        editEmployeeProfile(employee.id, updatedEmployee);
        message.success('Employee updated successfully');
        onUpdate();
    };

    const handleCvUpload = ({ file }) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setCvFile(e.target.result);
        };
        reader.readAsDataURL(file);
        return false;
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter the name' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please select a position' }]}
            >
                <Select>
                    {positions.map(position => (
                        <Option key={position.id} value={position.name}>{position.name}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="personalDetails"
                label="Personal Details"
            >
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please enter the email', type: 'email' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter the phone number' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="additionalData"
                label="Additional Data"
            >
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item
                name="cv"
                label="Upload CV"
                valuePropName="file"
                getValueFromEvent={handleCvUpload}
            >
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
                    <Button icon={<UploadOutlined />}>Upload CV (PDF)</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Update Employee
                </Button>
                <Button onClick={onCancel} style={{ marginLeft: '10px' }}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EmployeeEdit;
