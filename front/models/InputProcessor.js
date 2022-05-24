/*
    An "abstract" class defining static constructor calls and expected methods
    that should apply to any given input processor.

    Input processors take input from various sources and format it into Message
    objects before passing them on to the bot controller.
*/


const { APP } = require('../../data/managers/GlobalManager');

class InputProcessor {
    constructor() {
    }

    init() {
        APP.get('events').emit('logmessage', "Input process initializing");
    }

    processMessage() { }

    cleanup() {
        APP.get('events').emit('logmessage', "Cleaning up input process");
    }
}

module.exports = { InputProcessor };