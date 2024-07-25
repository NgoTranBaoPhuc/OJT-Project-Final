import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Switch, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const ProgramingLanguageEdit = ({ language, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [tags, setTags] = useState([]);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (language) {
            form.setFieldsValue(language);
            setTags(language.tags || []);
            setIsActive(language.status === 'Active');
        }
    }, [language, form]);

    const onFinish = (values) => {
        if (tags.length === 0) {
            message.error('Please select at least one tag.');
            return;
        }
        if (tags.length > 3) {
            message.error('You can select up to 3 tags only.');
            return;
        }
        const storedLanguages = JSON.parse(localStorage.getItem('languages'));
        const updatedLanguages = storedLanguages.map(lang =>
            lang.id === language.id ? { ...lang, ...values, tags, status: isActive ? 'Active' : 'Inactive' } : lang
        );
        localStorage.setItem('languages', JSON.stringify(updatedLanguages));
        message.success('Programing language updated successfully');
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
                <Select mode="tags" value={tags} onChange={handleTagChange}>
                    <Option value="C#">C#</Option>
                    <Option value="C++">C++</Option>
                    <Option value="JavaScript">JavaScript</Option>
                    <Option value="Python">Python</Option>
                    <Option value="Java">Java</Option>
                    <Option value="Ruby">Ruby</Option>
                    <Option value="Go">Go</Option>
                    <Option value="Swift">Swift</Option>
                    <Option value="Kotlin">Kotlin</Option>
                    <Option value="Rust">Rust</Option>
                    <Option value="TypeScript">TypeScript</Option>
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
                    Update Programing Language
                </Button>
                <Button onClick={onCancel} style={{ marginLeft: '10px' }}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ProgramingLanguageEdit;
