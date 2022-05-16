/*
    Defines User objects.
*/


const { TimeHolder, GLOBAL } = require('./Scope');

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

    set bday(date) {
        if (date instanceof Date || date == null) {
            this._bday = date;
        } else {
            throw `Birthday must be of type 'Date' or null`;
        }
    }

    get bday() {
        return this._bday;
    }

    set country(countryString) {
        if (typeof countryString == 'string' || countryString == null) {
            this._country = countryString;
        } else {
            throw `Country must be of type 'String' or null`;
        }
    }

    get country() {
        return this._country;
    }

    set points(pointsNumber) {
        if (typeof pointsNumber == 'number' || pointsNumber == null) {
            this._points = pointsNumber;
        } else {
            throw `Points must be of type 'Number' or null`;
        }
    }

    get points() {
        return this._points;
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

let BOTUSER = new User("0", "BOTUSER", GLOBAL);

module.exports = { User, BOTUSER };