const { APP } = require('./GlobalManager');
const { v4: uuidv4 } = require('uuid');
const { Place, GLOBAL } = require("../models/core/Scope");
const { DataManager } = require("./DataManager");
const { DataPack } = require('../storage/DataPack');

class PlaceManager extends DataManager {
    constructor() {
        super();
        this.add(GLOBAL);
        APP.add('places', this);

        APP.get('events').on('placeremove', (place) => {
            this.deleteScope(place);
        })
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

    /*
    add(place) {
        if (place.scope) {
            if (this.data.has(place.scope)) {
                this.get(place.scope).addChild(place);
            }
        }

        APP.get('events').emit('placeadd', place);

        return super.add(place.id, place);
    }
    */

    // Create an entry for a new place in storage
    async add(newPlace) {
        // Build a datapack from the passed place
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.addValue("id", newPlace.id);
        datapack.addValue("name", newPlace.name);
        datapack.addValue("scope", newPlace.scope);
        datapack.addValue("tz", newPlace.tz);
        datapack.addValue("trigger", newPlace.trigger);
        let childString = [...newPlace.children].join(',');
        datapack.addValue("children", childString);

        // Submit request for storage of the datapack to the storage manager
        await APP.get('store').add(datapack);

        //Return true
        return true;
    }

    get(placeid) {
        return super.get(placeid);
    }

    // Load place(s) from storage that have values matching the provided place object
    async get(queryPlace) {
        // Build a datapack from the passed place object, using its values as a query
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.addQuery("id", queryPlace.id);
        datapack.addQuery("name", queryPlace.name);
        datapack.addQuery("scope", queryPlace.scope);
        datapack.addQuery("tz", queryPlace.tz);
        datapack.addQuery("trigger", queryPlace.trigger);
        datapack.addQuery("children", null);

        // Submit query to storage manager
        let results = await APP.get('store').get(datapack);

        // Repackage results back into Place objects and store them in an array
        let resultPlaces = new Array();
        for (let resIndex in results) {
            let res = results[resIndex];
            let resultPlace = new Place(res.id, res.name, null, res.tz, res.trigger);
            // Set scope using '_scope' to bypass type checking in 'scope's setter function
            resultPlace._scope = res.scope;
            // Parse children from comma separated string and add each to the place
            if (res.children.length > 0) {
                const children = res.children.split(',');
                for (let childIndex in children) {
                    resultPlace.children.add(children[childIndex]);
                }
            }

            resultPlaces.push(resultPlace);
        }

        // Return all found places
        return resultPlaces;
    }

    edit(place) {
        APP.get('events').emit('placeedit', place);
        return super.edit(place.id, place);
    }

    async update(queryPlace, updatePlace) {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.addQuery("id", queryPlace.id);
        datapack.addQuery("name", queryPlace.name);
        datapack.addQuery("scope", queryPlace.scope);
        datapack.addQuery("tz", queryPlace.tz);
        datapack.addQuery("trigger", queryPlace.trigger);

        datapack.addValue("id", updatePlace.id);
        datapack.addValue("name", updatePlace.name);
        datapack.addValue("scope", updatePlace.scope);
        datapack.addValue("tz", updatePlace.tz);
        datapack.addValue("trigger", updatePlace.trigger);
        if (updatePlace.children.size > 0) {
            let childString = [...updatePlace.children].join(',');
            datapack.addValue("children", childString);
        }

        // Submit update request to storage manager
        await APP.get('store').edit(datapack);

        // Return true
        return true;
    }

    remove(place) {
        this.parentof(place).removeChild(place.id);

        APP.get('events').emit('placeremove', place);
        return super.remove(place);
    }

    // Remove place(s) from storage matching the provided place
    async remove(queryPlace) {
        APP.get('events').emit('placeremove', queryPlace);
        // Build a datapack using the passed in place for query values
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.addQuery("id", queryPlace.id);
        datapack.addQuery("name", queryPlace.name);
        datapack.addQuery("scope", queryPlace.scope);
        datapack.addQuery("tz", queryPlace.tz);
        datapack.addQuery("trigger", queryPlace.trigger);

        // Submit removal request to storage manager
        await APP.get('store').remove(datapack);

        // Return true
        return true;
    }

    clearScope(scope) {
        this.data.forEach(place => {
            if (place.scope == scope.id) {
                this.remove(place);
            }
        });
    }

    async deleteScope(queryScope) {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.addQuery("scope", queryScope.id);

        await APP.get('store').remove(datapack);

        return true;
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

    async init() {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.addValue("id", "TEXT");
        datapack.addValue("name", "TEXT");
        datapack.addValue("scope", "TEXT");
        datapack.addValue("tz", "TEXT");
        datapack.addValue("trigger", "TEXT");
        datapack.addValue("children", "TEXT");
        await APP.get('store').newContainer(datapack);
        return true;
    }
}

module.exports = { PlaceManager };