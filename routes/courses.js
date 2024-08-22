const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

module.exports = (db) => {

    //Courses Listing
    router.get('/fetch', (req, res) => {
        const { page = 1, pageSize = 10, sortColumn = 'CourseID', sortOrder = 'ASC', filter = '', status = 'All' } = req.query;

        const offset = (page - 1) * pageSize;
        const filterCondition = `%${filter}%`;

        const validSortColumns = ['CourseID', 'Title', 'ShortDescription', 'SourceLink', 'CreditPoints', 'Status'];
        const validSortOrders = ['ASC', 'DESC'];

        const sanitizedSortColumn = validSortColumns.includes(sortColumn) ? sortColumn : 'CourseID';
        const sanitizedSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

        let query = `
        SELECT * FROM courses
        WHERE (Title LIKE ? OR ShortDescription LIKE ? OR SourceLink LIKE ?)
    `;
        const queryParams = [filterCondition, filterCondition, filterCondition];

        // Add status condition if not 'All'
        if (status !== 'All') {
            query += ' AND Status = ?';
            queryParams.push(status);
        }

        query += `
        ORDER BY ${db.escapeId(sanitizedSortColumn)} ${sanitizedSortOrder}
        LIMIT ? OFFSET ?
    `;
        queryParams.push(parseInt(pageSize), parseInt(offset));
        db.query(query, queryParams, (err, results) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    });

    //View course by id
    router.get('/fetch/:id', (req, res) => {
        const { id } = req.params;
        const query = `
        SELECT * FROM courses WHERE CourseID=?
        `;
        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Course Not Found' });
            }
            res.json(results[0]);
        });
    });

    //Multer for file uploads
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });

    //Add a new course
    router.post('/create-course', upload.single('Image'), (req, res) => {
        const { Title, ShortDescription, SourceLink, CreditPoints, Status } = req.body;
        const Image = req.file ? req.file.filename : null;

        if (!Title || !ShortDescription || !SourceLink || !CreditPoints || !Status || !Image) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const query = `
        INSERT INTO courses (Title, Image, ShortDescription, SourceLink, CreditPoints, Status)
        VALUES(?,?,?,?,?,?)
        `;

        db.query(query, [Title, Image, ShortDescription, SourceLink, CreditPoints, Status], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database Error' });
            }
            res.status(201).json({ message: 'New course added successfully', courseId: results.insertId });
        });
    });

    //Edit course
    router.put('/edit/:id', upload.single('Image'), (req, res) => {
        const { id } = req.params;
        const { Title, ShortDescription, SourceLink, CreditPoints, Status } = req.body;
        const Image = req.file ? req.file.filename : req.body.ExistingImage;

        if (!Title || !ShortDescription || !SourceLink || !CreditPoints || !Status) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const query = `
        UPDATE courses 
        SET Title = ?, Image = ?, ShortDescription = ?, SourceLink = ?, CreditPoints = ?, Status = ?
        WHERE CourseID = ?
        `;

        db.query(query, [Title, Image, ShortDescription, SourceLink, CreditPoints, Status, id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database Error' });
            }

            if (results.affectedRows === 0) {
                return res.status(400).json({ message: 'Course not found' });
            }

            res.json({ message: 'Course updated successfully' });
        });
    });

    //Delete Course
    router.delete('/delete/:id', (req, res) => {
        const { id } = req.params;

        const query = `
        DELETE FROM courses WHERE CourseID = ?;
        `;

        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database Error' });
            }

            if (results.affectedRows === 0) {
                return res.status(400).json({ message: 'Course not found' });
            }

            res.json({ message: 'Course deleted successfully' });
        });
    });

    //Manage course status
    router.put('/edit-status/:id', (req, res) => {
        const { id } = req.params;
        const { Status } = req.body;

        if (!Status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const query = `
        UPDATE courses SET Status = ? WHERE CourseID = ?
        `;

        db.query(query, [Status, id], (err, results) => {

            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Course Not Found' });
            }

            res.json({ message: 'Course status updated successfully' });
        });
    });

    return router;
};