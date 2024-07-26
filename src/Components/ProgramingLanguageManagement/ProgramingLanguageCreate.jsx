import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const ProgramingLanguageCreate = ({ onCreate, onTagsChange }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchTags = () => {
            const storedTags = JSON.parse(localStorage.getItem('programingLanguageTags')) || [];
            setTags(storedTags);
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const storedTags = JSON.parse(localStorage.getItem('programingLanguageTags')) || [];
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
        const storedLanguages = JSON.parse(localStorage.getItem('programingLanguages')) || [];
        const newLanguage = { ...values, tags: currentTags, id: Date.now().toString() };
        storedLanguages.push(newLanguage);
        localStorage.setItem('programingLanguages', JSON.stringify(storedLanguages));

        // Update tags in localStorage
        const storedTags = JSON.parse(localStorage.getItem('programingLanguageTags')) || [];
        const updatedTags = Array.from(new Set([...storedTags, ...currentTags]));
        localStorage.setItem('programingLanguageTags', JSON.stringify(updatedTags));

        // Call onTagsChange to update tags in ProgramingLanguageList
        onTagsChange(updatedTags);

        message.success('Programing language created successfully');
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
                    Create Programing Language
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProgramingLanguageCreate;
