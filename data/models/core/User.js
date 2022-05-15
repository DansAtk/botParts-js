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
        rank = null,
        country = null,
        points = null
    ) {
        super(id, scope, tz);
        this.name = name;
        this.bday = bday;
        this.rank = rank;
        this.country = country;
        this.points = points;
    }
}

let BOTUSER = new User(0, "BOTUSER", GLOBAL);

module.exports = { User, BOTUSER };