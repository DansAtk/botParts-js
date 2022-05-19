const { APP } = require('./GlobalManager');
const { v4: uuidv4 } = require('uuid');
const { Place, GLOBAL } = require("../models/core/Scope");
const { DataManager } = require("./DataManager");

class PlaceManager extends DataManager {
    constructor() {
        super();
        this.add(GLOBAL);
        APP.add('places', this);
    }

    new(
        name = null,
        scope = GLOBAL,
        tz = null,
        trigger = null
    ) {
        let id = uuidv4();

        while (this.get(id)) {
            id = uuidv4();
        }

        let newPlace = new Place(id, name, scope, tz, trigger);
        this.add(newPlace);
        return newPlace;
    }

    add(place) {
        if (place.scope) {
            if (this.data.has(place.scope)) {
                this.get(place.scope).addChild(place);
            }
        }

        APP.get('events').emit('placeadd', place);

        return super.add(place.id, place);
    }

    get(placeid) {
        return super.get(placeid);
    }

    edit(place) {
        APP.get('events').emit('placeedit', place);
        return super.edit(place.id, place);
    }

    remove(place) {
        this.parentof(place).removeChild(place.id);

        APP.get('events').emit('placeremove', place);
        return super.remove(place);
    }

    parentof(place) {
        if (place instanceof Place) {
            return place.scope ? this.get(place.scope) : null;
        } else {
            throw `Parent requires a valid place object`;
        }
    }

    triggerof(place) {
        if (place instanceof Place) {
            return place.trigger ? { 'provider': place, 'value': place.trigger } : this.triggerof(this.parentof(place));
        } else {
            throw `Trigger requires a valid place object`;
        }
    }
}

module.exports = { PlaceManager };