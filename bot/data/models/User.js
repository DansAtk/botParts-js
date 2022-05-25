/*
    Defines User objects.
*/


const { ScopedObject } = require('./Scope');
const { Place, GLOBAL } = require('./Place');

class User extends ScopedObject {
    constructor(
        id = null,
        name = null,
        scope = null,
        tz = null,
        bday = null,
        country = null,
        points = null
    ) {
        super(id, name, null, tz);
        this.scope = scope;
        this.bday = bday;
        this.country = country;
        this.points = points;
    }

    set scope(place) {
        if (place instanceof Place || place == null) {
            this._scope = place == null ? null : place.id;
        } else {
            throw `Scope must be of type 'Place' or null`;
        }
    }

    get scope() {
        return this._scope;
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

    get details() {
        return `User ${this}:\n` +
            `  Scope - ${this.scope}\n` +
            `  Timezone - ${this.tz ? this.tz : "None"}\n` +
            `  Birthday - ${this.bday ? this.bday : "None"}\n` +
            `  Country - ${this.country ? this.country : "None"}\n` +
            `  Points - ${this.points ? this.points : "None"}`
    }
}

let BOTUSER = new User('BOTUSER', 'BOTUSER', GLOBAL);

module.exports = { User, BOTUSER };