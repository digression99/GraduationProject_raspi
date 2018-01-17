const readln = require('readline');
// const {initCli} = require('./utils');
const {setProgram} = require('./program-setting');
const Commander = require('./commander-setting');
//
// let todos, setting;
// initCli()
//     .then(({initTodos, initSetting}) => {
//         todos = initTodos;
//         setting = initSetting;
//     })
//     .catch((e) => console.log(e));

let cl = readln.createInterface( process.stdin, process.stdout );
// cl.setPrompt('guess >');

let question = (q) => {
    return new Promise( (res, rej) => {
        cl.question( q, answer => {
            res(answer);
        })
    });
};

async function main(todos, setting) {
    let answer = "";
    // const tempProg = _.cloneDeep(program);

    while (true) {
        answer = await question(':: ');
        let argv = Array.prototype.slice.call(process.argv);

        answer.trim().split(' ').forEach(opt => {
            argv.push(opt.trim());
        });
        const prog = new Commander();
        setProgram(prog, setting, todos);

        prog.parse(argv);
    }
    //cl.close();
}

module.exports = main;