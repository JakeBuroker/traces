const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// ! Set up for AWS
const aws = require('@aws-sdk/client-s3');
const signer = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Route to get all users (admin only)
router.get('/users', rejectUnauthenticated, async (req, res) => {
  if (req.user.role === 2) {
    const queryText = 'SELECT id, username, email, full_name, role, phone_number, avatar_url, video_watched FROM "user"';
    try {
      const result = await pool.query(queryText);
      const users = result.rows;

      // Generate signed URLs for avatars
      for (let user of users) {
        if (user.avatar_url) {
          const command = new aws.GetObjectCommand({
            Bucket: bucketName,
            Key: user.avatar_url,
          });
          const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 });
          user.avatar_AWS_URL = url;
        }
      }

      res.json(users);
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

      // Generate signed URLs for evidence
      const evidenceList = result.rows;
      for (let evidence of evidenceList) {
        if (evidence.aws_key) {
          const command = new aws.GetObjectCommand({
            Bucket: bucketName,
            Key: evidence.aws_key,
          });
          const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 });
          evidence.aws_url = url;
        }
      }

      res.json(evidenceList);
    } catch (error) {
      console.error('Error fetching user evidence:', error);
      res.sendStatus(500);
    }
  }
});

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, async (req, res) => {
  // Send back user object from the session (previously queried from the database)
  if (req.user.avatar_url) {
    const command = new aws.GetObjectCommand({
      Bucket: bucketName,
      Key: req.user.avatar_url,
    });
    const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 });
    req.user.avatar_AWS_URL = url;
  }
  res.send(req.user);
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

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const queryText = 'INSERT INTO "user" (username, password, email, phone_number, role, full_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
  pool
    .query(queryText, [username, password, req.body.email, req.body.phone_number, req.body.role, req.body.full_name])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed:', err);
      res.sendStatus(500);
    });
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
  const { username, email, phone_number, role, full_name, alias, video_watched } = req.body;

  const queryText = `
    UPDATE "user" 
    SET 
      "username" = $1,
      "email" = $2, 
      "phone_number" = $3,
      "role" = $4,
      "full_name" = $5,
      "alias" = $6,
      "video_watched" = $7
    WHERE "id" = $8
    RETURNING "avatar_url";
  `;

  const queryParams = [
    username,
    email,
    phone_number,
    role,
    full_name,
    alias,
    video_watched,
    userId
  ];

  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");
    const result = await connection.query(queryText, queryParams);
    console.log(result.rows);

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
    console.log(error);
    await connection.query("ROLLBACK");
    res.sendStatus(500);
  } finally {
    connection.release();
  }
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
