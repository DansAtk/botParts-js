/*
    An output processor that posts output to stdout.
*/


const { OutputProcessor } = require('../models/OutputProcessor');
const { Theme } = require('../models/Theme');

class OneShotOutputProcessor extends OutputProcessor {
    constructor(context, theme=Theme) {
        super(context, theme);
    }

    post(message) {
        console.log(message.content);
        this.context.cleanup();
    }
}

module.exports = { OneShotOutputProcessor };