// Load the SDK and UUID
const AWS = require('aws-sdk');
// const dotenv = require('dotenv');

const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION
} = process.env;


AWS.config.update({
    accessKeyId : AWS_ACCESS_KEY_ID,
    secretAccessKey : AWS_SECRET_ACCESS_KEY,
    region : AWS_REGION
});

// Create an S3 client
const S3 = new AWS.S3();

console.log('aws setting complete.');

module.exports = {
    S3
};