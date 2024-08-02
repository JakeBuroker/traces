const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();


// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.EMAIL,
//     pass: process.env.WORD,
//     clientId: process.env.OAUTH_CLIENTID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
//   },
//  });
// * transporter without OAuth implemented
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`=== Server is ready to take messages: ${success} ===`);
  }
});


//  let mailOptions = {
//   from: "test@gmail.com",
//   to: process.env.EMAIL,
//   subject: "Nodemailer API",
//   text: "Hi from your nodemailer API",
//  };

router.post('/send', (req, res) => {
  const { email, token } = req.body;
  const verificationUrl = `${process.env.BASE_URL}/api/email/verify/${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.error('Error sending email: ' + err);
      res.status(500).json({ error: 'Error sending verification email' });
    } else {
      console.log('Verification email sent successfully');
      res.status(200).json({ message: 'Verification email sent' });
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
