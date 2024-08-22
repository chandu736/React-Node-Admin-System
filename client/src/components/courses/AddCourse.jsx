import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTimesCircle } from "react-icons/fa";
import Header from '../dashboard/Header';

const AddCourse = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [shortDescription, setShortDescription] = useState('');
    const [sourceLink, setSourceLink] = useState('');
    const [creditPoints, setCreditPoints] = useState('');
    const [status, setStatus] = useState('Active');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleClearImage = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !shortDescription || !sourceLink || !creditPoints || !status || !image) {
            setError('All fields are required');
            return;
        }

        // Source link validation
        const urlRegex = /^(http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(sourceLink)) {
            alert('Invalid URL format');
            return;
        }

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Image', image);
        formData.append('ShortDescription', shortDescription);
        formData.append('SourceLink', sourceLink);
        formData.append('CreditPoints', creditPoints);
        formData.append('Status', status);

        try {
            const response = await axios.post('http://localhost:5000/api/courses/create-course', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccessMessage(response.data.message);
            alert('Course created successfully');
            setTimeout(() => {
                navigate("/course-list");
            }, 2000);
        } catch (error) {
            console.error('Error creating course:', error);
            setError('Error creating course.');
        }
    };

    return (
        <>
            <Header welcomeMessage="Create New Course" />
            <div className="container mt-5">
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    <div className="mb-3">
                        <label className="form-label">Course Title <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Image (Upload) <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }} // Hide the actual file input
                                required
                            />
                            <span className="input-group-text" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                                <FaUpload />
                            </span>
                            {image && (
                                <span className="input-group-text" onClick={handleClearImage} style={{ cursor: 'pointer' }}>
                                    <FaTimesCircle />
                                </span>
                            )}
                        </div>
                        {image && (
                            <div className="mt-2">
                                <span className="d-block">Selected file: {image.name}</span>
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Short Description <span className="text-danger">*</span></label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Source Link <span className="text-danger">*</span></label>
                        <input
                            type="url"
                            className="form-control"
                            value={sourceLink}
                            onChange={(e) => setSourceLink(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Credit Points <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            value={creditPoints}
                            onChange={(e) => setCreditPoints(e.target.value)}
                            required
                        />
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
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/course-list")}
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddCourse;
