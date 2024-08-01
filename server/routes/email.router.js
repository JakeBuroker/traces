const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const nodemailer = require("nodemailer");

/**
 * GET route template
 */
router.get('/', (req, res) => {
  // GET route code here
});

/**
 * POST route template
 */

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
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.WORD
  },
 });

 transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
 });

//  let mailOptions = {
//   from: "test@gmail.com",
//   to: process.env.EMAIL,
//   subject: "Nodemailer API",
//   text: "Hi from your nodemailer API",
//  };

 // * This is the actual route that sends the email
 router.post("/send", function (req, res) {
   let passwordReset = `
 Here is your password reset code ${req.body[0]}`
  console.log("req.body email", req.body[1]);
  console.log("req.body number", req.body[0]);

  let mailOptions = {
    from: "test@gmail.com",
    to: req.body[1],
    subject: "Nodemailer API",
    text: passwordReset,
  };
 
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
      res.json({ status: "Email sent" });
    }
  });
 });



module.exports = router;
