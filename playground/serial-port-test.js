const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
}, (err) => {
    console.log(err);
});

port.on('data', (data) =>{
    console.log(data.toString('utf8'));
});