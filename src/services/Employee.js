class Employee {
    constructor(id, name, position, status, personalDetails = {}, contactInformation = {}, additionalData = {}) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.status = status; // Involved, Available, Inactive
        this.personalDetails = personalDetails;
        this.contactInformation = contactInformation;
        this.additionalData = additionalData;
    }
}

// Mock data initialization
if (!localStorage.getItem('employees')) {
    const initialEmployees = [
        new Employee(1, "John Doe", "Developer", "Available", { age: 30, gender: "Male" }, { email: "john@example.com", phone: "123456789" }),
        new Employee(2, "Jane Smith", "Manager", "Involved", { age: 40, gender: "Female" }, { email: "jane@example.com", phone: "987654321" })
    ];
    localStorage.setItem('employees', JSON.stringify(initialEmployees));
}

export default Employee;
