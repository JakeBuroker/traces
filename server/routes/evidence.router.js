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

// const bucketName = process.env.BUCKET_NAME
// const bucketRegion = process.env.BUCKET_REGION
// const accessKey = process.env.ACCESS_KEY
// const secretAccessKey = process.env.SECRET_ACCESS_KEY

// const s3 = new aws.S3Client({
//   credentials: {
//       accessKeyId: accessKey,
//       secretAccessKey: secretAccessKey,
//   },
//   region: bucketRegion,

// })

router.get("/", (req, res) => {
  pool
    .query('SELECT * from "evidence";')
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("Error GET /api/evidence", error);
      res.sendStatus(500);
    });
});



// This post should post to AWS only if there's a file, otherwise it will post to server with 'text' as the media_type.
router.post('/', rejectUnauthenticated, async (req, res) => {
  console.log('Req.file', req.file)
  // const params = {
  //     Bucket: bucketName,
  //     Key: req.file.originalname,
  //     Body: req.file.buffer,
  //     ContentType: req.file.mimetype,
  // }

  // const command = new aws.PutObjectCommand(params)
  // try {
  //     await s3.send(command)

  //     const queryText = `
  //     INSERT INTO "evidence" ("title", "notes", "file_url", "user_id", "media_type")
  //     VALUES ($1, $2, $3, $4, $5);
  //     `
  //     const queryParams = [req.body.title, req.body.notes, req.file.originalname, req.body.user_id, req.file.mimetype]
  //     pool.query(queryText, queryParams)
  //         .then(result => {
  //             res.sendStatus(201)
  //         }).catch(err => {
  //             console.log("Error with Pool:", err);
  //             res.sendStatus(500)
  //         })

  // } catch (error) {
  //     console.log('Here is the error from AWS: ', error);
  //     res.sendStatus(500)
  // }

  const connection = await pool.connect()
  try {
    connection.query("BEGIN")
    const allMediaTypes = await connection.query(`SELECT * FROM "media";`).rows
    console.log(allMediaTypes);
    const queryText = `
         INSERT INTO "evidence" ("title", "notes", "file_url", "user_id", "media_type")
         VALUES ($1, $2, $3, $4, $5);
         `
    const media_type = req.file?.mimetype || 1
    connection.query("COMMIT")
    res.sendStatus(201)
  } catch (error) {
    console.log(error);
  } finally {
    connection.release()
  }
});

module.exports = router