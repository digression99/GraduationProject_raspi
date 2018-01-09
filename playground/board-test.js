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
    let   // "down" the button is pressed
        button.on("down", function() {
        console.log("down");
    });

    // "hold" the button is pressed for specified time.
    //        defaults to 500ms (1/2 second)
    //        set
    button.on("hold", function() {
        console.log("hold");
    });

    // "up" the button is released
    button.on("up", function() {
        console.log("up");
    });button = new five.Button('P-13');

    this.repl.inject({
        onLed1 : function() {
            digitalLed1.on();
        },
        onLed2 : function() {
            digitalLed2.on();
        },
        offLed1 : function() {
            digitalLed1.off();
        },
        offLed2 : function() {
            digitalLed2.off();
        },
        button : button
    });

    // "down" the button is pressed
    button.on("down", function() {
        console.log("down");
    });

    // "hold" the button is pressed for specified time.
    //        defaults to 500ms (1/2 second)
    //        set
    button.on("hold", function() {
        console.log("hold");
    });

    // "up" the button is released
    button.on("up", function() {
        console.log("up");
    });

    // digitalLed1.strobe();
    // digitalLed2.strobe();
    // digitalLed1.blink();
    // digitalLed2.blink();

    // (new five.Led('P1-7').Led('P1-8')).strobe();
});