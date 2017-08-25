//
// * This code must be written in ES5.
//
//
//
//
//
//
//
//

const express = require('express');
var Raspi = require('raspi-io');
const five = require('johnny-five');
const gpio = require('raspi-gpio');
var RaspiCam = require('raspicam');
var request = require('request');
var fs = require('fs');
var path = require('path');
var base64 = require('node-base64-image');

const app = express();

var headers = {
	'Content-Type' : 'application/json'
};

var images = [];
var results = [];

var opts = {
	width : 600,
	height : 420,
	mode : 'timelapse',
	awb : 'off',
	encoding : 'jpg',
	output : 'images/camera.jpg',
	q : 50,
	timeout : 1000,
	timelapse : 0,
	nopreview : true,
	th : '0:0:0'
};

var camera = new RaspiCam(opts);

// camera event handler.
// Can I put all kinds of event to camera?
camera.on('exit', function() {
	camera.stop();
	console.log('camera stopped.');
	fs.readFile(path.join(__dirname, 'images/camera.jpg'), function(err, img) {
		if (err) console.log(err);
		else {
            // date info generate.
			var date = new Date();
			var nowDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();

			// image encoded to base64.
			var imgBase64 = new Buffer(img).toString('base64');

			// add the almost 100 images if it has the correct faces.
			images.push(imgBase64);
			console.log('added to images, length : ', images.length);

			var formData = {
				img : imgBase64,
				date : nowDate
			};
			var options = {
				url : 'http://www.pseudocoder.rocks/api/face',
				method : 'POST',
				headers : headers,
				json : true,
				body : formData
			};

			request(options, function(err, res, body) {
				console.log('in request');
				if (err) console.log(err);
				else {
					if (res.statusCode === 200) {
						console.log('successfully trasmitted.');

						results.push(body.result);
					} else {
						console.log('something wrong.', res.statusCode);
					}
				}
			});
		}
	});
});

// board setting.
const board = new five.Board({
	io : new Raspi()
});

board.on('ready', function() {
	console.log('board is ready!');
	(new five.Led('P1-7')).strobe();
});

app.get('/camera')

app.get('/camera-on', function(req, res) {
	camera.start();

	// var page = `<h1>Images</h1>`;
    //
	// for (var i = 0; i < images.length; ++i) {
	// 	page += (`<img src="data:image/jpg;base64,` + images[i] + `" />`);
	// }
	// console.log(page);

    res.send(results);
	//res.send(page);
});

app.listen(3000, function(req, res) {
	console.log('server connected on port 3000');
});



