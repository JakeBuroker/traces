const dotenv = require('dotenv');
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
    if (e.media_type !== 1) { // If the media_type isn't text, then...
      const command = new aws.GetObjectCommand({
        Bucket: bucketName,
        Key: e.aws_key,
      });
      const url = await signer.getSignedUrl(s3, command, { expiresIn: 3600 });
      e.aws_url = url;
    }
    // TODO: Add an else case to get a generic text image for when media type is text
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

module.exports = { awsGetURLs, awsGetAvatarULRs, awsGetVerificationPhotoURLs };
