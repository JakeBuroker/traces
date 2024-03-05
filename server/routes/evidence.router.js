const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
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

// Gets all evidence that is public.
router.get("/public", (req, res) => {
  pool
    .query('SELECT * from "evidence" WHERE "is_public" = true;')
    .then(async (result) => {
      for (e of result.rows) {
        if (e.media_type !== 1) { // If the media_type isn't text, then...
          const command = new aws.GetObjectCommand({
            Bucket: bucketName,
            Key: e.aws_key,
          })
          const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 })
          e.aws_url = url
        }
        // TODO : Add an else case to get a generic text image for when media type is text
      }
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("Error GET /api/evidence", error);
      res.sendStatus(500);
    });
});

// Gets all evidence for logged-in user.
router.get('/', rejectUnauthenticated, (req, res) => {
  const queryText = `
  SELECT * FROM "evidence" WHERE "user_id" = $1;
  `
  pool.query(queryText, [req.user.id])
    .then(async result => {
      for (let e of result.rows) {
        if (e.media_type !== 1) { // If the media_type isn't text, then...
          const command = new aws.GetObjectCommand({
            Bucket: bucketName,
            Key: e.aws_key,
          })
          const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 })
          e.aws_url = url
        }
        // TODO : Add an else case to get a generic text image for when media type is text
      }
      res.send(result.rows)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
})

// GET route for the admin
router.get('/admin', rejectUnauthenticated, (req, res) => {
  if (req.user.role === 2) { // checking for admin status
    const queryText = `
    SELECT * FROM "evidence";
    `
    pool.query(queryText)
      .then(async result => {
        for (let e of result.rows) {
          if (e.media_type !== 1) { // If the media_type isn't text, then...
            const command = new aws.GetObjectCommand({
              Bucket: bucketName,
              Key: e.aws_key,
            })
            const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 })
            e.aws_url = url
          }
          // TODO : Add an else case to get a generic text image for when media type is text
        }
        res.send(result.rows)
      }).catch(err => {
        console.log(err);
        res.sendStatus(500)
      })
  } else {
    res.sendStatus(403)
  }
})

// This post should post to AWS only if there's a file, otherwise it will post to server with 'text' as the media_type.
router.post('/', rejectUnauthenticated, upload.single('file'), async (req, res) => {
  console.log('Req.file', req.file, 'Req.body:', req.body)

  const connection = await pool.connect()
  try {
    connection.query("BEGIN")
    const result = await connection.query(`SELECT * FROM "media";`)
    const allMediaTypes = result.rows
    const queryText = `
         INSERT INTO "evidence" ("title", "notes", "aws_key", "user_id", "media_type")
         VALUES ($1, $2, $3, $4, $5);
         `

    // Determines what the media_type is.
    let mediaType
    let awsReference
    if (req.file) {
      mediaType = checkMediaType(req.file.mimetype, allMediaTypes)
      awsReference = req.file.originalname
    } else {
      mediaType = 1
      awsReference = req.body.title
    }

    await connection.query(queryText, [req.body.title, req.body.notes, awsReference, req.user.id, mediaType])

    // Uploads to AWS if there is a file.
    if (req.file) {
      const params = {
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }
      const command = new aws.PutObjectCommand(params)
      await s3.send(command)
    }

    await connection.query("COMMIT")
    res.sendStatus(201)
  } catch (error) {
    console.log(error);
    await connection.query("ROLLBACK")
  } finally {
    connection.release()
  }
});

// router.put('/user', rejectUnauthenticated, upload.single('file'), async (req, res) => {
//   const queryText = `
//   UPDATE "user" 
//   SET 
//   "email" = $1, 
//   "phone_number" = $2,
//   "alias" = $3,
//   "waiver_acknowledged" = $4
//   WHERE "id" = $5;
//   `
//   const queryParams = [
//     req.body.email, 
//     req.body.phone_number,
//     req.body.alias,
//     req.body.waiver_acknowledged,
//     req.user.id
//   ]
//   const connection = await pool.connect()
//   try {
//     await connection.query(queryText, queryParams)

//     // TODO: I need to check if there is already an image saved for this user, and get avatar_url, or set it if it's null.
//     if(req.file) {
//       await connection.query(`UPDATE "user" SET "avatar_url" = $1 WHERE "id" = $2;`, [req.file.originalname, req.user.id])
//     }
    
//   } catch (error) {
//     console.log(error);
//     connection.query("ROLLBACK")
//   }
// })

const checkMediaType = (mimetype, allMediaTypes) => {
  for (let type of allMediaTypes) {
    if (mimetype.includes(type.type)) {
      console.log(type.id);
      return type.id
    }
  }
}

module.exports = router