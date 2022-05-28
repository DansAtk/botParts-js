const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class TesterOngoing extends Command {
    constructor() {
        super(
            'ongoing',
            GLOBAL,
            "Takes a long time to finish its job.",
            "Call this command and then follow it up with other commands to verify the bot isn't blocked by a long running job.",
            async (message) => {
                message.content = "Ongoing job is starting!";
                APP.get('events').emit('outmessage', message);
                await new Promise(resolve => setTimeout(resolve, 10000));

                message.content = "Ongoing job has finished!";
                APP.get('events').emit('outmessage', message);
            }
        );
    }
}

module.exports = { TesterOngoing };