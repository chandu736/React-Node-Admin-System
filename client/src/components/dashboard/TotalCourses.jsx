import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const TotalCourses = () => {

    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/dashboard/all-courses', {});
            setCourses(response.data);
        } catch (err) {
            alert('Error fetching employees.');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <Header welcomeMessage={"All Courses"} />
            <div className="container mt-4">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>S.No</th>
                            <th>Title</th>
                            <th>Upload Date</th>
                            <th>Number of Completions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={course.CourseID}>
                                <td>{index + 1}</td>
                                <td>{course.Title}</td>
                                <td>{formatDate(course.created_at)}</td>
                                <td>{course.Completions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/dashboard")}>Back</button>
            </div>
        </>
    );

};

export default TotalCourses;
