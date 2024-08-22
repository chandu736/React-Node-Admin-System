const express = require('express');
const router = express.Router();

module.exports = (db) => {

    router.get('/', (req, res) => {
        const dashboardData = {};

        db.query('SELECT COUNT(*) AS count FROM employees', (err, results) => {
            if (err) {
                console.error('Error fetching total employees:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            dashboardData.totalEmployees = results[0].count;

            db.query('SELECT COUNT(*) AS count FROM courses', (err, results) => {
                if (err) {
                    console.error('Error fetching courses uploaded:', err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                dashboardData.coursesUploaded = results[0].count;

                db.query('SELECT COUNT(*) AS count FROM employees WHERE status = "Active"', (err, results) => {
                    if (err) {
                        console.error('Error fetching active employees:', err.message);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    dashboardData.activeEmployees = results[0].count;

                    db.query('SELECT COUNT(*) AS count FROM employees WHERE status = "Inactive"', (err, results) => {
                        if (err) {
                            console.error('Error fetching inactive employees:', err.message);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                        dashboardData.inactiveEmployees = results[0].count;

                        res.json(dashboardData);
                    });
                });
            });
        });
    });

    //Fetching all employees
    router.get('/all-employees', (req, res) => {
        const query = 'SELECT * FROM employees';
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    });

    //Fetching all courses
    router.get('/all-courses', (req, res) => {
        const query = 'SELECT * FROM courses';
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            res.json(results);
        });
    });

    //Fetching active employees
    router.get('/active-employees',(req,res)=>{
        const query='SELECT * FROM employees WHERE status="Active"';
        db.query(query,(err,results)=>{
            if(err){
                res.status(500).json({message:'Database error'});
            }
            res.json(results);
        });
    });

    //Fetching Inactive employees
    router.get('/inactive-employees',(req,res)=>{
        const query='SELECT * FROM employees WHERE status="Inactive"';
        db.query(query,(err,results)=>{
            if(err){
                res.status(500).json({message:'Database error'});
            }
            res.json(results);
        });
    });

    return router;
};
