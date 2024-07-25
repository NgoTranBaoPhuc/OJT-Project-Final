import React, { useState } from 'react';
import { Form, Input, Button, message, Switch } from 'antd';

const AccountCreate = ({ onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(true); // Default status to 'Active'

    const handleFinish = (values) => {
        setLoading(true);
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];
        const newAccount = { ...values, status: status ? 'Active' : 'Inactive', id: Date.now().toString() };
        storedAccounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(storedAccounts));
        message.success('Account created successfully');
        form.resetFields();
        onCreate();
        setLoading(false);
    };

    const handleStatusChange = (checked) => {
        setStatus(checked);
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
            <Form.Item
                label="Status"
            >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked onChange={handleStatusChange} />
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
