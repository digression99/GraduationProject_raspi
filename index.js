const Raspi = require('raspi-io');
const five = require('johnny-five');
// const gpio = require('raspi-gpio');
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

const {
    DEVICE_ID,
    IMAGE_FOLDER_NAME,
    SERVER_URL,
    AWS_BUCKET_NAME
} = process.env;

const {S3} = require('./config/aws');

const opts = {
    width : 640,
    height : 480,
    mode : 'photo',
    awb : 'off',
    encoding : 'jpg',
    output : `${IMAGE_FOLDER_NAME}/${uuidv4()}.jpg`,
    q : 50, // quality
    timeout : 1000, // total shot time.
    // timelapse : 1000, // time between every shots.
    nopreview : true,
    // th : '0:0:0'
};

const camera = new RaspiCam(opts);
console.log(camera);

// let mode = 'button1';
// let urlMode = 'face-register';
let uuid = '';
let selectedEmail = "";

camera.on('exit', async function () {
    camera.stop();
    console.log('camera exit.');

    // designation = (mode === 'button1') ? 'detected' : 'user';

    try {
        const img = await pify(fs.readFile)(path.join(__dirname, camera.opts.output));

        console.log('image loaded.');

        // upload data to s3.
        const replaced = selectedEmail.replace(/[@.]/g, '-');
        const key = `${replaced}/detected/${uuid}.jpg`;

        const params = {
            Bucket : AWS_BUCKET_NAME,
            Key: key,
            Body: img,
            ACL : 'public-read',
            ContentType: 'image/jpg'
        };

        console.log('uploading image : ', uuid);

        await pify(S3.putObject.bind(S3))(params);

        console.log('data uploaded.');

        const formData = {
            email : selectedEmail,
            designation : 'detected',
            uuid
        };

        const options = {
            url : `${SERVER_URL}/device/face-detect`,
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            json : true,
            body : formData
        };

        const requestResult = await pify(request)(options);

        console.log('request succeed.');
        console.log(requestResult.body);
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
    // (new five.Led('P1-7')).strobe();

    const button1 = new five.Button('P1-11');
    // const button2 = new five.Button('P1-13');
    // const button3 = new five.Button('P1-29');
    // const button4 = new five.Button('P1-31');

    button1.on('press', async function () {
        console.log('button 1 pressed.');

        const options = {
            url : `${SERVER_URL}/device/get-user-email`,
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            json : true,
            body : {
                id : DEVICE_ID
            }
        };

        const res = await pify(request)(options);
        // console.log('res is :');
        // console.log(JSON.stringify(res, undefined, 2));

        selectedEmail = res.body.email;

        if (!selectedEmail) {
            console.log('device not registered.');
            return;
        }
        console.log('selected email : ', selectedEmail);

        uuid = uuidv4();
        camera.opts.output = `${IMAGE_FOLDER_NAME}/${uuid}.jpg`;
        camera.start();
    });

    // button2.on('press', function () {
    //
    //     // mode = 'button2';
    //
    //     // designation = designation === 'user' ? 'detected' : 'user';
    //
    //     console.log('button 2 pressed.');
    //     // console.log('designation : ', designation);
    //
    //     // uuidTest = uuidv4();
    //     // designation = 'friend';
    //     // camera.opts.output = `${process.env.IMAGE_FOLDER_NAME}/${uuidTest}.jpg`;
    //     // camera.start();
    // });
    //
    // button3.on('press', function() {
    //
    //     // urlMode = (urlMode === 'face-register') ? 'face-detect' : 'face-register';
    //     // designation = (urlMode === 'face-register') ? 'user' : 'detected';
    //
    //     console.log('button 3 pressed');
    //     // console.log('url mode is :', urlMode);
    // });
    //
    // button4.on('press', function() {
    //     // changeEmail();
    //
    //     // urlMode = (urlMode === 'face-register') ? 'face-detect' : 'face-register';
    //     console.log('button 4 pressed');
    //     // console.log("email : ", selectedEmail);
    //     // console.log('url mode is :', urlMode);
    // });
});