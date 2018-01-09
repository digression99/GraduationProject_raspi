let Raspi = require('raspi-io');
const five = require('johnny-five');

// board setting.
const board = new five.Board({
    io : new Raspi()
});

board.on('event-start', function(data) {
    console.log('event-start!');
    console.log(data.name);
});



board.on('ready', function() {
    console.log('board is ready!');

    let digitalLed1 = new five.Led('P1-7');
    let digitalLed2 = new five.Led('P1-11');
    let button = new five.Button('P1-13');

    this.repl.inject({
        onLed1 : function() {
            digitalLed1.on();
            console.log('led 1 on');
        },
        onLed2 : function() {
            digitalLed2.on();
            console.log('led 2 on');
        },
        offLed1 : function() {
            digitalLed1.off();
            console.log('led 1 off');
        },
        offLed2 : function() {
            digitalLed2.off();
            console.log('led 2 off');
        },
        button : button
    });

    // "down" the button is pressed
    button.on("down", function() {
        console.log("down");
        board.emit('event-start', {
            name : "kim"
        });
        digitalLed1.toggle();
        digitalLed2.toggle();
    });

    // "hold" the button is pressed for specified time.
    //        defaults to 500ms (1/2 second)
    //        set
    button.on("hold", function() {
        // console.log("hold");
    });

    // "up" the button is released
    button.on("up", function() {
        // console.log("up");
    });

    // digitalLed1.strobe();
    // digitalLed2.strobe();
    // digitalLed1.blink();
    // digitalLed2.blink();

    // (new five.Led('P1-7').Led('P1-8')).strobe();
});