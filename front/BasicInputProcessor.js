/*
    A basic REPL input interface for the bot.
*/


const { InputProcessor } = require('../core/InputProcessor');
const { Message } = require('../core/Message');

class BasicInputProcessor extends InputProcessor {
    constructor(context) {
        super(context);
    }

    init() {
        super.init();
        process.stdin.resume();
        process.stdin.setEncoding("ascii");
        process.stdin.on("data", (input) => this.processMessage(input));
    }

    processMessage(input) {
        this.context.onMessage(new Message('defaultuser', 'cli', input.trim()));
    }
}

module.exports = { BasicInputProcessor };