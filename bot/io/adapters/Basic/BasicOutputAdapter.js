/*
    An output processor that posts output to stdout.
*/


const { APP } = require('../../../data/managers/GlobalManager');
const { OutputAdapter } = require('../OutputAdapter');
const { Theme } = require('../../themes/Theme');

class BasicOutputAdapter extends OutputAdapter {
    constructor(theme = Theme) {
        super(theme);
    }

    post(message) {
        console.log(message.content);
    }
}

module.exports = { BasicOutputAdapter };