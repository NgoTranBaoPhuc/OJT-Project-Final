import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const PositionCreate = ({ onCreate }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);

    const handleFinish = (values) => {
        if (tags.length === 0) {
            message.error('Please select at least one tag.');
            return;
        }
        if (tags.length > 3) {
            message.error('You can select up to 3 tags only.');
            return;
        }
        setLoading(true);
        const storedPositions = JSON.parse(localStorage.getItem('positions')) || [];
        const newPosition = { ...values, tags, id: Date.now().toString() };
        storedPositions.push(newPosition);
        localStorage.setItem('positions', JSON.stringify(storedPositions));
        message.success('Position created successfully');
        form.resetFields();
        setTags([]);
        onCreate();
        setLoading(false);
    };

    const handleTagChange = (value) => {
        setTags(value);
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
                <Select mode="tags" value={tags} onChange={handleTagChange}>
                    <Option value="C#">C#</Option>
                    <Option value="C++">C++</Option>
                    <Option value="JavaScript">JavaScript</Option>
                    <Option value="Python">Python</Option>
                    <Option value="Java">Java</Option>
                </Select>
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
