const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});  

module.exports = function (db) {
    const router = express.Router();

    //Register
    router.post('/register', async (req, res) => {
        const { email, password } = req.body;
        try {
            db.query('SELECT * FROM employees WHERE email=?', [email], (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

                const hashedPassword = bcrypt.hashSync(password, 8);
                db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
                    if (err) return res.status(500).json({ message: 'Database error' });
                    res.status(201).json({ message: 'User created successfully' });
                });
            });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    //Login
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            db.query('SELECT * FROM employees WHERE Email = ?', [email], async (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error' });

                if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

                const user = results[0];
                console.log('User password:', user.password);
                const match = await bcrypt.compare(password, user.password);
                if (!match) return res.status(400).json({ message: 'Invalid credentials' });

                res.json({ message: 'Login successful' });
            });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    //Forget-Password
    router.post('/forget-password', async (req, res) => {
        const { email } = req.body;
        try {
            db.query('SELECT * FROM employees WHERE Email = ?', [email], (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                if (results.length === 0) return res.status(400).json({ message: 'Email not found' });

                const resetToken = crypto.randomBytes(32).toString('hex');
                const resetTokenExpiry = new Date(Date.now() + 3600000);//1 hour

                db.query('UPDATE employees SET resetToken = ?, resetTokenExpiry = ? WHERE Email = ?', [resetToken, resetTokenExpiry, email], (err) => {
                    if (err) return res.status(500).json({ message: 'Database error' });

                    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: 'Password Reset',
                        html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            return res.status(500).json({ message: 'Error sending email' });
                        }
                        res.json({ message: 'Password reset email sent' });
                    });
                });
            });
        } catch (err) {
            res.status(500).json({ message: 'server error' });
        }
    });

    //Reset Password
    router.post('/reset-password', async (req, res) => {
        const { token, newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        try {
            db.query('SELECT * FROM employees WHERE resetToken = ? AND resetTokenExpiry > ?', [token, new Date()], async (err, results) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                if (results.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

                const user = results[0];

                try {
                    const hashedPassword = await bcrypt.hash(newPassword, 8);
                    db.query('UPDATE employees SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?', [hashedPassword, token], (err) => {
                        if (err) return res.status(500).json({ message: 'Database error' });

                        res.json({ message: 'Password reset successfully' });
                    });
                } catch (hashErr) {
                    return res.status(500).json({ message: 'Error hashing password' });
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });
    return router;
};