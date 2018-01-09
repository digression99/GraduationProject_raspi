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
    let switchButton = new five.Switch('P1-15');
    let button2 = new five.Button('P1-16');
    let motion = new five.Motion('P1-12');

    switchButton.isOpened = false;

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
        button : button,
        button2 : button2,
        switchButton : switchButton,
        motion : motion
    });

    // "calibrated" occurs once, at the beginning of a session,
    motion.on("calibrated", function() {
        console.log("calibrated");
    });

    // "motionstart" events are fired when the "calibrated"
    // proximal area is disrupted, generally by some form of movement
    motion.on("motionstart", function() {
        console.log("motionstart");
    });

    // "motionend" events are fired following a "motionstart" event
    // when no movement has occurred in X ms
    motion.on("motionend", function() {
        console.log("motionend");
    });

    switchButton.on('open', function() {
        if (!this.isOpened) {
            this.isOpened = true;
            console.log('switch open');
        }
    })

    switchButton.on('close', function() {
        if (this.isOpened) {
            this.isOpened = false;
            console.log('switch close');
        }
    })

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

    button2.on("down", function() {
        console.log("button 2 down");
        digitalLed1.toggle();
        digitalLed2.toggle();
    });

    // "hold" the button is pressed for specified time.
    //        defaults to 500ms (1/2 second)
    //        set
    button2.on("hold", function() {
        console.log("button 2 hold");
    });

    // "up" the button is released
    button2.on("up", function() {
        console.log("button 2 up");
    });

    // digitalLed1.strobe();
    // digitalLed2.strobe();
    // digitalLed1.blink();
    // digitalLed2.blink();

    // (new five.Led('P1-7').Led('P1-8')).strobe();
});