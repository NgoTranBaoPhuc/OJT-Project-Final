import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const PositionEdit = ({ position, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [tags, setTags] = useState([]);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (position) {
            form.setFieldsValue(position);
            setTags(position.tags || []);
            setIsActive(position.status === 'Active');
        }
    }, [position, form]);

    useEffect(() => {
        const fetchTags = () => {
            const storedTags = JSON.parse(localStorage.getItem('positionTags')) || [];
            setTags(storedTags);
        };
        fetchTags();
    }, []);

    const onFinish = (values) => {
        const currentTags = form.getFieldValue('tags') || [];
        if (currentTags.length === 0) {
            message.error('Please select at least one tag.');
            return;
        }
        if (currentTags.length > 3) {
            message.error('You can select up to 3 tags only.');
            return;
        }
        const storedPositions = JSON.parse(localStorage.getItem('positions'));
        const updatedPositions = storedPositions.map(pos =>
            pos.id === position.id ? { ...pos, ...values, tags: currentTags, status: isActive ? 'Active' : 'Inactive' } : pos
        );
        localStorage.setItem('positions', JSON.stringify(updatedPositions));
        message.success('Position updated successfully');
        onUpdate();
    };

    const handleTagChange = (value) => {
        setTags(value);
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
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item
                name="tags"
                label="Tags"
            >
                <Select mode="tags" value={tags} onChange={handleTagChange}>
                    {tags.map(tag => (
                        <Option key={tag} value={tag}>{tag}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="status"
                label="Status"
            >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" checked={isActive} onChange={setIsActive} />
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
