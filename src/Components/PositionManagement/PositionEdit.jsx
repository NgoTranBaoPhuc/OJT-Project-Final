import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const PositionEdit = ({ position, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (position) {
            form.setFieldsValue(position);
            setTags(position.tags || []);
        }
    }, [position, form]);

    const onFinish = (values) => {
        if (tags.length === 0) {
            message.error('Please select at least one tag.');
            return;
        }
        if (tags.length > 3) {
            message.error('You can select up to 3 tags only.');
            return;
        }
        const storedPositions = JSON.parse(localStorage.getItem('positions'));
        const updatedPositions = storedPositions.map(pos =>
            pos.id === position.id ? { ...pos, ...values, tags } : pos
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
                    <Option value="C#">C#</Option>
                    <Option value="C++">C++</Option>
                    <Option value="JavaScript">JavaScript</Option>
                    <Option value="Python">Python</Option>
                    <Option value="Java">Java</Option>
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
