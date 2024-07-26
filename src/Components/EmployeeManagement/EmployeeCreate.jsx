import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createNewEmployee } from '../../services/EmployeeService';

const { Option } = Select;
const { TextArea } = Input;

const EmployeeCreate = ({ onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [positions, setPositions] = useState([]);
    const [cvFile, setCvFile] = useState(null);

    useEffect(() => {
        const storedPositions = JSON.parse(localStorage.getItem('positions')) || [];
        setPositions(storedPositions);
    }, []);

    const handleFinish = (values) => {
        if (!cvFile) {
            message.error('Please upload a CV (PDF)');
            return;
        }

        setLoading(true);
        createNewEmployee(
            values.name,
            values.position,
            values.personalDetails,
            values.phoneNumber,
            values.email,
            values.additionalData,
            cvFile
        );
        message.success('Employee created successfully');
        form.resetFields();
        setCvFile(null);
        onCreate();
        setLoading(false);
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
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Employee
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EmployeeCreate;
