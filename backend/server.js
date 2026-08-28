const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Alwaysdata MySQL Connection Pool Properties Configuration Matrix
const dbConfig = {
    host: process.env.DB_HOST || 'mysql-anewar.alwaysdata.net', 
    user: process.env.DB_USER || 'anewar_admin',                
    password: process.env.DB_PASSWORD || '015661Emran@',                     
    database: process.env.DB_NAME || 'anewar_smart-school-system', 
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Health Check Route
app.get('/api/v1/health', async (req, res) => {
    try {
        await pool.execute('SELECT 1');
        res.status(200).json({ status: "healthy", database: "connected" });
    } catch (err) {
        res.status(500).json({ status: "degraded", error: err.message });
    }
});

// GET Route: Fetch complete student roster along with active continuous assessment marks
app.get('/api/v1/grades/roster', async (req, res) => {
    const { gradeLevel, courseId } = req.query;
    if (!gradeLevel || !courseId) {
        return res.status(400).json({ success: false, message: "Missing query parameter indices." });
    }
    try {
        const sqlQuery = `
            SELECT 
                s.student_id AS studentId, 
                s.first_name AS name,
                COALESCE(g.assessment_1, 0.00) AS ca1,
                COALESCE(g.assessment_2, 0.00) AS ca2
            FROM students s
            LEFT JOIN grades g ON s.student_id = g.student_id AND g.course_id = ?
            WHERE s.grade_level = ?
            ORDER BY s.first_name ASC
        `;
        const [rows] = await pool.execute(sqlQuery, [courseId, gradeLevel]);
        const formattedRows = rows.map(row => ({
            ...row,
            ca1: parseFloat(row.ca1),
            ca2: parseFloat(row.ca2)
        }));
        res.status(200).json({ success: true, roster: formattedRows });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server registry error." });
    }
});

// PUT Route: Synchronize Continuous Assessment score metrics
app.put('/api/v1/grades/update', async (req, res) => {
    const { studentId, courseId, ca1, ca2 } = req.body;
    if (!studentId || !courseId) return res.status(400).json({ success: false, message: "Missing identifying parameters." });

    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const [existing] = await connection.execute('SELECT grade_id FROM grades WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
        if (existing.length === 0) {
            await connection.execute('INSERT INTO grades (student_id, course_id, assessment_1, assessment_2) VALUES (?, ?, ?, ?)', [studentId, courseId, ca1 || 0.00, ca2 || 0.00]);
        } else {
            await connection.execute('UPDATE grades SET assessment_1 = ?, assessment_2 = ? WHERE student_id = ? AND course_id = ?', [ca1 || 0.00, ca2 || 0.00, studentId, courseId]);
        }
        await connection.commit();
        res.status(200).json({ success: true, message: "Continuous Assessment score parameters synced successfully." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: "Internal server error." });
    } finally {
        connection.release();
    }
});

// POST Route: Process quiz metrics, auto-calculate scores, and preserve data records
app.post('/api/v1/exams/submit', async (req, res) => {
    const { studentName, examId, userAnswers, correctAnswers } = req.body;
    if (!studentName || !examId || !userAnswers || !correctAnswers) {
        return res.status(400).json({ error: 'Missing mandatory validation fields.' });
    }
    let score = 0;
    correctAnswers.forEach((correctVal, idx) => {
        if (userAnswers[idx] === correctVal) score++;
    });
    const percentage = ((score / correctAnswers.length) * 100).toFixed(2);

    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const [result] = await connection.execute(
            'INSERT INTO exam_submissions (student_name, exam_id, score_obtained, total_questions, percentage) VALUES (?, ?, ?, ?, ?)',
            [studentName, examId, score, correctAnswers.length, percentage]
        );
        await connection.commit();
        res.status(200).json({ message: 'Exam saved.', submissionId: result.insertId, score, total: correctAnswers.length, percentage });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: 'Database logging failure.' });
    } finally {
        connection.release();
    }
});

// POST Webhook Processing: Sync transactional parameters via incoming Telebirr payloads
app.post('/api/v1/payments/telebirr-webhook', async (req, res) => {
    const { sign, data } = req.body;
    if (!sign || !data) return res.status(400).json({ code: "400", message: "Malformed parameters" });

    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const [existing] = await connection.execute('SELECT transaction_id FROM financial_transactions WHERE transaction_reference = ?', [data.tradeNo]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(200).json({ code: "200", message: "Idempotent block: already resolved" });
        }
        await connection.execute(
            'INSERT INTO financial_transactions (invoice_id, amount, payment_method, transaction_reference, status) VALUES ((SELECT invoice_id FROM invoices WHERE student_id = (SELECT student_id FROM students WHERE first_name = ? LIMIT 1) LIMIT 1), ?, "telebirr", ?, "SUCCESS")',
            [data.customFields.studentId, data.paymentAmount, data.tradeNo]
        );
        await connection.execute(
            'UPDATE invoices SET amount_paid = amount_paid + ?, status = IF(amount_paid >= total_amount, "PAID", "PARTIAL") WHERE invoice_id = (SELECT invoice_id FROM invoices WHERE student_id = (SELECT student_id FROM students WHERE first_name = ? LIMIT 1) LIMIT 1)',
            [data.paymentAmount, data.customFields.studentId]
        );
        await connection.commit();
        res.status(200).json({ code: "0", message: "Success" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ code: "500", error: err.message });
    } finally {
        connection.release();
    }
});

// POST Endpoint: Clean drop, rebuild tables, and batch-seed production mock matrices
app.post('/api/v1/admin/seed-database', async (req, res) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('DROP TABLE IF EXISTS exam_submissions, financial_transactions, invoices, grades, students');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        await connection.execute('CREATE TABLE students (student_id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(100) NOT NULL, grade_level VARCHAR(10) NOT NULL)');
        await connection.execute('CREATE TABLE grades (grade_id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, course_id INT NOT NULL, assessment_1 DECIMAL(5,2) DEFAULT 0.00, assessment_2 DECIMAL(5,2) DEFAULT 0.00, FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE)');
        await connection.execute('CREATE TABLE invoices (invoice_id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, total_amount DECIMAL(10,2) NOT NULL, amount_paid DECIMAL(10,2) DEFAULT 0.00, status VARCHAR(20) DEFAULT "UNPAID", FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE)');
        await connection.execute('CREATE TABLE financial_transactions (transaction_id INT AUTO_INCREMENT PRIMARY KEY, invoice_id INT NOT NULL, amount DECIMAL(10,2) NOT NULL, payment_method VARCHAR(50) NOT NULL, transaction_reference VARCHAR(100) NOT NULL UNIQUE, status VARCHAR(20) DEFAULT "SUCCESS", date_executed TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE)');
        await connection.execute('CREATE TABLE IF NOT EXISTS exam_submissions (id INT AUTO_INCREMENT PRIMARY KEY, student_name VARCHAR(255) NOT NULL, exam_id INT NOT NULL, score_obtained INT NOT NULL, total_questions INT NOT NULL, percentage DECIMAL(5,2) NOT NULL, submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        await connection.execute("INSERT INTO students (first_name, grade_level) VALUES ('Tariku', '9B'), ('Martha', '4A'), ('Meskere T.', '8A'), ('Yonas A.', '8A')");
        await connection.execute("INSERT INTO invoices (student_id, total_amount, amount_paid, status) VALUES (1, 45000.00, 26500.00, 'PARTIAL'), (2, 45000.00, 45000.00, 'PAID'), (3, 45000.00, 0.00, 'UNPAID'), (4, 45000.00, 45000.00, 'PAID')");
        await connection.execute("INSERT INTO financial_transactions (invoice_id, amount, payment_method, transaction_reference) VALUES (1, 18500.00, 'telebirr', '9FL5XYZ7820'), (1, 8000.00, 'CBE Transfer', 'CBE-FT-99120'), (2, 45000.00, 'telebirr', '9BF2AAA1450')");
        await connection.execute("INSERT INTO grades (student_id, course_id, assessment_1, assessment_2) VALUES (1, 101, 15.00, 14.00), (3, 101, 14.50, 8.50), (4, 101, 9.00, 13.50)");

        await connection.commit();
        res.status(200).json({ success: true, message: "Alwaysdata databases initialized and seeded perfectly!" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ success: false, error: err.message });
    } finally {
        connection.release();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Smart Server engine online on Port: ${PORT}));
