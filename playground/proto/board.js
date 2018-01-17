let Raspi = require('raspi-io');
const five = require('johnny-five');
const {initCli, saveCli} = require('./utils');

let todos, setting;
let select = 0;
let isHold = false;

initCli()
    .then(({initTodos, initSetting}) => {
        todos = initTodos;
        setting = initSetting;
        let ui = require('./ui')(todos, setting);

        // board setting.
        const board = new five.Board({
            io : new Raspi()
        });

        board.on('event-start', function(data) {
            console.log('event-start!');
            console.log(data.name);
        });

        board.on('button-click', (data) => {
            switch (data.action) {
                case 'left':
                case 'right':
                    const offset = data.action === 'left' ? -1 : 1;
                    ui.changeSelect(offset);
                    break;
                case 'select':
                    ui.onSelect();
                    break;
                case 'back':
                    ui.onBack();
                    break;
                default:
                    console.log('error');
                    break;
            }
            ui.onAction();
            console.log(ui.state.select);
        });

        board.on('exit', function() {
            console.log('exit!');
        });

        board.on('ready', function() {
            console.log('board is ready!');
            ui.onAction();
            let button1 = new five.Button('P1-13');
            let button2 = new five.Button('P1-16');
            let button3 = new five.Button('P1-31');
            this.repl.inject({
                button1,
                button2,
                button3,
            });

            button1.on('down', () => {
                board.emit('button-click', {
                    action : 'left'
                });
            });
            button1.on('hold', () => {
            });
            button1.on('up', () => {
            });

            button2.on('down', () => {
            });
            button2.on('hold', () => {
                isHold = true;
            });
            button2.on('up', () => {
                if (isHold) {
                    isHold = false;
                    board.emit('button-click', {
                        action : 'back'
                    });
                } else {
                    board.emit('button-click', {
                        action : 'select'
                    });
                }
            });

            button3.on('down', () => {
                board.emit('button-click', {
                    action : 'right'
                });
            });
            button3.on('hold', () => {
            });
            button3.on('up', () => {
            });
        });
    });