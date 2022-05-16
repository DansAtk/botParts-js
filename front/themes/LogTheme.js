/*
    A Theme that clearly distinguishes system and debug messages from output using a different frame and header.
*/


const { Theme } = require('../models/Theme');

class LogTheme extends Theme {
    static width = 80;

    static addBanner(message) {
        let barrier = '%'.repeat(this.width);
        let tempMessage = message;
        tempMessage.content = `${barrier}\n${message.content}\n${barrier}`;
        return tempMessage;
    }

    static addHeader(message) {
        let tempMessage = message;
        let header = `SYSTEM:`
        tempMessage.content = `${header}\n${tempMessage.content}`;
        return tempMessage;
    }

    static addFrame(message) {
        let tempMessage = message;
        tempMessage.content = `\n${tempMessage.content}\n`;
        return tempMessage;
    }
}

module.exports = { LogTheme };
