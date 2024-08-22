import '../../css/ResetPassword.css';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const validatePassword = (newPassword) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*]).{8,}$/;
        return passwordRegex.test(newPassword);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword(newPassword)) {
            alert('Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.');
        }
        if (newPassword !== confirmPassword) {
            return setMessage('Passwords do not match');
        }
        try {
            const response = await axios.post('http://localhost:5000/api/users/reset-password', { token, newPassword });
            alert(response.data.message);
            navigate('/login');
        } catch (err) {
            setMessage(err.response.data.message);
        }
    };

    return (
        <div className="reset-password">
            <form onSubmit={handleResetPassword}>
                <h2>Reset Password:</h2>
                <div>
                    <label>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit">Submit</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;