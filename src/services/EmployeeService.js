export const viewEmployeeProfiles = () => {
    return JSON.parse(localStorage.getItem('employees')) || [];
};

export const createNewEmployee = (name, position, personalDetails, phoneNumber, email, additionalData) => {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const newEmployee = {
        id: Date.now().toString(),
        name,
        position,
        personalDetails,
        phoneNumber,
        email,
        additionalData,
        status: 'Active',
    };
    employees.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(employees));
};

export const editEmployeeProfile = (id, updatedEmployee) => {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const index = employees.findIndex(employee => employee.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updatedEmployee };
        localStorage.setItem('employees', JSON.stringify(employees));
    }
};
