let Raspi = require('raspi-io');
const five = require('johnny-five');

// board setting.
const board = new five.Board({
    io : new Raspi()
});

board.on('ready', function() {
    console.log('board is ready!');
    (new five.Led('P1-7').Led('P1-8')).strobe();
});