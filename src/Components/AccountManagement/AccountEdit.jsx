import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Switch } from 'antd';

const AccountEdit = ({ account, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [status, setStatus] = useState(account?.status === 'Active'); // Initialize with account status

    useEffect(() => {
        if (account) {
            form.setFieldsValue(account);
            setStatus(account.status === 'Active');
        }
    }, [account, form]);

    const onFinish = (values) => {
        const storedAccounts = JSON.parse(localStorage.getItem('accounts'));
        const updatedAccounts = storedAccounts.map(acc =>
            acc.id === account.id ? { ...acc, ...values, status: status ? 'Active' : 'Inactive' } : acc
        );
        localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
        message.success('Account updated successfully');
        onUpdate();
    };

    const handleStatusChange = (checked) => {
        setStatus(checked);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input the name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Please input the email!' },
                    { type: 'email', message: 'The input is not valid E-mail!' }
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Status"
            >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" checked={status} onChange={handleStatusChange} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Update
                </Button>
                <Button onClick={onCancel} style={{ marginLeft: '10px' }}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AccountEdit;
