import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Button } from 'antd';

const EmployeeDetail = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
        const foundEmployee = storedEmployees.find(emp => emp.id === id);
        setEmployee(foundEmployee);
    }, [id]);

    if (!employee) {
        return <p>Employee not found</p>;
    }

    const handleDownloadCv = () => {
        const link = document.createElement('a');
        link.href = employee.cv;
        link.download = `${employee.name}_CV.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <Descriptions bordered>
                <Descriptions.Item label="Name">{employee.name}</Descriptions.Item>
                <Descriptions.Item label="Position">{employee.position}</Descriptions.Item>
                <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{employee.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Personal Details">{employee.personalDetails}</Descriptions.Item>
                <Descriptions.Item label="Additional Data">{employee.additionalData}</Descriptions.Item>
            </Descriptions>
            {employee.cv && (
                <Button type="primary" style={{ marginTop: '16px' }} onClick={handleDownloadCv}>
                    Export CV
                </Button>
            )}
        </div>
    );
};

export default EmployeeDetail;
