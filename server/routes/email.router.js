const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('Error verifying transporter: ', err);
  } else {
    console.log(`=== Server is ready to take messages: ${success} ===`);
  }
});

// Route to send password reset email
router.post('/send', function (req, res) {
  const passwordReset = `Here is your password reset code ${req.body[0]}`;
  console.log("req.body email", req.body[1]);
  console.log("req.body number", req.body[0]);

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body[1],
    subject: 'Password Reset',
    text: passwordReset,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error ' + err);
      res.status(500).json({ error: 'Error sending reset email' });
    } else {
      console.log('Email sent successfully');
      res.json({ status: 'Email sent' });
    }
  });
});

// Route to send verification email
router.post('/send-verification', (req, res) => {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const verificationUrl = `${process.env.BASE_URL}/api/email/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.error('Error sending email: ' + err);
      res.status(500).json({ error: 'Error sending verification email' });
    } else {
      console.log('Verification email sent successfully');
      res.status(200).json({ message: 'Verification email sent', verificationToken });
    }
  });
});

// Verify email token
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  console.log('Hashed Token from URL:', hashedToken);

  try {
    const verifyQuery = 'UPDATE "user" SET verified = TRUE WHERE verification_token = $1 RETURNING id';
    const result = await pool.query(verifyQuery, [hashedToken]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Error verifying token' });
  }
});

module.exports = router;
