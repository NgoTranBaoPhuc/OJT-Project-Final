import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const TechnologyCreate = ({ onCreate, onTagsChange }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = () => {
            const storedTags = JSON.parse(localStorage.getItem('technologyTags')) || [];
            setTags(storedTags);
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const storedTags = JSON.parse(localStorage.getItem('technologyTags')) || [];
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
        const storedTechnologies = JSON.parse(localStorage.getItem('technologies')) || [];
        const newTechnology = { ...values, tags: currentTags, id: Date.now().toString() };
        storedTechnologies.push(newTechnology);
        localStorage.setItem('technologies', JSON.stringify(storedTechnologies));

        // Update tags in localStorage
        const storedTags = JSON.parse(localStorage.getItem('technologyTags')) || [];
        const updatedTags = Array.from(new Set([...storedTags, ...currentTags]));
        localStorage.setItem('technologyTags', JSON.stringify(updatedTags));

        // Call onTagsChange to update tags in TechnologyList
        onTagsChange(updatedTags);

        message.success('Technology created successfully');
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
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Technology
                </Button>
            </Form.Item>
        </Form>
    );
};

export default TechnologyCreate;
