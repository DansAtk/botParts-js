const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');
const { User } = require('../../data/models/User');

class UserNewC extends Command {
    constructor() {
        super(
            'new',
            GLOBAL,
            "Creates a new user.",
            "Specify the new user's name."
        );

        this.job = async (message) => {
            let name = message.content.split(' ')[0];

            if (name.length > 0) {
                message.content = message.content.slice(name.length).trim();

                let userid = await APP.get('users').add(await APP.get('users').new(name));

                message.content = `User ${name}(${userid}) added.`;
                APP.get('events').emit('outmessage', message);
            }
        };
    }
}

module.exports = { UserNewC };