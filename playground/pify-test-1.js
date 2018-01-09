const fs = require('fs');
const pify = require('pify');
const path = require('path');

const getData = async () => {
    const data = await pify(fs).readFile(path.join(__dirname, 'setting.json'));

    console.log(JSON.parse(data));
    return data;
};

getData();


// const data = await pify(fs).readFile(path.join(__dirname, 'setting.json'), 'utf-8')
