/*
    Defines User objects.
*/


const { TimeHolder } = require('./TimeHolder');
const { GLOBAL } = require('./Place');

class User extends TimeHolder {
    constructor(
        id = null,
        name = null,
        scope = GLOBAL,
        tz = null,
        bday = null,
        country = null,
        points = null
    ) {
        super(id, scope, tz, name);
        this.bday = bday;
        this.country = country;
        this.points = points;
    }

    toString() {
        return `${this.name ? this.name + "(" + this.id + ")" : this.id}`
    }

    get details() {
        return `User ${this}:\n` +
        `  Scope - ${this.scope}\n` +
        `  Timezone - ${this.tz ? this.tz : "None"}\n` +
        `  Birthday - ${this.bday ? this.bday : "None"}\n` +
        `  Country - ${this.country ? this.country : "None"}\n` +
        `  Points - ${this.points ? this.points : "None"}`
    }
}

let BOTUSER = new User(0, "BOTUSER", GLOBAL);

module.exports = { User, BOTUSER };