/*
    A basic REPL input interface for the bot.
*/


const { InputProcessor } = require('../models/InputProcessor');
const { Message } = require('../../data/models/core/Message');
const { User } = require('../../data/models/core/User')
const { Place } = require('../../data/models/core/Scope')

class BasicInputProcessor extends InputProcessor {
    constructor(context) {
        super(context);
        this.cliUser = new User("1", "cliuser");
        this.inPlace = new Place("1", "stdin")
        this.outPlace = new Place("2", "stdout")
    }

    init() {
        super.init();
        process.stdin.resume();
        process.stdin.setEncoding("ascii");
        process.stdin.on("data", (content) => this.processMessage(content));
    }

    processMessage(content) {
        this.context.onMessage(new Message(this.cliUser, content.trim(), this.inPlace, this.outPlace, null, new Date()));
    }
}

module.exports = { BasicInputProcessor };