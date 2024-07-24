import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AccountEdit = ({ account, onUpdate, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (account) {
            form.setFieldsValue(account);
        }
    }, [account, form]);

    const onFinish = async (values) => {
        try {
            await axios.put(`http://localhost:5000/accounts/${account.id}`, values);
            message.success('Account updated successfully');
            onUpdate();
        } catch (error) {
            console.error('Error updating account:', error);
            message.error('Failed to update account');
        }
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
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select a status!' }]}
            >
                <Select>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                </Select>
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
