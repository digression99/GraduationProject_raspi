const moment = require('moment');
const fs = require('fs');
const path = require('path');

const printTodo = (todo) => {
    console.log(`${todo.text}, priority : ${todo.priority}`);
};

const printSetting = (setting, todos) => {
    console.log('* now setting ');
    console.log(`* time :  ${setting.time}`);
    console.log(`* todo :  ${todos[setting.index].text}`);
    if (setting.startedAt) console.log('pomo started at : ', moment(setting.startedAt).format('MMMM Do YYYY, h:mm:ss a'));
    if (setting.endedAt) console.log('pomo ended at : ', moment(setting.endedAt).format('MMMM Do YYYY, h:mm:ss a'));
};

const finishPomo = (setting) => {
    // take these logic to function.
    setting.endedAt = moment().valueOf();
    clearTimeout(setting.timeoutObj);
    setting.timeoutObj = null;
};

const startPomo = (setting, todos, myEmitter) => {
    setting.startedAt = moment().valueOf();
    setting.timeoutObj = setTimeout(() => {
        myEmitter.emit('pomo_done', {setting, todos});
    }, setting.time * 1000);
};

const initCli = () => {
    return new Promise((resolve, reject) => {
        fs.access(path.join(__dirname, 'saved_seed.json'), fs.constants.R_OK | fs.constants.W_OK, (err) => {
            let seedPath = "";
            if (err) {
                //console.log('no saved seed. using init seed.');
                seedPath = path.join(__dirname, 'seed.json');
            } else {
                //console.log('saved seed exists. using saved seed.');
                seedPath = path.join(__dirname, 'saved_seed.json');
            }
            fs.readFile(seedPath, (err, todos) => {
                if (err) reject(err);
                fs.access(path.join(__dirname, 'saved_setting.json'), fs.constants.R_OK | fs.constants.W_OK, (err) => {
                    let settingPath = "";
                    if (err) {
                        //console.log('no saved setting. using init setting.');
                        settingPath = path.join(__dirname, 'setting.json');
                    } else {
                        //console.log('saved setting exists. using saved setting.');
                        settingPath = path.join(__dirname, 'saved_setting.json');
                    }
                    fs.readFile(settingPath, (err, setting) => {
                        if (err) reject(err);
                        resolve({
                            initTodos : JSON.parse(todos),
                            initSetting : JSON.parse(setting)
                        });
                    });
                });
            });
        });
    })
};

const saveCli = (todos, setting) => {
    console.log('saving!');
    return new Promise((resolve, reject) => {
        fs.writeFile(path.join(__dirname, 'saved_seed.json'), JSON.stringify(todos, undefined, 2), (err) => {
            if (err) reject(err);
            fs.writeFile(path.join(__dirname, 'saved_setting.json'), JSON.stringify(setting, undefined, 2), (err) => {
                if (err) reject(err);
                resolve();
            })
        })
    });
};

module.exports = {
    printTodo, printSetting,
    finishPomo, startPomo,
    initCli, saveCli
};