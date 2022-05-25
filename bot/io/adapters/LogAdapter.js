/*
    A class that handles outputting system messages, errors, and debug info to stdout.
*/


const { APP } = require('../../data/managers/GlobalManager');
const { Theme } = require('../themes/Theme');
const { Message } = require('../Message');
const { BOTUSER } = require('../../data/models/User');
const { GLOBAL } = require('../../data/models/Place');

class LogAdapter {
    constructor(theme = Theme) {
        this.theme = theme;
        APP.get('events').on('logmessage', (content) => this.log(content));
    }

    init() {
        APP.get('events').emit('logmessage', "Log process initializing");
    }

    post(message) {
        console.log(message.content);
    }

    log(content) {
        this.post(this.theme.apply(new Message(BOTUSER, content, GLOBAL, GLOBAL, null, new Date())));
    }

    cleanup() {
        APP.get('events').emit('logmessage', "Cleaning up log process");
    }
}

module.exports = { LogAdapter };