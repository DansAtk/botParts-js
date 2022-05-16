/*
    An output processor that posts output to stdout.
*/


const { OutputProcessor } = require('../models/OutputProcessor');
const { Theme } = require('../models/Theme');

class BasicOutputProcessor extends OutputProcessor {
    constructor(context, theme=Theme) {
        super(context, theme);
    }

    post(message) {
        console.log(message.content);
    }
}

module.exports = { BasicOutputProcessor };