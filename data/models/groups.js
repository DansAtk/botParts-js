/*
    Defines Group objects.
*/


const { format, utcToZonedTime } = require("date-fns-tz");

class Group {
    constructor(
        id = null,
        name = null,
        scope = null,
        tz = null
    ) {
        this.id = id;
        this.name = name;
        this.scope = scope;
        this.tz = tz;
        this.members = new Map([
            ['users', new Array()],
            ['groups', new Array()]
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

    get now() {
        let today = new Date();
        if (this.tz) {
            return utcToZonedTime(today, this.tz);
        } else {
            return today;
        }
    }

    printNow() {
        let today = this.now;
        if (this.tz) {
            console.log(`Group time (${this.tz}): ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        } else {
            console.log(`Server time: ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        }
    }
}

module.exports = { Group };