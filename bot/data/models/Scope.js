/*
    Defines ScopedObjects
*/


const { format, utcToZonedTime } = require("date-fns-tz");

class ScopedObject {
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

    set scope(scopeid) {
        if (typeof scopeid == 'string' || place == null) {
            this._scope = scopeid;
        } else {
            throw `Scope must be of type 'String' or null`;
        }
    }

    get scope() {
        return this._scope;
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

    toString() {
        return `${this.name ? this.name + "(" + this.id + ")" : this.id}`;
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

module.exports = { ScopedObject };