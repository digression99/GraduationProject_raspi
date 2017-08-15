const express = require('express');
var Raspi = require('raspi-io');
const five = require('johnny-five');
const gpio = require('raspi-gpio');

const board = new five.Board({
	io : new Raspi()
});

board.on('ready', function() {
	(new five.Led('P1-7')).strobe();
});

const app = express();

app.get('/', function(req, res) {
	res.send('Hello, raspberry pi!');
});

app.listen(3000, function(req, res) {
	console.log('server connected on port 3000');
});



