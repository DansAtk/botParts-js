/*
    An "abstract" class defining static constructor calls and expected methods
    that should apply to any given output processor.

    Output processors take output from bot command jobs in the form of message objects, format them,
    and post/present them in a way specific to the specified platform.
*/


const { APP } = require('../../data/managers/GlobalManager');
const { Theme } = require("./Theme");

class OutputProcessor {
    constructor(theme = Theme) {
        this.theme = theme;
        APP.get('events').on('newmessage', (message) => this.output(message));
    }

    init() {
        APP.get('events').emit('logmessage', "Output process initializing");
    }

    post(message) { }

    output(message) {
        this.post(this.theme.apply(message));
    }

    cleanup() {
        APP.get('events').emit('logmessage', "Cleaning up output process");
    }
}

module.exports = { OutputProcessor };