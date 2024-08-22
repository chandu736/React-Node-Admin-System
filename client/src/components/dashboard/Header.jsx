import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaBook, FaUsers, FaBuilding, FaHome } from 'react-icons/fa';

const Header = ({ welcomeMessage }) => {
    return (
        <div className="header-outer bg-secondary p-3" style={{ backgroundColor: '#e3f2fd' }}>
            <div className="header-container bg-secondary text-white p-3 rounded" >
                <div className="d-flex justify-content-between align-items-center"  >
                    <h2 className="mb-0">{welcomeMessage}</h2>
                    <div className="d-flex align-items-center" >
                        <Link to="/dashboard" className="text-decoration-none me-2">
                            <button className="btn btn-light d-flex align-items-center">
                                <FaHome className="me-1" /> Home
                            </button>
                        </Link>
                        <Link to="/employee-list" className="text-decoration-none me-2">
                            <button className="btn btn-light d-flex align-items-center">
                                <FaUsers className="me-1" /> Employees
                            </button>
                        </Link>
                        <Link to="/course-list" className="text-decoration-none me-2">
                            <button className="btn btn-light d-flex align-items-center">
                                <FaBook className="me-1" /> Courses
                            </button>
                        </Link>
                        <Link to="/departments" className="text-decoration-none me-2">
                            <button className="btn btn-light d-flex align-items-center">
                                <FaBuilding className="me-1" /> Departments
                            </button>
                        </Link>
                        <Link to="/" className="text-decoration-none">
                            <button className="btn btn-light d-flex align-items-center">
                                <FaSignOutAlt className="me-1" /> Logout
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
