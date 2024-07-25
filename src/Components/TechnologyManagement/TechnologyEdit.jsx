import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select, Switch, message } from 'antd';

const { Option } = Select;

const tagsOptions = [
    'React Native', 'Flutter', 'Ionic', 'Cordova',
    'MySQL', 'Postgres', 'SQLite', 'Neo4J',
    'Amazon (AWS)', 'Google (Google Cloud Platform, Firebase)', 'Microsoft (Azure)'
];

const TechnologyEdit = ({ technology, onUpdate, onCancel }) => {
    const [form] = Form.useForm();
    const [selectedTags, setSelectedTags] = useState([]);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (technology) {
            form.setFieldsValue(technology);
            setSelectedTags(technology.tags || []);
            setIsActive(technology.status === 'Active');
        }
    }, [technology, form]);

    const onFinish = (values) => {
        if (selectedTags.length > 3) {
            message.error('You can only select up to 3 tags');
            return;
        }
        const storedTechnologies = JSON.parse(localStorage.getItem('technologies'));
        const updatedTechnologies = storedTechnologies.map(tech =>
            tech.id === technology.id ? { ...tech, ...values, tags: selectedTags, status: isActive ? 'Active' : 'Inactive' } : tech
        );
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
        message.success('Technology updated successfully');
        onUpdate();
    };

    const handleTagChange = (tags) => {
        if (tags.length > 3) {
            message.error('You can select up to 3 tags');
        } else {
            setSelectedTags(tags);
        }
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
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
                name="tags"
                label="Tags"
                rules={[{ required: true, message: 'Please select at least one tag!' }]}
            >
                <Select
                    mode="multiple"
                    value={selectedTags}
                    onChange={handleTagChange}
                >
                    {tagsOptions.map(tag => (
                        <Option key={tag} value={tag}>
                            {tag}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="status"
                label="Status"
                valuePropName="checked"
            >
                <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    checked={isActive}
                    onChange={setIsActive}
                />
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

TechnologyEdit.propTypes = {
    technology: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string
    }),
    onUpdate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default TechnologyEdit;
