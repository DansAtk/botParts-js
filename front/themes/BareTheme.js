/*
    A bare Theme that adds newlines around the output in a frame.
*/


const { Theme } = require('../models/Theme');

class BareTheme extends Theme {
    static width = 80;

    static addFrame(message) {
        let tempMessage = message;
        tempMessage.content = `\n${tempMessage.content}\n`;
        return tempMessage;
    }
}

module.exports = { BareTheme };
