import '../../css/ForgotPassword.css';
import React, { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const handleForgetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/forget-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setMessage(err.response.data.message);
        }
    };

    return (
        <div className='forgot-password'>
            <form onSubmit={handleForgetPassword}>
                <h2>Forget Password</h2>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit">Submit</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ForgetPassword;