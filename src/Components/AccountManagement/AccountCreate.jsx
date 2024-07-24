import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AccountCreate = ({ onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/accounts', {
                ...values,
                status: 'Active', // Set default status to Active
            });
            message.success('Account created successfully');
            form.resetFields();
            onCreate();
        } catch (error) {
            console.error('Error creating account:', error);
            message.error('Failed to create account');
        } finally {
            setLoading(false);
        }
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
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Please enter the email' },
                    { type: 'email', message: 'Please enter a valid email' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter the password' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Account
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AccountCreate;
