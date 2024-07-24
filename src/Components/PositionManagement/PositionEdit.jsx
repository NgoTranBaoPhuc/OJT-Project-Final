import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Select, Modal, message } from 'antd';

const { Option } = Select;

const PositionEdit = ({ visible, onClose, positionId, onUpdate }) => {
    const [form] = Form.useForm();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const fetchPosition = async () => {
            if (positionId) {
                try {
                    const response = await axios.get(`http://localhost:5000/positions/${positionId}`);
                    setPosition(response.data);
                    form.setFieldsValue(response.data);
                } catch (error) {
                    console.error('Error fetching position:', error);
                    message.error('Failed to fetch position.');
                }
            }
        };

        fetchPosition();
    }, [positionId, form]);

    const handleUpdate = async (values) => {
        if (values.status === 'Inactive' && position.status === 'Active') {
            message.error('Cannot set an active position to inactive.');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/positions/${positionId}`, values);
            message.success('Position updated successfully.');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating position:', error);
            message.error('Failed to update position.');
        }
    };

    return (
        <Modal
            visible={visible}
            title="Edit Position"
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                initialValues={position}
                onFinish={handleUpdate}
                layout="vertical"
            >
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select the status' }]}>
                    <Select>
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Position
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PositionEdit;
