require("dotenv").config({ path: ".env" });
const AWS = require("aws-sdk");

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

async function awsUploadImage(file, fiePath) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${fiePath}`,
    Body: file,
  };

  try {
    const response = await s3.upload(params).promise();
    return response;
  } catch (error) {
    throw new Error();
  }
}

module.exports = awsUploadImage;
