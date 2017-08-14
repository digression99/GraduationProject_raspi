const express = require('express');

const app = express();

app.get('/', function(req, res) {
	res.send('Hello, raspberry pi!');
});

app.listen(3000, function(req, res) {
	console.log('server connected on port 3000');
});



