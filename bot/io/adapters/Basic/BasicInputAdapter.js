/*
    A basic REPL input interface for the bot.
*/


const { APP } = require('../../../data/managers/GlobalManager');
const { InputAdapter } = require('../InputAdapter');
const { Message } = require('../../Message');
const { User } = require('../../../data/models/User')
const { Place, GLOBAL } = require('../../../data/models/Place')

class BasicInputAdapter extends InputAdapter {
    constructor() {
        super();
        this.cliuser = new User('CLIUSER', 'CLIUSER', GLOBAL);
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

module.exports = { BasicInputAdapter };