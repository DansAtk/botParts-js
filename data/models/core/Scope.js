/*
    Defines ScopedObject, TimeHolder, and Place objects, and provides a GLOBAL place.
*/


const { format, utcToZonedTime } = require("date-fns-tz");

class ScopedObject {
    constructor(id = null, scope = null, name = null) {
        this.id = id;
        this.scope = scope;
        this.name = name;
    }

    set id(idString) {
        if (typeof idString == 'string' || idString == null) {
            this._id = idString;
        } else {
            throw `ID must be of type 'String' or null`;
        }
    }

    get id() {
        return this._id;
    }

    set scope(place) {
        if (place instanceof Place || place == null) {
            this._scope = place;
        } else {
            throw `Scope must be of type 'Place' or null`;
        }
    }

    get scope() {
        return this._scope;
    }

    set name(nameString) {
        if (typeof nameString == 'string' || nameString == null) {
            this._name = nameString;
        } else {
            throw `Name must be of type 'String' or null`;
        }
    }

    get name() {
        return this._name;
    }

    toString() {
        return `${this.name ? this.name + "(" + this.id + ")" : this.id}`;
    }
}

class TimeHolder extends ScopedObject {
    constructor(
        id = null,
        scope = null,
        tz = null,
        name = null
    ) {
        super(id, scope, name);
        this.tz = tz;
    }

    set tz(tzString) {
        if (typeof tzString == 'string' || tzString == null) {
            this._tz = tzString;
        } else {
            throw `Timezone must be of type 'String' or null`;
        }
    }

    get tz() {
        return this._tz;
    }

    get time() {
        return this.tz ? { 'provider': this, 'value': utcToZonedTime(new Date(), this.tz) } : this.scope.time;
    }

    printNow() {
        console.log(
            `Time (${this.time.provider.tz}): ` +
            `${format(this.time.value, 'yyyy-MM-dd HH:mm:ss')} ` +
            `(provided by ${this.time.provider})`
        );
    }
}

class Place extends TimeHolder {
    constructor(
        id = null,
        name = null,
        scope = GLOBAL,
        tz = null,
        trigger = null
    ) {
        super(id, scope, tz, name);
        this.trigger = trigger;
    }

    set trigger(newTrigger) {
        if ((typeof newTrigger == 'string' && newTrigger.length == 1) || newTrigger == null) {
            this._trigger = newTrigger;
        } else {
            throw `Trigger must be of type 'String' and of length 1, or null`;
        }
    }

    get trigger() {
        return this._trigger ? { 'provider': this, 'value': this._trigger } : this.scope.trigger;
    }

    get details() {
        return `Place ${this}:\n` +
            `  Scope - ${this.scope}\n` +
            `  Timezone - ${this.tz ? this.tz : "None"}\n` +
            `  Trigger - ${this.trigger.value} (provided by ${this.trigger.provider})`;
    }
}

let GLOBAL = new Place("0", "GLOBAL", null, "America/New_York", '~');

module.exports = { ScopedObject, TimeHolder, Place, GLOBAL };