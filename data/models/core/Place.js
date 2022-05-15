/*
    Defines Place objects.
*/


const { TimeHolder } = require('./TimeHolder');

class Place extends TimeHolder {
    constructor(
        id = null,
        name = null,
        scope = GLOBAL,
        tz = null,
        trigger = null
    ) {
        super(id, scope, tz);
        this.name = name;
        this.trigger = trigger;
    }
}

let GLOBAL = new Place(0, "GLOBAL", null, "America/New_York", '~');

module.exports = { Place, GLOBAL };
