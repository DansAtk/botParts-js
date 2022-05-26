const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class TesterRandomUser extends Command {
    constructor() {
        super(
            'randomuser',
            GLOBAL,
            "Creates a new random user and prints its information.",
            "Takes no further information.",
            async (message) => {
                let randomUser = await APP.get('users').new('RandomUser', GLOBAL, 'Asia/Tokyo', null, 'Japan');
                message.content = `${randomUser.details}`;
                APP.get('events').emit('outmessage', message);
            }
        )
    }
}

module.exports = { TesterRandomUser };