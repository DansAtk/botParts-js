/*
    A basic REPL input interface for the bot.
*/


const { APP } = require('../../data/managers/GlobalManager');
const { InputProcessor } = require('../models/InputProcessor');
const { Message } = require('../../data/models/core/Message');
const { User } = require('../../data/models/core/User')
const { Place } = require('../../data/models/core/Scope')

class BasicInputProcessor extends InputProcessor {
    constructor() {
        super();
        this.cliuser = new User('CLIUSER', 'CLIUSER');
        this.stdin = new Place('STDIN', 'STDIN');
        this.stdout = new Place('STDOUT', 'STDOUT');
    }

    init() {
        super.init();
        process.stdin.resume();
        process.stdin.setEncoding("ascii");
        process.stdin.on("data", (content) => this.processMessage(content));
    }

    processMessage(content) {
        APP.get('events').emit('newmessage', new Message(this.cliuser, content.trim(), this.stdin, this.stdout, null, new Date()));
    }
}

module.exports = { BasicInputProcessor };