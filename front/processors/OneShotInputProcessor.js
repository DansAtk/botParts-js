/*
    A basic input interface that takes a single command immediately from
    command line parameters on running the bot, executes it and then shuts down.
*/


const { InputProcessor } = require('../models/InputProcessor');
const { Message } = require('../../data/models/core/Message');
const { User } = require('../../data/models/core/User')
const { Place } = require('../../data/models/core/Scope')

class OneShotInputProcessor extends InputProcessor {
    constructor(context) {
        super(context);
        this.cliUser = new User("1", "cliuser");
        this.inPlace = new Place("1", "stdin")
        this.outPlace = new Place("2", "stdout")
    }

    init() {
        super.init();
        this.processMessage(process.argv)
    }

    processMessage(input) {
        this.context.onMessage(new Message(this.cliUser, input.slice(2).join(' '), this.inPlace, this.outPlace, null, new Date()));
    }

    cleanup() {
        super.cleanup();
    }
}

module.exports = { OneShotInputProcessor };