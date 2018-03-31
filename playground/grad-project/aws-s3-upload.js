const path = require('path');
const dotenv = require('dotenv');
const pify = require('pify');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

// environment setting
dotenv.load({path: path.join(__dirname, '../../.env.development')});

const {S3} = require('../../config/aws');

// const params = {
//     'Bucket': process.env.AWS_BUCKET_NAME,
//     'Key':'animals.jpg',
//     'ACL':'public-read',
//     'Body':fs.createReadStream('upload-image.jpg'),
//     'ContentType':'image/jpg'
// };
//
// pify(S3.upload.bind(S3))(params)
//     .then(data => {
//         console.log('upload complete.');
//         console.log(data);
//     })
//     .catch(err => console.log(err));

(async () => {
    const email = "gg@gmail.com";
    const designation = "user";
    // const img = fs.readFileSync(path.join(__dirname, 'upload-image.jpg'));
    // const imgBase64 = img.toString('base64');
    // const decoded = new Buffer(imgBase64, 'base64').toString('ascii');

    const params = {
        Bucket : process.env.AWS_BUCKET_NAME,
        Key: `raspi-upload.txt`,
        Body: "hello!",
        ACL : 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/jpg'
    };
    // return pify()

    S3.putObject(params, function(err, data){
        if (err) {
            console.log(err);
            console.log('Error uploading data: ', data);
        } else {
            console.log('succesfully uploaded the image!');
        }
    });
})();
