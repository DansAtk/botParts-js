/*
    A basic input interface that takes a single command immediately from
    command line parameters on running the bot, executes it and then shuts down.
*/


const { InputProcessor } = require('../core/InputProcessor');
const { Message } = require('../core/Message');

class OneShotInputProcessor extends InputProcessor {
    constructor(context) {
        super(context);
    }

    init() {
        this.processMessage(process.argv)
    }

    processMessage(input) {
        this.context.onMessage(new Message('defaultuser', 'cli', input.slice(2).join(' ')));
        this.context.cleanup();
    }

    cleanup() {
        console.log("Cleaning up OneShotInputProcessor");
    }
}

module.exports = { OneShotInputProcessor };