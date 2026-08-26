const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/v1/payments/telebirr-webhook', (req, res) => {
    console.log("Telebirr Webhook received:", req.body);
    res.status(200).json({ code: "200", message: "Transaction completed successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
