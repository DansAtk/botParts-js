const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class UserAllC extends Command {
    constructor() {
        super(
            'all',
            GLOBAL,
            "Displays a list of all users."
        );

        this.job = async (message) => {
            let users = await APP.get('users').all();

            if (users) {
                let userStrings = users.map((user) => {return user.toString()});
                message.content = `All users(${users.length}):\n${userStrings.join('\n')}`;
            } else {
                message.content = `No users found.`;
            }

            APP.get('events').emit('outmessage', message);
        }
    }
}

module.exports = { UserAllC };