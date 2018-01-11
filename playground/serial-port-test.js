const SerialPort = require('serialport');
const port = new SerialPort('/dev/tty-ACM0', {
    baudRate: 9600
}, (err) => {
    console.log(err);
});

port.on('data', (data) =>{
    console.log(data);
});