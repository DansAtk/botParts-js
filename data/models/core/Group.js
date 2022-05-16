/*
    Defines Group objects.
*/


const { TimeHolder, Place, GLOBAL } = require('./Scope');
const { User } = require('./User');

class Group extends TimeHolder {
    constructor(
        id = null,
        name = null,
        scope = GLOBAL,
        tz = null
    ) {
        super(id, scope, tz, name);
        this.members = new Map([
            ['users', new Array()],
            ['groups', new Array()],
            ['places', new Array()]
        ]);
    }

    get users() {
        return this.members.get('users');
    }

    addUser(user) {
        if (user instanceof User) {
            this.members.get('users').push(user);
        } else {
            throw `Addition must be of type 'User'`;
        }
    }

    removeUser(user) {
        const index = this.members.get('users').indexOf(user);
        if (index > -1) {
            this.members.get('users').splice(index, 1);
        }
    }

    get groups() {
        return this.members.get('groups');
    }

    addGroup(group) {
        if (group instanceof Group) {
            this.members.get('groups').push(group);
        } else {
            throw `Addition must be of type 'Group'`;
        }
    }

    removeGroup(group) {
        const index = this.members.get('groups').indexOf(group);
        if (index > -1) {
            this.members.get('groups').splice(index, 1);
        }
    }

    get places() {
        return this.members.get('places');
    }

    addPlace(place) {
        if (place instanceof Place) {
            this.members.get('places').push(place);
        } else {
            throw `Addition must be of type 'Place'`;
        }
    }

    removePlace(place) {
        const index = this.members.get('places').indexOf(place);
        if (index > -1) {
            this.members.get('places').splice(index, 1);
        }
    }

    get details() {
        return `Group ${this}:\n` +
            `  Scope - ${this.scope}\n` +
            `  Timezone - ${this.tz ? this.tz : "None"}\n` +
            `  Members:\n` +
            `    Users - ${this.users.length}\n` +
            `    Groups - ${this.groups.length}\n` +
            `    Places - ${this.places.length}`
    }
}

module.exports = { Group };