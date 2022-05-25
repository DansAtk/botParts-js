/*
    Defines Place objects and provides a GLOBAL place.
*/


const { ScopedObject } = require('./Scope');

class Place extends ScopedObject {
    constructor(
        id = null,
        name = null,
        scope = null,
        tz = null,
        trigger = null
    ) {
        super(id, name, null, tz);
        this.scope = scope;
        this.trigger = trigger;
        this.children = new Set();
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

    set trigger(newTrigger) {
        if ((typeof newTrigger == 'string' && newTrigger.length == 1) || newTrigger == null) {
            this._trigger = newTrigger;
        } else {
            throw `Trigger must be of type 'String' and of length 1, or null`;
        }
    }

    get trigger() {
        return this._trigger;
    }

    get details() {
        return `Place ${this}:\n` +
            `  Scope - ${this.scope}\n` +
            `  Timezone - ${this.tz ? this.tz : "None"}\n` +
            `  Trigger - ${this.trigger}`;
    }

    addChild(place) {
        if (place instanceof Place) {
            if (this.children.has(place.id)) {
                return false;
            } else {
                this.children.add(place.id);
                return true;
            }
        } else {
            throw `Place children must be of type 'Place'`;
        }
    }

    removeChild(placeid) {
        return this.children.delete(placeid);
    }
}

let GLOBAL = new Place('GLOBAL', 'GLOBAL', null, 'America/New_York', '~');

module.exports = { Place, GLOBAL };