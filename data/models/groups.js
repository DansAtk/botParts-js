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
        //self.type = type;
        this.scope = scope;
        this.tz = tz;
        this.members = new Map([
            ['users', new Array()],
            ['groups', new Array()]
        ]);
    }

    getUsers() {
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

    getGroups() {
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

    now() {
        let today = new Date();
        if (this.tz) {
            return utcToZonedTime(today, this.tz);
        } else {
            return today;
        }
    }

    printNow() {
        let today = new Date();
        if (this.tz) {
            let tzToday = utcToZonedTime(today, this.tz);
            console.log(`Time in ${this.tz}: ${format(tzToday, 'yyyy-MM-dd HH:mm:ss')}`);
        } else {
            console.log(`Group timezone not set. Server time: ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        }
    }
}

module.exports = { Group };