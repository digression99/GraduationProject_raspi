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

// camera
const opts = {
    width : 640,
    height : 480,
    mode : 'timelapse',
    awb : 'off',
    encoding : 'jpg',
    output : `${process.env.IMAGE_FOLDER_NAME}/${uuidv4()}.jpg`,
    q : 50, // quality
    timeout : 8000, // total shot time.
    timelapse : 400, // time between every shots.
    // nopreview : true,
    // th : '0:0:0'
};

const camera = new RaspiCam(opts);

camera.on('exit', function () {
    camera.stop();
    console.log('camera exit.');
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
    });

    button2.on('press', function () {
        console.log('button 2 pressed.');
    });
});