const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');
const { UserAllC } = require('./UserAllC');

class UserGetC extends Command {
    constructor() {
        super(
            'get',
            GLOBAL,
            "Looks up a single user.",
            "Specify a user id to look up."
        );

        this.job = async (message) => {
            let userid = message.content.split(' ')[0];

            if (userid.length > 0) {
                let gotUser = await APP.get('users').get(userid);

                message.content = gotUser ? `${gotUser.details}` : `User not found.`;
                APP.get('events').emit('outmessage', message);
            }
        }
    }

    init() {
        this.addChild(new UserAllC());
    }

}

module.exports = { UserGetC };