const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class UserDeleteC extends Command {
    constructor() {
        super(
            'delete',
            GLOBAL,
            "Deletes a user.",
            "Specify a user via ID."
        );

        this.job = async (message) => {
            let userid = message.content.split(' ')[0];

            if (userid.length > 0) {
                let foundUser = await APP.get('users').get(userid);
                if (foundUser) {
                    let deletedUser = await APP.get('users').delete(foundUser.id);
                    message.content = deletedUser ? `Deleted user ${foundUser.toString()}.` : `Failed to delete user ${foundUser.toString()}.`;
                } else {
                    message.content = `User not found.`;
                }

                APP.get('events').emit('outmessage', message);
            }
        }
    }
}

module.exports = { UserDeleteC };