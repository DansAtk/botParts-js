const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class TesterEcho extends Command {
    constructor() {
        super(
            'echo',
            GLOBAL,
            "Repeats the user's message.",
            "Follow the command with the message you would like repeated.",
            async (message) => {
                APP.get('events').emit('outmessage', message);
            }
        );
    }
}

module.exports = { TesterEcho };