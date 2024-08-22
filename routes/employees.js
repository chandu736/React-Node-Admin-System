const express = require('express');
const router = express.Router();

module.exports = (db) => {

    //Employee Listing
    router.get('/fetch', (req, res) => {
        const { page = 1, pageSize = 10, sortColumn = 'EmployeeID', sortOrder = 'ASC', filter = '', department = '' } = req.query;

        const offset = (page - 1) * pageSize;
        const filterCondition = `%${filter}%`;
        const departmentCondition = department ? 'AND Department = ?' : '';

        const validSortColumns = ['EmployeeID', 'Name', 'Department', 'Status'];
        const validSortOrders = ['ASC', 'DESC'];

        const sanitizedSortColumn = validSortColumns.includes(sortColumn) ? sortColumn : 'EmployeeID';
        const sanitizedSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

        const query = `
            SELECT * FROM employees
            WHERE (Name LIKE ? OR Department LIKE ?) ${departmentCondition}
            ORDER BY ${db.escapeId(sanitizedSortColumn)} ${sanitizedSortOrder}
            LIMIT ? OFFSET ?
        `;
        const params = [filterCondition, filterCondition];
        if (department) params.push(department);
        params.push(parseInt(pageSize), parseInt(offset));

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    });

    //View Employee by ID
    router.get('/fetch/:id', (req, res) => {
        const { id } = req.params;
        const query = `
        SELECT * FROM employees WHERE EmployeeID=?
        `;
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Database error: ', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Employee Not Found' });
            }
            res.json(results[0]);
        });
    });


    //Add a new Employee
    router.post('/create', (req, res) => {
        const { Name, Gender, Department, Status, Email, PhoneNumber } = req.body;

        if (!Name || !Gender || !Department || !Status || !Email || !PhoneNumber) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const query = `
        INSERT INTO employees ( Name, Gender, Department, Status, Email, PhoneNumber)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [Name, Gender, Department, Status, Email, PhoneNumber], (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Employee created successfully', employeeID: results.insertId });
        });
    });

    //Edit employee
    router.put('/edit/:id', (req, res) => {
        const { id } = req.params;
        const { Name, Gender, Department, Status, Email, PhoneNumber } = req.body;

        if (!Name || !Gender || !Department || !Status || !Email || !PhoneNumber) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const query = `
        UPDATE employees
        SET Name = ?, Gender = ?, Department = ?, Status = ?, Email = ?, PhoneNumber = ?
        WHERE EmployeeID = ?
        `;
        db.query(query, [Name, Gender, Department, Status, Email, PhoneNumber, id], (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Employee Not Found' });
            }

            res.json({ message: 'Employee updated successfully' });
        });
    });

    //Delete Employee
    router.delete('/delete/:id', (req, res) => {
        const { id } = req.params;

        const query = `
            DELETE FROM employees WHERE EmployeeID = ?
        `;

        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Employee Not Found' });
            }

            res.json({ message: 'Employee deleted successfully' });
        });
    });

    //Manage Employee status
    router.put('/edit-status/:id', (req, res) => {
        const { id } = req.params;
        const { Status } = req.body;

        if (!Status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const query = `
        UPDATE employees
        SET Status = ?
        WHERE EmployeeID = ?
    `;
        db.query(query, [Status, id], (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Employee Not Found' });
            }

            res.json({ message: 'Employee status updated successfully' });
        });
    });

    //Listing all departments
    router.get('/departments', (req, res) => {
        db.query('SELECT * FROM departments', (err, results) => {
            if (err) return res.status(500).json({ message: 'err.message' });
            res.json(results);
        });
    });

    //Add new department
    router.post('/add-department', (req, res) => {
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: 'Department name is required' });

        db.query('INSERT INTO departments (name) VALUES (?)', [name], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, name });
        });
    });

    return router;
};  
