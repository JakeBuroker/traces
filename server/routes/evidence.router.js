const express = require("express");
const router = express.Router();
const pool = require("../modules/pool");
const { rejectUnauthenticated } = require('../modules/authentication-middleware')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const dotenv = require('dotenv')
dotenv.config()
const crypto = require('crypto')

const awsGet = require('../modules/get.evidence')

// ! Set up for AWS
const aws = require('@aws-sdk/client-s3')
const signer = require('@aws-sdk/s3-request-presigner');

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
    .query(`
    SELECT 
    "evidence".id,
    "evidence"."location",
    "evidence".title,
    "evidence".notes,
    "evidence".aws_key,
    "evidence".date_posted,
    "evidence".media_type,
    "user".username
    FROM "evidence"
    JOIN "user" ON "evidence".user_id = "user".id
    WHERE "evidence".is_public = true;
    `)
    .then(async (result) => {
      const awsGetResult = await awsGet.awsGetURLs(result)
      res.send(awsGetResult)
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
      const awsGetResult = await awsGet.awsGetURLs(result)
      res.send(awsGetResult)
    }).catch(err => {
      console.log(err);
      res.sendStatus(500)
    })
})

// GET route for the admin
router.get('/admin', rejectUnauthenticated, (req, res) => {
  if (req.user.role === 2) { // checking for admin status
    const queryText = `
    SELECT 
    "evidence".id,
    "evidence"."location",
    "evidence".title,
    "evidence".notes,
    "evidence".aws_key,
    "evidence".date_posted,
    "evidence".is_public,
    "evidence".media_type,
    "user".full_name
    FROM "evidence"
    JOIN "user" ON "evidence".user_id = "user".id;
    `
    pool.query(queryText)
      .then(async result => {
        const awsGetResult = await awsGet.awsGetURLs(result)
        res.send(awsGetResult)
      }).catch(err => {
        console.log(err);
        res.sendStatus(500)
      })
  } else {
    res.sendStatus(403)
  }
})

// This post should post to AWS only if there's a file, otherwise it will post to server with 'text' as the media_type.
// This POST is expecting in a Form Data:
//    title
//    notes
//    file (optional)
//    Sends 201 'Create' if successful
router.post('/', rejectUnauthenticated, upload.single('file'), async (req, res) => {
  console.log('Req.file', req.file, 'Req.body:', req.body)

  const connection = await pool.connect()
  try {
    connection.query("BEGIN")
    const queryText = `
         INSERT INTO "evidence" ("title", "notes", "aws_key", "user_id", "media_type")
         VALUES ($1, $2, $3, $4, $5);
         `

    // Determines what the media_type is.
    let mediaType
    let awsReference
    if (req.file) {
      mediaType = await checkMediaType(req.file.mimetype)
      awsReference = `${crypto.randomBytes(8).toString('hex')}-${req.file.originalname}`
    } else {
      mediaType = 1
      awsReference = req.body.title
    }

    await connection.query(queryText, [req.body.title, req.body.notes, awsReference, req.user.id, mediaType])

    // Uploads to AWS if there is a file.
    if (req.file) {
      const params = {
        Bucket: bucketName,
        Key: awsReference,
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


// Updates all the user information.
// This PUT is expecting in a Data Form: 
//    email,
//    phone_number
//    alias (can be undefined)
//    waiver_acknowledged (must be true or false)
//    file (optional)
router.put('/user', rejectUnauthenticated, upload.single('file'), async (req, res) => {
  const queryText = `
  UPDATE "user" 
  SET 
  "email" = $1, 
  "phone_number" = $2,
  "alias" = $3
  WHERE "id" = $4
  RETURNING "avatar_url";
  `
  const queryParams = [
    req.body.email,
    req.body.phone_number,
    req.body.alias,
    req.user.id
  ]
  const connection = await pool.connect()
  try {
    await connection.query("BEGIN")
    const result = await connection.query(queryText, queryParams)
    console.log(result.rows);

    if (req.file) {
      let avatarUrl
      if (result.rows[0].avatar_url) {
        avatarUrl = result.rows[0].avatar_url
      } else {
        avatarUrl = req.file.originalname
      }
      // ? Seems to not replace the old avatar image, but adds another.
      await connection.query(`UPDATE "user" SET "avatar_url" = $1 WHERE "id" = $2;`, [avatarUrl, req.user.id])
      const params = {
        Bucket: bucketName,
        Key: avatarUrl,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }
      const command = new aws.PutObjectCommand(params)
      await s3.send(command)
    }
    res.send(result.rows)
    connection.query("COMMIT")

  } catch (error) {
    console.log(error);
    connection.query("ROLLBACK")
  } finally {
    connection.release()
  }
})

// Updates to change all is_public to true.
router.put('/makeAllPublic', rejectUnauthenticated, async (req, res) => {
  if (req.user.role === 2) {
    const queryText = `
    UPDATE "evidence" SET "is_public" = true;
    `
    await pool.query(queryText)
      .catch(err => {
        console.log(err)
        req.sendStatus(500)
      })
    res.sendStatus(201)
  } else {
    res.sendStatus(403)
  }
})

// Updates to change all is_public to false.
router.put('/makeAllSecret', rejectUnauthenticated, async (req, res) => {
  if (req.user.role === 2) {
    const queryText = `
    UPDATE "evidence" SET "is_public" = false;
    `
    await pool.query(queryText)
      .catch(err => {
        console.log(err)
        req.sendStatus(500)
      })
    res.sendStatus(201)
  } else {
    res.sendStatus(403)
  }
})

// Update to change to toggle the specific is_public of an evidence.
router.put('/clearance/:id', rejectUnauthenticated, async (req, res) => {
  if (req.user.role === 2) {
    const connection = await pool.connect()
    try {
      connection.query("BEGIN")
      const result = await connection.query(`SELECT "user_id", "is_public" FROM "evidence" WHERE "id" = $1;`, [req.params.id])
      const toggle = !result.rows[0].is_public
      const queryText = `
      UPDATE "evidence" SET "is_public" = $1 WHERE "id" = $2;
      `
      await connection.query(queryText, [toggle, req.params.id])
      await connection.query("COMMIT")
      res.send(result.rows)

    } catch (error) {
      await connection.query("ROLLBACK")
      console.log(error);
      res.sendStatus(500)
    } finally {
      connection.release()
    }
  } else {
    res.sendStatus(403)
  }
})

// Updates Evidence For Users
// This PUT requires in a Form Data:
//    title
//    notes
//    file (optional)
router.put('/update/:id', rejectUnauthenticated, upload.single('file'), async (req, res) => {
  const connection = await pool.connect()
  try {
    await connection.query("BEGIN")
    let result = await connection.query(`SELECT "user_id" FROM "evidence" WHERE "id" = $1`, [req.params.id])
    if (result.rows[0].user_id === req.user.id || req.user.role === 2) {
      const queryText = `
        UPDATE "evidence" 
        SET 
        "title" = $1, 
        "notes" = $2
        WHERE "id" = $3
        RETURNING "aws_key";
    `
      const queryParams = [
        req.body.title,
        req.body.notes,
        req.params.id
      ]
      result = await connection.query(queryText, queryParams)

      console.log(req.file, req.body);
      if (req.file) {
        console.log('in req.file');
        const mediaType = await checkMediaType(req.file.mimetype)
        await connection.query(`UPDATE "evidence" SET "media_type" = $1;`, [mediaType])
        let awsKey = result.rows[0].aws_key
        const params = {
          Bucket: bucketName,
          Key: awsKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        }
        const command = new aws.PutObjectCommand(params)
        await s3.send(command)
      }
      res.send(result.rows)
      connection.query("COMMIT")

    } else {
      res.sendStatus(403)
    }
  } catch (error) {
    console.log(error);
    connection.query("ROLLBACK")
  } finally {
    connection.release()
  }
})

// Deletes an entry for an admin or a user.
router.delete('/delete/:id', rejectUnauthenticated, async (req, res) => {
  // Check that user is either an admin or the user who created it
  const connection = await pool.connect()
  try {
    await connection.query("BEGIN")
    const result = await connection.query(`SELECT "user_id", "aws_key", "media_type" FROM "evidence" WHERE "id" = $1;`, [req.params.id])
    if (result.rows[0].user_id === req.user.id || req.user.role === 2) {
      await connection.query(`DELETE FROM "evidence" WHERE "id" = $1`, [req.params.id])

      // Checking to make sure the media isn't just text. 
      if (result.rows[0].media_type !== 1) {
        const command = new aws.DeleteObjectCommand({
          Bucket: bucketName,
          Key: result.rows[0].aws_key,
        })
        await s3.send(command)
      }

      res.sendStatus(201)
    } else {
      res.sendStatus(403)
    }

    await connection.query("COMMIT")
  } catch (error) {
    console.log(error);
    connection.query("ROLLBACK")
    res.sendStatus(500)
  } finally {
    connection.release()
  }
})


// Utility function
const checkMediaType = async (mimetype) => {
  const result = await pool.query(`SELECT * FROM "media";`)
  const allMediaTypes = result.rows
  for (let type of allMediaTypes) {
    if (mimetype.includes(type.type)) {
      console.log(type.id);
      return type.id
    }
  }
}

module.exports = router