import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Header from '../dashboard/Header';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            alert('Error fetching employees.');
        }
    };

    return (
        <>
            <Header welcomeMessage="Departments" />
            <div className="container mt-4">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(department => (
                            <tr key={department.DepartmentID}>
                                <td>{department.DepartmentID}</td>
                                <td>{department.Name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between mb-3">
                    <Link to="/add-department">
                        <button className="btn btn-outline-primary ">
                            <FaPlus className="me-1" /> Add Department
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default DepartmentList;