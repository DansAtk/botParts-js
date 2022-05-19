const { APP } = require('./GlobalManager');
const { v4: uuidv4 } = require('uuid');
const { GLOBAL } = require('../models/core/Scope');
const { User, BOTUSER } = require('../models/core/User');
const { DataManager } = require("./DataManager");

class UserManager extends DataManager {
    constructor() {
        super();
        this.add(BOTUSER);
        APP.add('users', this);
    }

    new(
        name = null,
        scope = GLOBAL,
        tz = null,
        bday = null,
        country = null,
        points = null
    ) {
        let id = uuidv4();

        while (this.get(id)) {
            id = uuidv4();
        }

        let newUser = new User(id, name, scope, tz, bday, country, points);
        this.add(newUser);
        return newUser;
    }

    add(user) {
        APP.get('events').emit('useradd', user);
        return super.add(user.id, user);
    }

    get(userid) {
        return super.get(userid);
    }

    edit(user) {
        APP.get('events').emit('useredit', user);
        return super.edit(user.id, user);
    }

    remove(user) {
        APP.get('events').emit('userremove', user);
        return super.remove(user);
    }
}

module.exports = { UserManager };