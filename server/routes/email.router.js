const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((err, success) => {
  if (err) {
    console.error('Error verifying transporter:', err);
  } else {
    console.info('Password reset mailer ready for messages');
  }
});

// Route to send password reset email
router.post('/send', function (req, res) {
  const passwordReset = `Here is your password reset code ${req.body[0]}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body[1],
    subject: 'Password Reset',
    text: passwordReset,
  };

  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      res.status(500).json({ error: 'Error sending reset email' });
    } else {
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

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error sending verification email' });
    } else {
      res.status(200).json({ message: 'Verification email sent', verificationToken });
    }
  });
});

// Verify email token
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const verifyQuery = 'UPDATE "user" SET verified = TRUE WHERE verification_token = $1 RETURNING id';
    const result = await pool.query(verifyQuery, [hashedToken]);

    if (result.rows.length > 0) {
      // Redirect to the frontend verification success page
      res.redirect(`${process.env.FRONTEND_URL}#/verify-email`);
    } else {
      // Redirect to a failure page or return an error message
      res.redirect(`${process.env.FRONTEND_URL}#/verify-email?status=failure`);
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Error verifying token' });
  }
});


// Check if email exists
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  const queryText = 'SELECT email FROM "user" WHERE email = $1';

  try {
    const result = await pool.query(queryText, [email]);
    if (result.rows.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email existence:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
