import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;

const PositionEdit = ({ position, onUpdate, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (position) {
            form.setFieldsValue(position);
        }
    }, [position, form]);

    const onFinish = (values) => {
        const storedPositions = JSON.parse(localStorage.getItem('positions'));
        const updatedPositions = storedPositions.map(pos =>
            pos.id === position.id ? { ...pos, ...values } : pos
        );
        localStorage.setItem('positions', JSON.stringify(updatedPositions));
        message.success('Position updated successfully');
        onUpdate();
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
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please input the description!' }]}
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

export default PositionEdit;
