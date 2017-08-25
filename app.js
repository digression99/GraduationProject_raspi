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
camera.on('exit', function() {
	camera.stop();
	console.log('camera stopped.');
	fs.readFile(path.join(__dirname, 'images/camera.jpg'), function(err, img) {
		if (err) console.log(err);
		else {
			console.log('in readFile.');
			console.log('git test');
			var imgJson = img.toJSON();
			var date = new Date();
			var nowDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
			console.log('data set');
			//console.log('first base64 : ', new Buffer(img).toString('base64'));
			var imgBase64 = new Buffer(img.toString('base64'));
			images.push(imgBase64);
			console.log('added to images, length : ', images.length);

			base64.encode(path.join(__dirname, 'images/camera.jpg'), {local : true}, function(err, result) {
				if (err) console.log(err);
				else {
					//console.log("base64 : ", result);
					imgBase64 = result;
					console.log('successfully transformed to base64.');
					//console.log(imgBase64);
				}
			});


			//console.log('img base 64 : ', imgBase64);
			
			var formData = {
				img : imgJson,
				date : nowDate
			};
			/*
			request.post({url:'http://pseudocoder.rocks/api/face', formData : formData},
				function(err, httpResponse, body) {
					if (err) console.log(err);
					else {console.log('response : ', body);
					}
			});
			*/

			
			var options = {
				url : 'http://www.pseudocoder.rocks/api/face',
				method : 'POST',
				headers : headers,
				json : true,
				body : formData
			};
			
			console.log('options set');
			request(options, function(err, res, body) {
				console.log('in request');
				if (err) console.log(err);
				else {
					if (res.statusCode === 200) {
						console.log('successfully trasmitted.');
						//console.log(JSON.stringify(body));
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

app.get('/', function(req, res) {
	camera.start();

	var page = `<h1>Images</h1>`;

	for (var i = 0; i < images.length; ++i) {
		page += (`<img src="data:image/jpg;base64,` + images[i] + `" />`);
	}
	console.log(page);
	res.send(page);
	//res.send(`<h1>Hi!</h1>`);

	//res.send('Hello, raspberry pi!, camera started.');
});

app.listen(3000, function(req, res) {
	console.log('server connected on port 3000');
});



