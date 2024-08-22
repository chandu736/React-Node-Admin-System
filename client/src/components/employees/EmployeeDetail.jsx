import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from '../dashboard/Header';

const EmployeeDetail = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployeeDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Fetching Employee By ID API calling
    const fetchEmployeeDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/employees/fetch/${id}`);
            setEmployee(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching details: ', error);
            setError('Error fetching employee details');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <>
        <Header welcomeMessage="Employee Details" />
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
                <div className="card-body">
                    {employee ? (
                        <div>
                            <p><strong>Employee ID:</strong> {employee.EmployeeID}</p>
                            <p><strong>Name:</strong> {employee.Name}</p>
                            <p><strong>Gender:</strong> {employee.Gender}</p>
                            <p><strong>Department:</strong> {employee.Department}</p>
                            <p><strong>Status:</strong> {employee.Status}</p>
                            <p><strong>Email:</strong> {employee.Email}</p>
                            <p><strong>Phone Number:</strong> {employee.PhoneNumber}</p>
                        </div>
                    ) : (
                        <div className="alert alert-warning text-center" role="alert">
                            Employee not found.
                        </div>
                    )}
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => navigate("/employee-list")}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default EmployeeDetail;
