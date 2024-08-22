import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const InactiveEmployees = () => {

    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/inactive-employees', {});
            setEmployees(response.data);
        } catch (err) {
            alert('Error fetching employees.');
        }
    };

    return (
        <>
            <Header welcomeMessage={"Active Employees"} />
            <div className="container mt-4">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee,index) => (
                            <tr key={employee.EmployeeID}>
                                <td>{index+1}</td>
                                <td>{employee.Name}</td>
                                <td>{employee.Department}</td>
                                <td>{employee.PhoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/dashboard")}>Back</button>
            </div>
        </>
    );

};

export default InactiveEmployees;
