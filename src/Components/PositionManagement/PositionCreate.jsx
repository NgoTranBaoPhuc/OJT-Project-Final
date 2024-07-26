import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const PositionCreate = ({ onCreate, onTagsChange }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const fetchTags = () => {
            const storedTags = JSON.parse(localStorage.getItem('positionTags')) || [];
            setTags(storedTags);
        };
        fetchTags();
    }, []);

    // Thêm useEffect để cập nhật tags khi onTagsChange được gọi
    useEffect(() => {
        const storedTags = JSON.parse(localStorage.getItem('positionTags')) || [];
        setTags(storedTags);
    }, [onTagsChange]);

    const handleFinish = (values) => {
        const currentTags = form.getFieldValue('tags') || [];
        if (currentTags.length === 0) {
            message.error('Please select at least one tag.');
            return;
        }
        if (currentTags.length > 3) {
            message.error('You can select up to 3 tags only.');
            return;
        }
        setLoading(true);
        const storedPositions = JSON.parse(localStorage.getItem('positions')) || [];
        const newPosition = { ...values, tags: currentTags, id: Date.now().toString(), status: isActive ? 'Active' : 'Inactive' };
        storedPositions.push(newPosition);
        localStorage.setItem('positions', JSON.stringify(storedPositions));

        // Update tags in localStorage
        const storedTags = JSON.parse(localStorage.getItem('positionTags')) || [];
        const updatedTags = Array.from(new Set([...storedTags, ...currentTags]));
        localStorage.setItem('positionTags', JSON.stringify(updatedTags));

        // Call onTagsChange to update tags in PositionList
        onTagsChange(updatedTags);

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
                <TextArea rows={4} />
            </Form.Item>
            <Form.Item
                name="tags"
                label="Tags"
            >
                <Select mode="tags">
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
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Position
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PositionCreate;
