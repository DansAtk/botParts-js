/*
    Defines Group objects.
*/


const { TimeHolder } = require('./TimeHolder');
const { GLOBAL } = require('./Place');

class Group extends TimeHolder {
    constructor(
        id = null,
        name = null,
        scope = GLOBAL,
        tz = null
    ) {
        super(id, scope, tz);
        this.name = name;
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
        this.members.get('users').push(user);
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
        this.members.get('groups').push(group);
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
        this.members.get('places').push(place);
    }

    removePlace(place) {
        const index = this.members.get('places').indexOf(place);
        if (index > -1) {
            this.members.get('places').splice(index, 1);
        }
    }
}

module.exports = { Group };