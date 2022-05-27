const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

const { UserNewC } = require('./UserNewC');
const { UserDeleteC } = require('./UserDeleteC');
const { UserGetC } = require('./UserGetC');
const { UserFindC } = require('./UserFindC');
const { UserAllC } = require('./UserAllC');
const { UserUpdateC } = require('./UserUpdateC');

class UserC extends Command {
    constructor() {
        super(
            'user',
            GLOBAL,
            "Commands for managing users.",
            "Specify an action."
        );
    }

    init() {
        this.addChild(new UserNewC());
        this.addChild(new UserDeleteC());
        this.addChild(new UserGetC());
        this.addChild(new UserFindC());
        this.addChild(new UserAllC());
        this.addChild(new UserUpdateC());
    };
}

module.exports = { UserC };