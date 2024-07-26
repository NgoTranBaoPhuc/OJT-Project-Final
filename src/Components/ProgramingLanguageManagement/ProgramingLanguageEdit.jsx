import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const ProgramingLanguageEdit = ({ language, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchTags = () => {
            const storedTags = JSON.parse(localStorage.getItem('programingLanguageTags')) || [];
            setAllTags(storedTags);
        };
        fetchTags();
    }, []);

    useEffect(() => {
        if (language) {
            form.setFieldsValue(language);
            setSelectedTags(language.tags || []);
        }
    }, [language, form]);

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
        const storedLanguages = JSON.parse(localStorage.getItem('programingLanguages'));
        const updatedLanguages = storedLanguages.map(lang =>
            lang.id === language.id ? { ...lang, ...values, tags: currentTags } : lang
        );
        localStorage.setItem('programingLanguages', JSON.stringify(updatedLanguages));
        message.success('Programing language updated successfully');
        onUpdate();
    };

    const handleTagChange = (value) => {
        setSelectedTags(value);
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
                <Select mode="tags" value={selectedTags} onChange={handleTagChange}>
                    {allTags.map(tag => (
                        <Option key={tag} value={tag}>{tag}</Option>
                    ))}
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

export default ProgramingLanguageEdit;
