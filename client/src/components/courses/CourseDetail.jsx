import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../dashboard/Header';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourseDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetching Course By ID API calling
    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/courses/fetch/${courseId}`);
            setCourse(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching details: ', error);
            setError('Error fetching course details');
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
            <Header welcomeMessage="Course Details" />
            <div className="container mt-5">
                <div className="card">
                    <div className="card-header">
                        <h2>{course.Title}</h2>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <img src={
                                    course.Image.startsWith('http')
                                        ? course.Image
                                        : `http://localhost:5000/uploads/${course.Image}`
                                } alt={course.Title} className="img-fluid" />
                            </div>
                            <div className="col-md-8">
                                <p><strong>Short Description:</strong> {course.ShortDescription}</p>
                                <p><strong>Source Link:</strong> <a href={course.SourceLink} target="_blank" rel="noopener noreferrer">{course.SourceLink}</a></p>
                                <p><strong>Credit Points:</strong> {course.CreditPoints}</p>
                                <p><strong>Status:</strong> {course.Status}</p>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => navigate("/course-list")}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
