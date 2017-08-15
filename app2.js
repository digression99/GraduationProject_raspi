var RaspiCam = require('raspicam');

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

camera.start();

camera.on('exit', function() {
	camera.stop();
	console.log('camera stopped.');
});


