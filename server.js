// server.js

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();

// Configure bodyParser to parse JSON
app.use(bodyParser.json());

// API endpoint to calculate net salary and send email
app.post('/calculateNetSalary', (req, res) => {
    // Get employee details from request body
    const { empId, empName, email, basicPay, allowances, deductions } = req.body;

    // Calculate net salary
    const hra = allowances.hra || 0;
    const ta = allowances.ta || 0;
    const pf = deductions.pf || 0;
    const lic = deductions.lic || 0;

    const grossSalary = basicPay + hra + ta;
    const netSalary = grossSalary - (pf + lic);

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Your Gmail email address
            pass: 'your-password' // Your Gmail password
        }
    });

    // Setup email data
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Net Salary Details',
        text: `Dear ${empName},\n\nYour net salary for the month is ${netSalary}.\n\nRegards,\nYour Company`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
