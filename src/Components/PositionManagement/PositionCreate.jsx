import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';

const PositionCreate = ({ onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFinish = (values) => {
        setLoading(true);
        const storedPositions = JSON.parse(localStorage.getItem('positions')) || [];
        const newPosition = { ...values, status: 'Active', id: Date.now().toString() };
        storedPositions.push(newPosition);
        localStorage.setItem('positions', JSON.stringify(storedPositions));
        message.success('Position created successfully');
        form.resetFields();
        onCreate();
        setLoading(false);
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
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter the description' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Position
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PositionCreate;
