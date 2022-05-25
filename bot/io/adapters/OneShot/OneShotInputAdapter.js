/*
    A basic input interface that takes a single command immediately from
    command line parameters on running the bot, executes it and then shuts down.
*/


const { APP } = require('../../../data/managers/GlobalManager');
const { InputAdapter } = require('../InputAdapter');
const { Message } = require('../../Message');
const { User } = require('../../../data/models/User')
const { Place } = require('../../../data/models/Place')

class OneShotInputAdapter extends InputAdapter {
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

module.exports = { OneShotInputAdapter };