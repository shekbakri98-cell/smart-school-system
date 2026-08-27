const express = require('express');
const cors = require('cors');
const app = express();

// CORS hundumaaf banuu (Frontend akka siriitti dubbisuuf)
app.use(cors());
app.use(express.json());

// 🗄️ Database Fake (Odeeffannoo kaffaltii fi qabxii barattootaa)
let studentDatabase = {
    'STD-0419': {
        name: 'Tariku Abebe',
        grade: 'Grade 9B',
        totalInvoice: 45000,
        amountPaid: 26500,
        balance: 18500,
        ca1: 8, ca2: 15, ca3: 22, exam: 30, // Qabxii Teacher Dashboard
        transactions: [
            { date: 'Aug 25, 2026', ref: '9FL5XYZ7820', amount: '18,500.00', status: 'SUCCESS', method: 'telebirr' },
            { date: 'May 02, 2026', ref: 'CBE-FT-99120', amount: '8,000.00', status: 'SUCCESS', method: 'CBE Transfer' }
        ]
    },
    'STD-0882': {
        name: 'Martha Abebe',
        grade: 'Grade 4A',
        totalInvoice: 45000,
        amountPaid: 45000,
        balance: 0,
        ca1: 9, ca2: 18, ca3: 26, exam: 35, // Qabxii Teacher Dashboard
        transactions: [
            { date: 'Jan 14, 2026', ref: '9BF2AAA1450', amount: '45,000.00', status: 'SUCCESS', method: 'telebirr' }
        ]
    }
};

// 🌟 1. GET: Dashboard barataa Parent Portal-f erguu
app.get('/api/v1/students/:studentId/dashboard', (req, res) => {
    const { studentId } = req.params;
    const studentData = studentDatabase[studentId];
    if (!studentData) return res.status(404).json({ message: "Barataan hin argamne" });
    res.status(200).json(studentData);
});

// 🌟 2. GET: Qabxii barattootaa Teacher Dashboard-f erguu
app.get('/api/v1/grades/continuous-assessment', (req, res) => {
    const studentList = Object.keys(studentDatabase).map(id => ({
        id: id,
        name: studentDatabase[id].name,
        ca1: studentDatabase[id].ca1,
        ca2: studentDatabase[id].ca2,
        ca3: studentDatabase[id].ca3,
        exam: studentDatabase[id].exam
    }));
    res.status(200).json(studentList);
});

// 🌟 3. POST: Qabxii barsiisaan jijjiire database irratti update gochuu
app.post('/api/v1/grades/update', (req, res) => {
    const { studentId, ca1, ca2, ca3, exam } = req.body;
    if (studentDatabase[studentId]) {
        studentDatabase[studentId].ca1 = Number(ca1);
        studentDatabase[studentId].ca2 = Number(ca2);
        studentDatabase[studentId].ca3 = Number(ca3);
        studentDatabase[studentId].exam = Number(exam);
        return res.status(200).json({ message: "Qabxiin milkiidhaan update ta'eera!" });
    }
    res.status(400).json({ message: "Barataa argachuun hin danda'amne." });
});

// 🌟 4. POST: Telebirr Webhook kaffaltii galmeessu
app.post('/api/v1/payments/telebirr-webhook', (req, res) => {
    const studentId = req.body.data?.customFields?.studentId;
    if (studentId && studentDatabase[studentId]) {
        studentDatabase[studentId].amountPaid = studentDatabase[studentId].totalInvoice;
        studentDatabase[studentId].balance = 0;
        studentDatabase[studentId].transactions.unshift({
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            ref: req.body.data.tradeNo || 'TXN-LIVE',
            amount: req.body.data.paymentAmount,
            status: 'SUCCESS',
            method: 'telebirr'
        });
        return res.status(200).json({ code: "200", message: "Transaction completed successfully" });
    }
    res.status(400).json({ code: "400", message: "Failed" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
