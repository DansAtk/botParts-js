/*
    A basic input interface that takes a single command immediately from
    command line parameters on running the bot, executes it and then shuts down.
*/


const { APP } = require('../../data/managers/GlobalManager');
const { InputProcessor } = require('../models/InputProcessor');
const { Message } = require('../../data/models/core/Message');
const { User } = require('../../data/models/core/User')
const { Place } = require('../../data/models/core/Scope')

class OneShotInputProcessor extends InputProcessor {
    constructor() {
        super();
        this.cliuser = new User('CLIUSER', 'CLIUSER');
        this.stdin = new Place('STDIN', 'STDIN');
        this.stdout = new Place('STDOUT', 'STDOUT');
    }

    init() {
        super.init();
        this.processMessage(process.argv)
    }

    processMessage(input) {
        APP.get('events').emit('newmessage', new Message(this.cliuser, input.slice(2).join(' '), this.stdin, this.stdout, null, new Date()));
    }
}

module.exports = { OneShotInputProcessor };