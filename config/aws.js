// Load the SDK and UUID
const AWS = require('aws-sdk');
// const dotenv = require('dotenv');

AWS.config.update({
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
    region : process.env.AWS_REGION
});

// Create an S3 client
const S3 = new AWS.S3();
// const rekognition = new AWS.Rekognition();

console.log('aws setting complete.');

module.exports = {
    S3
};