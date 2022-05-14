/*
    An output processor that posts output to stdout.
*/


const { OutputProcessor } = require('../core/OutputProcessor');
const { Theme } = require('../core/Theme');

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