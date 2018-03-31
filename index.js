const Raspi = require('raspi-io');
const five = require('johnny-five');
const gpio = require('raspi-gpio');
const RaspiCam = require('raspicam');
const request = require('request');
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const dotenv = require('dotenv');
const uuidv4 = require('uuid/v4');

// load the environment.
dotenv.load({path : '.env.development'});
console.log('environment set!');
console.log(process.env);

const {S3} = require('./config/aws');

const opts = {
    width : 640,
    height : 480,
    mode : 'photo',
    awb : 'off',
    encoding : 'jpg',
    // output : `${process.env.IMAGE_FOLDER_NAME}/%04d.jpg`,
    output : `${process.env.IMAGE_FOLDER_NAME}/${uuidv4()}.jpg`,
    q : 50, // quality
    timeout : 1000, // total shot time.
    // timelapse : 1000, // time between every shots.
    nopreview : true,
    // th : '0:0:0'
};

const camera = new RaspiCam(opts);
console.log(camera);

let uuidTest;

camera.on('exit', async function () {
    camera.stop();
    console.log('camera exit.');

    try {

        const email = "raspicam-upload@gmail.com";
        const designation = "user";
        const img = await fs.readFile(camera.opts.output);
        const imgBase64 = img.toString('base64');
        // const decoded = new Buffer(imgBase64, 'base64').toString('ascii');

        const params = {
            Bucket : process.env.AWS_BUCKET_NAME,
            Key: `${email}/${designation}/${uuidTest}.jpg`,
            Body: imgBase64,
            ACL : 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'image/jpg'
        };
        // return pify()

        await S3.putObject(params);

        console.log('data uploaded.');
        // S3.putObject(params, function(err, data){
        //     if (err) {
        //         console.log(err);
        //         console.log('Error uploading data: ', data);
        //     } else {
        //         console.log('succesfully uploaded the image!');
        //     }
        // });

    } catch (e) {
        console.log('error occured.');
        console.log(e);
    }
});

// board setting.
const board = new five.Board({
    io : new Raspi()
});

board.on('ready', function() {
    console.log('board is ready!');
    (new five.Led('P1-7')).strobe();

    const button1 = new five.Button('P1-11');
    const button2 = new five.Button('P1-13');

    button1.on('press', function () {
        console.log('button 1 pressed.');
        uuidTest = uuidv4();
        camera.opts.output = `${process.env.IMAGE_FOLDER_NAME}/${uuidTest}.jpg`;
        // camera.opts.filename = `${uuidv4()}.jpg`;
        camera.start();
    });

    button2.on('press', function () {
        console.log('button 2 pressed.');
    });
});