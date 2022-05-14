/*
    A class that handles outputting system messages, errors, and debug info to stdout.
*/


const { Theme } = require("./Theme");
const { Message } = require('./Message');

class LogProcessor {
    constructor(context, theme=Theme) {
        this.context = context;
        this.theme = theme;
    }

    init() {
        this.context.log("Log process initializing");
    }

    post(message) {
        console.log(message.content);
    }

    output(content) {
        this.post(this.theme.apply(new Message('bot', 'local', content)));
    }

    cleanup() {
        this.context.log("Cleaning up log process")
    }
}

module.exports = { LogProcessor };