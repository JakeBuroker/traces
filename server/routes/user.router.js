const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

dotenv.config();

// AWS setup
const aws = require('@aws-sdk/client-s3');
const signer = require('@aws-sdk/s3-request-presigner');

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new aws.S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const awsGetURLs = async (result) => {
  for (let e of result.rows) {
    if (e.media_type !== 1) {
      const command = new aws.GetObjectCommand({
        Bucket: bucketName,
        Key: e.aws_key,
      });
      const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 });
      e.aws_url = url;
    }
  }
  return result.rows;
};

const awsGetAvatarULRs = async (result) => {
  for (let j of result) {
    if (j.avatar_url) {
      const command = new aws.GetObjectCommand({
        Bucket: bucketName,
        Key: j.avatar_url,
      });
      const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 });
      j.avatar_AWS_URL = url;
    }
  }
  return result;
};

const awsGetVerificationPhotoURLs = async (result) => {
  for (let j of result) {
    if (j.verification_photo) {
      const command = new aws.GetObjectCommand({
        Bucket: bucketName,
        Key: j.verification_photo,
      });
      const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 });
      j.verification_photo_AWS_URL = url;
    }
  }
  return result;
};

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

transporter.verify((err, success) => {
  if (err) {
    console.error('Error verifying transporter:', err);
  } else {
    console.info('Email verification reset mailer ready for messages');
  }
});

// Route to get all users (admin only)
router.get('/users', rejectUnauthenticated, async (req, res) => {
  if (req.user.role === 2) {
    const queryText = 'SELECT id, username, email, full_name, role, phone_number, avatar_url, verification_photo, video_watched, pronouns FROM "user"';
    try {
      const result = await pool.query(queryText);
      const usersWithAvatars = await awsGetAvatarULRs(result.rows);
      const usersWithVerificationPhotos = await awsGetVerificationPhotoURLs(usersWithAvatars);
      res.json(usersWithVerificationPhotos);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
});

// Route to get all evidence for a specific user (admin only)
router.get('/:id/evidence', rejectUnauthenticated, async (req, res) => {
  if (req.user.role === 2) {
    const userId = req.params.id;
    const queryText = 'SELECT * FROM "evidence" WHERE user_id = $1';

    try {
      const result = await pool.query(queryText, [userId]);
      const evidenceList = await awsGetURLs(result);
      res.json(evidenceList);
    } catch (error) {
      console.error('Error fetching user evidence:', error);
      res.sendStatus(500);
    }
  }
});

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, async (req, res) => {
  const queryText = 'SELECT * FROM "user" WHERE id = $1';
  try {
    const result = await pool.query(queryText, [req.user.id]);
    const usersWithAvatars = await awsGetAvatarULRs(result.rows);
    const usersWithVerificationPhotos = await awsGetVerificationPhotoURLs(usersWithAvatars);
    res.send(usersWithVerificationPhotos[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.sendStatus(500);
  }
});

// Route for admin to delete a user
router.delete('/:id', rejectUnauthenticated, async (req, res) => {
  const userId = req.params.id;
  const queryText = 'DELETE FROM "user" WHERE id = $1 RETURNING *';

  try {
    const result = await pool.query(queryText, [userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.sendStatus(500);
  }
});

// Handles POST request with new user data and verification photo upload
router.post('/register', upload.single('verification_photo'), async (req, res) => {
  const username = req.body.username;
  const password = await encryptLib.encryptPassword(req.body.password);
  const { email, phone_number, role, full_name, pronouns } = req.body;
  const verificationToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  try {
    let verificationPhotoKey;
    if (req.file) {
      const fileContent = req.file.buffer;
      verificationPhotoKey = `${crypto.randomBytes(8).toString('hex')}-${req.file.originalname}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: verificationPhotoKey,
        Body: fileContent,
        ContentType: req.file.mimetype,
      };

      await s3.send(new aws.PutObjectCommand(uploadParams));
    }

    const queryText = `
      INSERT INTO "user" (username, password, email, phone_number, role, full_name, verification_photo, verification_token, verified, pronouns)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `;
    const result = await pool.query(queryText, [username, password, email, phone_number, role, full_name, verificationPhotoKey, hashedToken, false, pronouns]);

    const verificationUrl = `${process.env.BASE_URL}/api/email/verify/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending email: ' + err);
        res.status(500).json({ error: 'Error sending verification email' });
      } else {
        res.status(200).json({ message: 'Verification email sent' });
      }
    });
  } catch (error) {
    console.error('User registration failed:', error);
    res.sendStatus(500);
  }
});

// Route to update video watched status
router.put('/watched/:id', rejectUnauthenticated, async (req, res) => {
  const queryText = `
    UPDATE "user"
    SET "video_watched" = true
    WHERE "id" = $1;
  `;
  const queryParams = [req.user.id];

  const connection = await pool.connect();

  try {
    await connection.query('BEGIN');
    const result = await connection.query(queryText, queryParams);

    if (result.rowCount === 0) {
      throw new Error('User not found or video already watched.');
    }

    await connection.query('COMMIT');
    res.send(result.rows[0]);
  } catch (error) {
    console.error('Error updating video watched status:', error);
    await connection.query('ROLLBACK');
    res.status(500).send({ error: 'Failed to update video watched status. Please try again.' });
  } finally {
    connection.release();
  }
});

// Route to update user information by admin
router.put('/admin/:id', rejectUnauthenticated, upload.single('file'), async (req, res) => {
  const userId = req.params.id;
  const { username, email, phone_number, role, full_name, video_watched } = req.body;

  const queryText = `
    UPDATE "user" 
    SET 
      "username" = $1,
      "email" = $2, 
      "phone_number" = $3,
      "role" = $4,
      "full_name" = $5,
      "video_watched" = $6
    WHERE "id" = $7
    RETURNING "avatar_url";
  `;

  const queryParams = [
    username,
    email,
    phone_number,
    role,
    full_name,
    video_watched,
    userId
  ];

  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");
    const result = await connection.query(queryText, queryParams);

    if (req.file) {
      let avatarUrl;
      if (result.rows[0].avatar_url) {
        avatarUrl = result.rows[0].avatar_url;
      } else {
        avatarUrl = `${crypto.randomBytes(8).toString('hex')}-${req.file.originalname}`;
      }
      await connection.query(`UPDATE "user" SET "avatar_url" = $1 WHERE "id" = $2;`, [avatarUrl, userId]);
      const params = {
        Bucket: bucketName,
        Key: avatarUrl,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const command = new aws.PutObjectCommand(params);
      await s3.send(command);
    }
    res.send(result.rows);
    await connection.query("COMMIT");
  } catch (error) {
    console.error("Error updating user information by admin:", error);
    await connection.query("ROLLBACK");
    res.sendStatus(500);
  } finally {
    connection.release();
  }
});

// Handles login form authenticate/login POST
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user
router.post('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

// Check if username or email already exists
router.post('/check', async (req, res) => {
  const { username, email } = req.body;
  const queryText = 'SELECT username, email FROM "user" WHERE username = $1 OR email = $2';

  try {
    const result = await pool.query(queryText, [username, email]);
    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
      if (existingUser.username === username && existingUser.email === email) {
        res.status(200).json({ exists: true, message: 'Username and email already exist' });
      } else if (existingUser.username === username) {
        res.status(200).json({ exists: true, message: 'Username already exists' });
      } else {
        res.status(200).json({ exists: true, message: 'Email already exists' });
      }
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user existence', error);
    res.sendStatus(500);
  }
});

// Route to update the user's password
router.put('/passwordupdated', async (req, res) => {
  const hashedPassword = await encryptLib.encryptPassword(req.body[0][0])
  const queryParams = [hashedPassword, req.body[0][1]];
  const sqlText = `UPDATE "user" SET "password" = $1 WHERE "email" = $2;`;
  pool.query(sqlText, queryParams)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error(`Error updating password ${sqlText}`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
