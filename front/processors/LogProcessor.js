/*
    A class that handles outputting system messages, errors, and debug info to stdout.
*/


const { Theme } = require('../models/Theme');
const { Message } = require('../../data/models/core/Message');
const { BOTUSER } = require('../../data/models/core/User');
const { GLOBAL } = require('../../data/models/core/Place');

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
        this.post(this.theme.apply(new Message(BOTUSER, content, GLOBAL, GLOBAL)));
    }

    cleanup() {
        this.context.log("Cleaning up log process")
    }
}

module.exports = { LogProcessor };