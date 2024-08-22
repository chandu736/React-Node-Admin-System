import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaPlus } from 'react-icons/fa';
import Header from '../dashboard/Header';

const EmployeeList = () => {

    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [filter, setFilter] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sortColumn, sortOrder, filter, selectedDepartment]);

    // Fetching and setting the departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employees/departments');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                alert('Error fetching departments.');
            }
        };

        fetchDepartments();
    }, []);

    // Department filtering function 
    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        setPage(1);
    };

    // Fetch Employees API calling
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees/fetch', {
                params: {
                    page,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filter,
                    department: selectedDepartment,
                },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            alert('Error fetching employees.');
        }
    };

    // Sorting function
    const handleSort = (column) => {
        const order = sortColumn === column && sortOrder === 'ASC' ? 'DESC' : 'ASC';
        setSortColumn(column);
        setSortOrder(order);
    };

    // Filtering function
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setPage(1);
    };

    // Toggle switch function
    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            await axios.put(`http://localhost:5000/api/employees/edit-status/${id}`, { Status: newStatus });
            alert('Employee status updated successfully');
            fetchEmployees();
        } catch (error) {
            console.error('Error updating employee status: ', error);
            alert('Error updating employee status');
        }
    };

    // Delete Employee API calling
    const handleDelete = async (employeeId) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`http://localhost:5000/api/employees/delete/${employeeId}`);
                alert('Employee deleted successfully');
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee: ', error);
                alert('Error deleting employee');
            }
        }
    };

    // Sorting icons function
    const getSortIcon = (column) => {
        if (sortColumn === column) {
            return sortOrder === 'ASC' ? <FaSortUp /> : <FaSortDown />;
        }
        return <FaSort />;
    };

    return (
        <>
            <Header welcomeMessage="Employees List" />
            <div className="container mt-5">
                <div className="row mb-3 align-items-center">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name"
                            value={filter}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                        >
                            <option value="">Filter by department</option>
                            {departments.map((dept) => (
                                <option key={dept.DepartmentID} value={dept.Name}>{dept.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/create">
                            <button className="btn btn-outline-primary"><FaPlus className="me-1" />Add Employee</button>
                        </Link>
                    </div>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th
                                onClick={() => handleSort('Name')}
                                style={{ cursor: 'pointer', color: sortColumn === 'Name' ? 'blue' : 'inherit' }}
                                aria-label="Sort by Name"
                            >
                                Name {getSortIcon('Name')}
                            </th>
                            <th
                                onClick={() => handleSort('Department')}
                                style={{ cursor: 'pointer', color: sortColumn === 'Department' ? 'blue' : 'inherit' }}
                                aria-label="Sort by Department"
                            >
                                Department {getSortIcon('Department')}
                            </th>
                            <th>Phone Number</th>
                            <th
                                onClick={() => handleSort('Status')}
                                style={{ cursor: 'pointer', color: sortColumn === 'Status' ? 'blue' : 'inherit' }}
                                aria-label="Sort by Status"
                            >
                                Status {getSortIcon('Status')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.EmployeeID}>
                                <td>{employee.Name}</td>
                                <td>{employee.Department}</td>
                                <td>{employee.PhoneNumber}</td>
                                <td>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={employee.Status === 'Active'}
                                            onChange={() => handleStatusToggle(employee.EmployeeID, employee.Status)}
                                        />
                                        <label className="form-check-label">
                                            {employee.Status}
                                        </label>
                                    </div>
                                </td>
                                <td>
                                    <Link to={`/employee/${employee.EmployeeID}`}>
                                        <button className="btn btn-info btn-sm">View</button>
                                    </Link>{' '}
                                    <Link to={`/edit-employee/${employee.EmployeeID}`}>
                                        <button className="btn btn-warning btn-sm">Edit</button>
                                    </Link>{' '}
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee.EmployeeID)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(page > 1 ? page - 1 : 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="align-self-center">Page {page}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default EmployeeList;
