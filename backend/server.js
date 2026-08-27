const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Alwaysdata MySQL Connection Pool Properties
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

app.get('/api/v1/health', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 1');
        res.status(200).json({ status: "healthy", database: "connected" });
    } catch (err) {
        res.status(500).json({ status: "degraded", error: err.message });
    }
});

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

app.put('/api/v1/grades/update', async (req, res) => {
    const { studentId, courseId, ca1, ca2, ca3 } = req.body;
    if (!studentId || !courseId) return res.status(400).json({ success: false, message: "Missing unique identification matching indices." });

    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const [existingRecord] = await connection.execute('SELECT grade_id FROM grades WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
        if (existingRecord.length === 0) {
            await connection.execute('INSERT INTO grades (student_id, course_id, assessment_1, assessment_2) VALUES (?, ?, ?, ?)', [studentId, courseId, ca1 || 0.00, ca2 || 0.00]);
        } else {
            await connection.execute('UPDATE grades SET assessment_1 = ?, assessment_2 = ? WHERE student_id = ? AND course_id = ?', [ca1 || 0.00, ca2 || 0.00, studentId, courseId]);
        }
        await connection.commit();
        res.status(200).json({ success: true, message: "Continuous Assessment score parameters synchronized successfully." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: "Internal server error." });
    } finally {
        connection.release();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Smart Server engine online. Operational Port Map: ${PORT}`));
