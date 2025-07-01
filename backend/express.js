const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

// DB Connection
const db = mysql.createConnection({
    host: 'localhost',
    user:   'root',
    password: '1234',   
    database: 'students_records_db'
});
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});


//post api route
app.post('/api/student', (req, res) => {
    const { name, fatherName, cnic, email, address, gender, phone, age, interMarks, matricMarks } = req.body;
    const sql = 'INSERT INTO students (name, fatherName, cnic, email, address,gender, phone, age, interMarks, matricMarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, fatherName, cnic, email, address, gender, phone, age, interMarks, matricMarks];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error saving student:', err);
            return res.status(500).json({ error: 'Failed to save student' });
        }
        res.status(200).json({ message: 'Student added successfully!' });
    });
})


//get api route
app.get('/api/students', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Failed to fetch students' });
        }
        res.status(200).json(results);
    });
});

//delete api route
app.delete('/api/student/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'DELETE FROM students WHERE id = ?';

    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: 'Failed to delete student' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    });
});
  
// Update student API route
app.put('/api/student/:id', (req, res) => {
    const studentId = req.params.id;
    const {
        name, fatherName, cnic, email, address,
        gender, phone, age, interMarks, matricMarks
    } = req.body;

    const sql = `
      UPDATE students SET
        name = ?, fatherName = ?, cnic = ?, email = ?, address = ?,
        gender = ?, phone = ?, age = ?, interMarks = ?, matricMarks = ?
      WHERE id = ?
    `;

    const values = [name, fatherName, cnic, email, address, gender, phone, age, interMarks, matricMarks, studentId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            return res.status(500).json({ error: 'Failed to update student' });
        }
        res.status(200).json({ message: 'Student updated successfully' });
    });
});
// Start the server  
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
