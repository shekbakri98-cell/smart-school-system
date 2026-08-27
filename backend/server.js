const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// 🌟 CORS CONFIGURATION: 'Failed to fetch' guutummaatti dhabamsiisuuf
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 🌟 ALWAYS DATA CLOUD DATABASE PROPERTIES - CREDENTIALS HAARAA
const dbConfig = {
    host: process.env.DB_HOST || 'mysql-anewar.alwaysdata.net', 
    user: process.env.DB_USER || 'anewar_admin', // 👈 anewar_smart dhiisii anewar_admin godhi
    password: process.env.DB_PASSWORD || '015661Emran@', // 👈 Password haaraa kana kaayi
    database: process.env.DB_NAME || 'anewar_smart-school-system', 
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
const pool = mysql.createPool(dbConfig);

// Health Check Endpoint
app.get('/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        res.status(200).json({ status: "healthy", database: "connected" });
    } catch (err) {
        res.status(500).json({ status: "unhealthy", error: err.message });
    }
});

// GET Endpoint: Ragaa Barataa Alwaysdata phpMyAdmin irraa fiduu
app.get('/api/v1/students/:studentId/dashboard', async (req, res) => {
    const { studentId } = req.params;
    const dbStudentId = studentId === 'STD-0419' ? 1 : 2; 

    try {
        // Query 1: Gabatee 'invoices' irraa herrega fiduu
        const [invoices] = await pool.query('SELECT * FROM invoices WHERE student_id = ? LIMIT 1', [dbStudentId]);
        
        let transactions = [];
        if (invoices.length > 0) {
            // Query 2: Gabatee 'financial_transactions' irraa seenaa kaffaltii fiduu
            const [txList] = await pool.query(
                'SELECT processed_at as date, reference_no as ref, amount_paid as amount, gateway as method FROM financial_transactions WHERE invoice_id = ?', 
                [invoices[0].invoice_id]
            );
            transactions = txList;
        }

        if (invoices.length === 0) {
            // Database keessaa yoo dhabame ijaarri akka hin ijaaramneef fallback mockup deebisi
            return res.status(200).json({
                totalInvoice: 45000,
                amountPaid: 26500,
                balance: 18500,
                transactions: []
            });
        }

        res.status(200).json({
            totalInvoice: Number(invoices[0].total_amount),
            amountPaid: Number(invoices[0].amount_paid),
            balance: Number(invoices[0].total_amount) - Number(invoices[0].amount_paid),
            transactions: transactions
        });

    } catch (err) {
        res.status(500).json({ message: "Database query fail", error: err.message });
    }
});

// Smart Telebirr Payment Webhook Reconciliation Endpoint
app.post('/api/v1/payments/telebirr-webhook', async (req, res) => {
    const { sign, data } = req.body;
    
    if (!data || !data.tradeNo || !data.outTradeNo) {
        return res.status(400).json({ code: "400", message: "Malformed payload parameter mapping." });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const [existingTx] = await connection.execute('SELECT transaction_id FROM financial_transactions WHERE reference_no = ?', [data.tradeNo]);
        if (existingTx.length > 0) {
            await connection.rollback();
            return res.status(200).json({ code: "200", message: "Transaction reference hash key previously processed." });
        }

        await connection.execute(
            'INSERT INTO financial_transactions (invoice_id, amount_paid, reference_no, gateway, status) VALUES (?, ?, ?, "telebirr", "SUCCESS")',
            [data.outTradeNo, data.paymentAmount, data.tradeNo]
        );

        await connection.execute(
            'UPDATE invoices SET amount_paid = amount_paid + ?, status = IF(amount_paid >= total_amount, "PAID", "PARTIAL") WHERE invoice_id = ?',
            [data.paymentAmount, data.outTradeNo]
        );

        await connection.commit();
        res.status(200).json({ code: "200", message: "Transaction completed successfully" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ code: "500", message: "Internal transactional system rollback executed.", error: error.message });
    } finally {
        connection.release();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
