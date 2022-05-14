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
        super.init();
        this.processMessage(process.argv)
    }

    processMessage(input) {
        this.context.onMessage(new Message('defaultuser', 'cli', input.slice(2).join(' ')));
    }

    cleanup() {
        super.cleanup();
    }
}

module.exports = { OneShotInputProcessor };