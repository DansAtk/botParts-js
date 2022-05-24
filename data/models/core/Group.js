/*
    Defines Group objects.
*/


const { TimeHolder, Place } = require('./Scope');
const { User } = require('./User');

class Group extends TimeHolder {
    constructor(
        id = null,
        name = null,
        scope = null,
        tz = null
    ) {
        super(id, scope, tz, name);
        this.members = new Map()
            .set('users', new Set())
            .set('places', new Set());
    }

    get users() {
        return this.members.get('users');
    }

    addUser(user) {
        if (user instanceof User) {
            if (this.users.has(user.id)) {
                return false;
            } else {
                this.users.add(user.id);
                return true;
            }
        } else {
            throw `Addition must be of type 'User'`;
        }
    }

    removeUser(userid) {
        return this.users.delete(userid);
    }

    get places() {
        return this.members.get('places');
    }

    addPlace(place) {
        if (place instanceof Place) {
            if (this.places.has(place.id)) {
                return false;
            } else {
                this.places.add(place.id);
                return true;
            }
        } else {
            throw `Addition must be of type 'Place'`;
        }
    }

    removePlace(placeid) {
        return this.places.delete(placeid);
    }

    get details() {
        return `Group ${this}:\n` +
            `  Scope - ${this.scope}\n` +
            `  Timezone - ${this.tz ? this.tz : "None"}\n` +
            `  Members:\n` +
            `    Users - ${this.users.size}\n` +
            `    Places - ${this.places.size}`
    }
}

module.exports = { Group };