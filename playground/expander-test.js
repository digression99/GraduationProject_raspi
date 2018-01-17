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
    // let led1 = new five.Led('P1-19');

    let virtual = new five.Board.Virtual(
        new five.Expander("MCP23008")
    );
    let led1 = new five.Led({
        board: virtual,
        pin: 0,
    });

    led1.on();


    // let virtual = new five.Board.Virtual({
    //         controller: "MCP23008"
    //         // address: 0x??
    //     });


    // this.repl.inject({
    //     button1,
    //     led1
    // });
    //
    // button1.on('down', () => {
    //     console.log('button down!');
    //     led1.on();
    // });
    // button1.on('hold', () => {
    //     console.log('button hold!');
    // });
    // button1.on('up', () => {
    //     console.log('button up!');
    //     led1.off();
    // });

});