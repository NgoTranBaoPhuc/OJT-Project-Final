import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const PositionCreate = ({ visible, onClose, onCreate }) => {
    const [form] = Form.useForm();

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            await axios.post('http://localhost:5000/positions', {
                ...values,
                status: 'Active', // Set the default status to Active
            });
            message.success('Position created successfully.');
            onCreate();
            onClose();
            form.resetFields();
        } catch (error) {
            console.error('Error creating position:', error);
            message.error('Failed to create position.');
        }
    };

    return (
        <Modal
            visible={visible}
            title="Create a new position"
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleCreate}>
                    Create
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" name="position_create_form">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the name of the position!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description of the position!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PositionCreate;
