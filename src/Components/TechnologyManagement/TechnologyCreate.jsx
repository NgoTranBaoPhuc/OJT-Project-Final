import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select, Switch, message } from 'antd';

const { Option } = Select;

const TechnologyCreate = ({ onCreate }) => {
    const [form] = Form.useForm();
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const handleFinish = (values) => {
        if (selectedTags.length === 0) {
            message.error('Please select at least one tag');
            return;
        }
        setLoading(true);
        const storedTechnologies = JSON.parse(localStorage.getItem('technologies')) || [];
        const newTechnology = { ...values, tags: selectedTags, id: Date.now().toString(), status: isActive ? 'Active' : 'Inactive' };
        storedTechnologies.push(newTechnology);
        localStorage.setItem('technologies', JSON.stringify(storedTechnologies));
        message.success('Technology created successfully');
        form.resetFields();
        setSelectedTags([]);
        setIsActive(true);
        onCreate();
        setLoading(false);
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
                <Input.TextArea />
            </Form.Item>
            <Form.Item
                name="tags"
                label="Tags"
                rules={[
                    { required: true, message: 'Please select at least one tag!' },
                    () => ({
                        validator(_, value) {
                            if (value && value.length <= 3) {
                                return Promise.resolve();
                            }
                            return Promise.reject('You can select up to 3 tags!');
                        },
                    }),
                ]}
            >
                <Select
                    mode="multiple"
                    placeholder="Select tags"
                    value={selectedTags}
                    onChange={handleTagChange}
                >
                    {[
                        'React Native',
                        'Flutter',
                        'Ionic',
                        'Cordova',
                        'MySQL',
                        'Postgres',
                        'SQLite',
                        'Neo4J',
                        'Amazon (AWS)',
                        'Google (Google Cloud Platform, Firebase)',
                        'Microsoft (Azure)'
                    ].map(tag => (
                        <Option key={tag} value={tag}>
                            {tag}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="status"
                label="Status"
            // valuePropName="checked"
            >
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" checked={isActive} onChange={setIsActive} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} disabled={selectedTags.length > 3}>
                    Create Technology
                </Button>
            </Form.Item>
        </Form>
    );
};

TechnologyCreate.propTypes = {
    onCreate: PropTypes.func.isRequired
};

export default TechnologyCreate;
