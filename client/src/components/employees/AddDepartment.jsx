import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../dashboard/Header';

const AddDepartment = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/api/employees/add-department', { name })
            .then(() => {
                alert('Department added successfully!');
                navigate('/departments');
            })
            .catch(error => alert('Error adding department:', error));
    };

    return (
        <>
            <Header welcomeMessage="Add Department" />
            <div className="container mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="departmentName" className="form-label">Department Name</label>
                        <input
                            type="text"
                            id="departmentName"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Department</button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/employee-list")}
                    >
                        Back
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddDepartment;