/*
    An output processor that posts output to stdout.
*/


const { APP } = require('../../data/managers/GlobalManager');
const { OutputProcessor } = require('../models/OutputProcessor');
const { Theme } = require('../models/Theme');

class BasicOutputProcessor extends OutputProcessor {
    constructor(theme = Theme) {
        super(theme);
    }

    post(message) {
        console.log(message.content);
    }
}

module.exports = { BasicOutputProcessor };