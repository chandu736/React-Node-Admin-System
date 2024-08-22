const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.log('Database Connection error: ' + err.stack);
        return;
    }
    console.log('Connected to mysql database');
});

app.use('/api/users', require('./routes/users')(db));
app.use('/api/employees', require('./routes/employees')(db));
app.use('/api/courses', require('./routes/courses')(db));
app.use('/api/dashboard', require('./routes/dashboard')(db));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});