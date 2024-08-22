import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from '../dashboard/Header';

const CreateEmployee = () => {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [status, setStatus] = useState('Active');
    const [gender, setGender] = useState('Male');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    //Fetching departments API calling
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employees/departments');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setError('Error fetching departments.');
            }
        };

        fetchDepartments();
    }, []);

    //Create Employee API calling
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !department || !status || !gender || !email || !phoneNumber) {
            alert('All fields are required');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format');
            return;
        }

        // Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            alert('Invalid phone number format. It should be a 10-digit number.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/employees/create', {
                Name: name,
                Department: department,
                Status: status,
                Gender: gender,
                Email: email,
                PhoneNumber: phoneNumber
            });

            setSuccessMessage(response.data.message);
            alert('Employee added successfully');
            setTimeout(() => {
                navigate("/employee-list");
            }, 2000);
        } catch (error) {
            console.error('Error creating employee:', error);
            setError('Error creating employee.');
        }
    };

    return (
        <>
            <Header welcomeMessage="Employee Form" />
            <div className="container mt-5">
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    <div className="mb-3">
                        <label className="form-label">Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Department <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.DepartmentID} value={dept.Name}>
                                    {dept.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/employee-list")}
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateEmployee;
