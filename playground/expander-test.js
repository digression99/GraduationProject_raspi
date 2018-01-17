let Raspi = require('raspi-io');
const five = require('johnny-five');

const board = new five.Board({
    io : new Raspi()
});

board.on('exit', function() {
    console.log('exit!');
});

board.on('ready', function() {
    console.log('board is ready!');
    // let button1 = new five.Button('P1-13');
    // let led1 = new five.Led('P1-19');

    let expander = new five.Expander("MCP23008");

    let virtual = new five.Board.Virtual(
        expander
    );
    let led1 = new five.Led({
        board: virtual,
        pin: 0,
    });

    expander.analogRead(0, (value) => {
        console.log('analog input : ', value);
    });

    led1.on();
});