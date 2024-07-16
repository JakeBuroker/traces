const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();
const dotenv = require('dotenv')
dotenv.config()

// ! Set up for AWS
const aws = require('@aws-sdk/client-s3')
const signer = require('@aws-sdk/s3-request-presigner')

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new aws.S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,

})

// Route for admin to get all users
router.get('/users', rejectUnauthenticated, async (req, res) => {
  const queryText = 'SELECT id, username, email, full_name, phone_number, avatar_url FROM "user"';
  try {
    const result = await pool.query(queryText);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.sendStatus(500);
  }
});

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, async (req, res) => {
  // Send back user object from the session (previously queried from the database)
  if (req.user.avatar_url) {
    const command = new aws.GetObjectCommand({
      Bucket: bucketName,
      Key: req.user.avatar_url,
    })
    const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 })
    req.user.avatar_AWS_URL = url
  }
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  // Corrected the quotes around the table name `user`
  const queryText = 'INSERT INTO "user" (username, password, email, phone_number, role, full_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
  pool
  // TODO : GAVIN: Change the params for what we actually need in register page.
    .query(queryText, [username, password, req.body.email, req.body.phone_number, req.body.role, req.body.full_name])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed:', err);
      res.sendStatus(500);
    });
});

router.put('/watched/:id', rejectUnauthenticated, async (req, res) => {
  const queryText = `
    UPDATE "user"
    SET "video_watched" = true
    WHERE "id" = $1;
  `;
  const queryParams = [req.user.id]; // Assuming req.user.id holds the authenticated user's ID

  const connection = await pool.connect();

  try {
    await connection.query("BEGIN");
    const result = await connection.query(queryText, queryParams);

    // Optional: Check if the update was successful, i.e., if any row was actually updated
    if (result.rowCount === 0) {
      // No row updated, possibly because the user ID was not found
      throw new Error('User not found or waiver already acknowledged.');
    }

    await connection.query("COMMIT");
    res.send(result.rows[0]); // Send back the updated user info, for example
  } catch (error) {
    console.error('Error acknowledging waiver:', error);
    await connection.query("ROLLBACK");
    res.status(500).send({ error: "Failed to acknowledge waiver. Please try again." });
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

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
