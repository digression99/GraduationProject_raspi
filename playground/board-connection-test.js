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
    let button1 = new five.Button('P1-13');

    this.repl.inject({
        button1
    });

    button1.on('down', () => {
        console.log('button down!');
    });
    button1.on('hold', () => {
        console.log('button hold!');
    });
    button1.on('up', () => {
        console.log('button up!');
    });
});