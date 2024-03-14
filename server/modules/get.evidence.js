const dotenv = require('dotenv')
dotenv.config()

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

const awsGetURLs = async (result) => {
  for (let e of result.rows) {
    console.log(e.media_type);
    if (e.media_type !== 1) { // If the media_type isn't text, then...
      const command = new aws.GetObjectCommand({
        Bucket: bucketName,
        Key: e.aws_key,
      })
      const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 })
      console.log('url:', url);
      e.aws_url = url
    }
    // TODO : Add an else case to get a generic text image for when media type is text
  }
  console.log(result.rows);
  return result.rows
}

const awsGetAvatarULRs = async (result) => {
  console.log('RESULT:', result);
  for (let j of result) {
    // console.log(e.media_type);
    if (j.avatar_url) {
      const command = new aws.GetObjectCommand({
        Bucket: bucketName,
        Key: j.avatar_url, // this is the key for the avatar saved in the DB
      })
      const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 })
      console.log('url:', url);
      j.avatar_AWS_URL = url
    }
  }
  // console.log(result);
  return result
}

module.exports = { awsGetURLs, awsGetAvatarULRs }

