const mainMenu = [
    "start",
    "change task",
    "change time",
    "exit"
];
//
// let changeTaskMenu = []; // dynamically change it.
//
// let changeTimeMenu = [
//     "+5",
//     "25",
//     "-5",
// ];
//
// let subMenus = [
//     changeTaskMenu,
//     changeTimeMenu
// ];


// leaves.
const startPomo = () => {
    console.log('start!');
};

const stopPomo = () => {
    console.log('stop!');
};

const onExit = () => {
    console.log('exit!');
};

const changeTime = (offset, setting) => {
    console.log('changing time!');
    setting.time += offset;
};

const changeTask = () => {
    console.log('changing task!');
};

class UINode {
    constructor(func = undefined, children = []) {
        this.func = func;
        this.children = children;
    }
}

module.exports = () => {
    let startNode = new UINode(startPomo); // leaf
    let changeTaskNode = new UINode(changeTask); // leaf
    let changeTimeNode = new UINode(changeTime); // leaf
    let exitNode = new UINode(onExit);
    return new UINode(
        () => mainMenu,
        [
            startNode,
            changeTaskNode,
            changeTimeNode,
            exitNode
        ]);
};