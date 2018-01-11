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
    // setting.time += offset;
};

const changeTask = () => {
    console.log('changing task!');
};

class UINode {
    constructor(func = undefined, children = [], parent = this) {
        this.func = func;
        this.children = children;
        this.parent = parent;
    }
}

class UI {
    constructor(rootNode) {
        this.state = {
            node : rootNode,
            select : 0
        };
    }

    changeSelect(offset) {
        const nextSelect = this.state.select + offset;
        if (nextSelect < 0 || nextSelect >= this.state.node.children.length) return;
        this.state.select = nextSelect;

        // if (!(this.state.select > 0 || this.state.select < this.state.node.children.length - 1)) return;
        // this.state.select += offset;
    }

    onSelect() {
        if (this.state.node.children) {
            this.state.node = this.state.node.children[this.state.select];
            this.state.select = 0;
        } else {
            // console.log()
        }
    }

    onBack() {
        this.state.node = this.state.node.parent;
        this.state.select = 0;
    }

    onAction() {
        this.state.node.func();
    }
}

const printMenu = (menu) => menu.forEach((m, idx) => console.log(`${idx + 1} : ${m}`));

const getRootNode = () => {
    let root = new UINode(() => printMenu(mainMenu));
    let startNode = new UINode(startPomo, [], root); // leaf
    let changeTaskNode = new UINode(changeTask, [], root); // leaf
    let changeTimeNode = new UINode(changeTime, [], root); // leaf
    let exitNode = new UINode(onExit, [], root);

    root.children.push(startNode);
    root.children.push(changeTaskNode);
    root.children.push(changeTimeNode);
    root.children.push(exitNode);

    return root;
};

module.exports = new UI(getRootNode());