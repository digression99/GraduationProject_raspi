let Raspi = require('raspi-io');
const five = require('johnny-five');

// board setting.
const board = new five.Board({
    io : new Raspi()
});

board.on('ready', function() {
    console.log('board is ready!');

    let digitalLed1 = new five.Led('P1-7');
    let digitalLed2 = new five.Led('P1-11');

    digitalLed1.strobe();
    digitalLed2.strobe();

    // (new five.Led('P1-7').Led('P1-8')).strobe();
});