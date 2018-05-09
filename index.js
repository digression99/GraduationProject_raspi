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
// console.log(process.env);

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

let mode = 'button1';
let urlMode = 'face-register';
let uuidTest = '';
let designation = 'user';

let cnt = 0;
let emailArray = [
    "jojo@gmail.com",
    "kimilsik@gmail.com",
    "jojo2@gmail.com",
    "jojo3@gmail.com",
    "test@gmail.com"
];

let selectedEmail = emailArray[cnt];

const changeEmail = () => {
    const maxIdx = emailArray.length;
    cnt = (cnt + 1) % maxIdx;
    // const idx = (cnt + 1) % maxIdx;
    selectedEmail = emailArray[cnt];
};


camera.on('exit', async function () {
    camera.stop();
    console.log('camera exit.');

    // designation = (mode === 'button1') ? 'detected' : 'user';

    try {
        console.log('image transform start.');

        // image read from file.

        // const email = "jojo@gmail.com";
        const img = await pify(fs.readFile)(path.join(__dirname, camera.opts.output));

        console.log('image transformed.');

        // upload data to s3.
        const replaced = selectedEmail.replace(/[@.]/g, '-');
        const key = `${replaced}/${designation}/${uuidTest}.jpg`;
        // const key = urlMode === 'face-register' ? `${replaced}/${designation}/${uuidTest}.jpg` : `${replaced}//${uuidTest}.jpg`;

        const params = {
            Bucket : process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: img,
            ACL : 'public-read',
            // ContentEncoding: 'base64',
            ContentType: 'image/jpg'
        };

        console.log('uploading image : ', uuidTest);

        const data = await pify(S3.putObject.bind(S3))(params);

        console.log('data uploaded.');

        console.log(data);

        // delete the image file from sd card.

        // send s3 object data to server.
        const formData = {
            email : selectedEmail,
            designation,
            uuid : urlMode === 'face-register' ? [uuidTest] : uuidTest
        };

        const options = {
            url : `${process.env.SERVER_URL}/user/${urlMode}`,
            // url : 'http://grad-project-app.herokuapp.com/user/' + urlMode,
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            json : true,
            body : formData
        };

        const requestResult = await pify(request)(options);

        console.log('request succeed.');
        console.log(requestResult);

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
    const button3 = new five.Button('P1-29');
    const button4 = new five.Button('P1-31');

    button1.on('press', function () {

        mode = 'button1';

        console.log('button 1 pressed.');
        uuidTest = uuidv4();
        camera.opts.output = `${process.env.IMAGE_FOLDER_NAME}/${uuidTest}.jpg`;
        // designation = 'user';
        // camera.opts.filename = `${uuidv4()}.jpg`;
        camera.start();
    });

    button2.on('press', function () {

        // mode = 'button2';

        designation = designation === 'user' ? 'detected' : 'user';

        console.log('button 2 pressed.');
        console.log('designation : ', designation);

        // uuidTest = uuidv4();
        // designation = 'friend';
        // camera.opts.output = `${process.env.IMAGE_FOLDER_NAME}/${uuidTest}.jpg`;
        // camera.start();
    });

    button3.on('press', function() {

        urlMode = (urlMode === 'face-register') ? 'face-detect' : 'face-register';

        console.log('button 3 pressed');
        console.log('url mode is :', urlMode);
    });

    button4.on('press', function() {
        changeEmail();

        // urlMode = (urlMode === 'face-register') ? 'face-detect' : 'face-register';
        console.log('button 4 pressed');
        console.log("email : ", selectedEmail);
        // console.log('url mode is :', urlMode);
    });
});