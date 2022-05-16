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
        super(id, scope, tz, name);
        this._trigger = trigger;
    }

    get trigger() {
        return this._trigger ? {'provider': this, 'value': this._trigger} : this.scope.trigger;
    }

    toString() {
        return `${this.name ? this.name + "(" + this.id + ")" : this.id}`;
    }

    get details() {
        return `Place ${this}:\n` +
        `  Scope - ${this.scope}\n` +
        `  Timezone - ${this.tz ? this.tz : "None"}\n` +
        `  Trigger - ${this.trigger.value} (provided by ${this.trigger.provider})`;
    }
}

let GLOBAL = new Place(0, "GLOBAL", null, "America/New_York", '~');

module.exports = { Place, GLOBAL };
