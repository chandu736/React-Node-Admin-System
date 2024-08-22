import '../../css/AdminLogin.css';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            console.log(response);
            if (response.data.message === 'Login successful') {
                navigate('/dashboard');
            } else {
                setError('Invalid Credentials');
            }
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    return (
        <div className='admin-login'>
            <form onSubmit={handleLogin}>
                <h2>Admin Login</h2>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" >Login</button>
                {error && <p>{error}</p>}
                <a href="/forget-password">Forget Password</a>
            </form>
        </div>
    );
};

export default AdminLogin;