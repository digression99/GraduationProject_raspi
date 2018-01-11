const mainMenu = [
    "start",
    "change task",
    "change time",
    "exit"
];

module.exports = (todos, setting) => {

    const pomoAction = () => {
        if (!setting.isStarted) {
            console.log('start!');
            setting.isStarted = true;
        } else {
            console.log('stop!');
            setting.isStarted = false;
        }
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
        constructor(func = undefined, children = undefined, parent = this) {
            this.func = func;
            this.children = children;
            this.parent = parent;
        }
    }

    class UI {
        constructor(rootNode) {
            this.state = {
                node : rootNode,
                select : 0,
                isStarted : false
            };
        }

        changeSelect(offset) {
            const nextSelect = this.state.select + offset;
            if (nextSelect < 0 || nextSelect >= this.state.node.children.length) return;
            this.state.select = nextSelect;
        }

        onSelect() {
            if (this.state.node.children) {
                console.log('NOT nothing!');
                this.state.node = this.state.node.children[this.state.select];
                this.state.select = 0;
            } else {
                console.log('nothing!');
            }
        }

        onBack() {
            this.state.node = this.state.node.parent;
            this.state.select = 0;
        }

        onAction() {
            if (this.state.node)
                this.state.node.func();
        }
    }

    const printMenu = (menu) => menu.forEach((m, idx) => console.log(`${idx + 1} : ${m}`));

    let root = new UINode(() => printMenu(mainMenu), []);
    let startNode = new UINode(pomoAction, undefined, root); // leaf
    let changeTaskNode = new UINode(changeTask, undefined, root); // leaf
    let changeTimeNode = new UINode(changeTime, undefined, root); // leaf
    let exitNode = new UINode(onExit, undefined, root);
    // console.log('startnode children : ', startNode.children);
    root.children.push(startNode);
    root.children.push(changeTaskNode);
    root.children.push(changeTimeNode);
    root.children.push(exitNode);

    return new UI(root);
};

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


// module.exports = new UI(root);