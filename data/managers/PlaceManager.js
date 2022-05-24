const { APP } = require('./GlobalManager');
const { v4: uuidv4 } = require('uuid');
const { Place, GLOBAL } = require("../models/core/Scope");
const { DataManager } = require("./DataManager");
const { DataPack } = require('../storage/DataPack');

class PlaceManager extends DataManager {
    constructor() {
        super();
        APP.add('places', this);

        APP.get('events').on('placedelete', (scopeid) => {
            this.deleteScope(scopeid);
        })
    }

    // Generate a new Place object with a unique ID
    async new(
        name = null,
        scope = GLOBAL,
        tz = null,
        trigger = null
    ) {
        let id = uuidv4();

        while (await this.get(id)) {
            id = uuidv4();
        }

        return new Place(id, name, scope, tz, trigger);
    }

    // Create a new entry for a place
    async add(newPlace) {
        // Build a datapack from the passed place
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.key = 'id';
        datapack.addValue("id", newPlace.id);
        datapack.addValue("name", newPlace.name);
        datapack.addValue("scope", newPlace.scope);
        datapack.addValue("tz", newPlace.tz);
        datapack.addValue("trigger", newPlace.trigger);
        datapack.addValue("children", [...newPlace.children].join(','));

        // Submit request for storage of the datapack to the storage manager
        let newPlaceID = await APP.get('store').add(datapack);

        if (newPlaceID) {
            APP.get('events').emit('placeadd', newPlaceID);
            return newPlaceID;
        } else {
            return false;
        }
    }

    // Get a single place directly via its ID
    async get(placeid) {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.key = 'id';
        datapack.addQuery('id', placeid);

        let result = await APP.get('store').get(datapack);

        if (result) {
            let resultPlace = new Place(result.id, result.name, null, result.tz, result.trigger);
            resultPlace._scope = result.scope;
            // Parse children from comma separated string and add each to the place
            if (result.children.length > 0) {
                const children = result.children.split(',');
                for (let childIndex in children) {
                    resultPlace.children.add(children[childIndex]);
                }
            }

            return resultPlace;
        } else {
            return false;
        }
    }

    // Find places that have properties matching the query place object
    async find(queryPlace) {
        // Build a datapack from the passed place object, using its values as a query
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.key = 'id';
        if (queryPlace.id) datapack.addQuery("id", queryPlace.id);
        if (queryPlace.name) datapack.addQuery("name", queryPlace.name);
        if (queryPlace.scope) datapack.addQuery("scope", queryPlace.scope);
        if (queryPlace.tz) datapack.addQuery("tz", queryPlace.tz);
        if (queryPlace.trigger) datapack.addQuery("trigger", queryPlace.trigger);
        if (queryPlace.children.size > 0) datapack.addQuery("children", [...queryPlace.children].join(','));

        // Submit query to storage manager
        let results = await APP.get('store').find(datapack);

        // Repackage results back into Place objects and store them in an array
        if (results) {
            let resultPlaces = new Array();
            for (let index in results) {
                let res = results[index];
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

            // Return an array of all found places
            return resultPlaces;
        } else {
            return false;
        }
    }

    // Overwrite the place specified by ID with values in updatePlace
    async update(placeid, updatePlace) {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.key = 'id';
        datapack.addQuery("id", placeid);

        datapack.addValue("id", updatePlace.id);
        datapack.addValue("name", updatePlace.name);
        datapack.addValue("scope", updatePlace.scope);
        datapack.addValue("tz", updatePlace.tz);
        datapack.addValue("trigger", updatePlace.trigger);
        if (updatePlace.children.size > 0) datapack.addValue("children", [...updatePlace.children].join(','));

        let updatedPlaceID = await APP.get('store').update(datapack);

        if (updatedPlaceID) {
            APP.get('events').emit('placeupdate', updatedPlaceID);
            return updatedPlaceID;
        } else {
            return false;
        }
    }

    // Update all places matching query values with values in updatePlace
    async findUpdate(queryPlace, updatePlace) {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.key = 'id';
        if (queryPlace.id) datapack.addQuery("id", queryPlace.id);
        if (queryPlace.name) datapack.addQuery("name", queryPlace.name);
        if (queryPlace.scope) datapack.addQuery("scope", queryPlace.scope);
        if (queryPlace.tz) datapack.addQuery("tz", queryPlace.tz);
        if (queryPlace.trigger) datapack.addQuery("trigger", queryPlace.trigger);
        if (queryPlace.children.size > 0) datapack.addQuery("children", [...queryPlace.children].join(','));

        if (updatePlace.id) datapack.addValue("id", updatePlace.id);
        if (updatePlace.name) datapack.addValue("name", updatePlace.name);
        if (updatePlace.scope) datapack.addValue("scope", updatePlace.scope);
        if (updatePlace.tz) datapack.addValue("tz", updatePlace.tz);
        if (updatePlace.trigger) datapack.addValue("trigger", updatePlace.trigger);
        if (updatePlace.children.size > 0) datapack.addValue("children", [...updatePlace.children].join(','));

        // Submit update request to storage manager
        let updatedPlaceIDs = await APP.get('store').findUpdate(datapack);

        if (updatedPlaceIDs) {
            for (let placeid of updatedPlaceIDs) {
                APP.get('events').emit('placeupdate', placeid);
            }

            return updatedPlaceIDs;
        } else {
            return false;
        }
    }

    // Deletes a single place selected via its exact ID
    async delete(placeid) {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.key = 'id';
        datapack.addQuery("id", placeid);

        let deletedPlaceID = await APP.get('store').delete(datapack);

        if (deletedPlaceID) {
            APP.get('events').emit('placedelete', deletedPlaceID);

            return deletedPlaceID;
        } else {
            return false;
        }
    }

    // Remove place(s) from storage matching the provided place
    async findDelete(queryPlace) {
        // Build a datapack using the passed in place for query values
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.key = 'id';
        if (queryPlace.id) datapack.addQuery("id", queryPlace.id);
        if (queryPlace.name) datapack.addQuery("name", queryPlace.name);
        if (queryPlace.scope) datapack.addQuery("scope", queryPlace.scope);
        if (queryPlace.tz) datapack.addQuery("tz", queryPlace.tz);
        if (queryPlace.trigger) datapack.addQuery("trigger", queryPlace.trigger);
        if (queryPlace.children.size > 0) datapack.addQuery("children", [...queryPlace.children].join(','));

        // Submit removal request to storage manager
        let deletedPlaceIDs = await APP.get('store').findDelete(datapack);

        if (deletedPlaceIDs) {
            for (let placeid of deletedPlaceIDs) {
                APP.get('events').emit('placedelete', placeid);
            }

            return deletedPlaceIDs;
        } else {
            return false;
        }
    }

    // Delete all places that are part of the given scope (specified by ID)
    async deleteScope(scopeid) {
        let qPlace = new Place();
        qPlace._scope = scopeid;
        return await this.findDelete(qPlace);
    }

    // Delete a place specified by ID from the parent's list of children
    async removeChild(childID) {
        let qPlace = new Place();
        qPlace._scope = null;
        qPlace.children.add(childID);

        let results = await this.find(qPlace);

        if (results) {
            let parent = results[0];
            parent.removeChild(childID);

            await this.update(parent.id, parent);
        }
    }

    async addChild(parentID, childID) {
        let parent = await this.get(parentID);
        let child = await this.get(childID);

        parent.addChild(child);

        await this.update(parent.id, parent);
    }

    // Look up the effective trigger for a given place specified by ID, and where its value has been inherited from
    async triggerof(placeid) {
        var provider = await this.get(placeid);

        while (!(provider.trigger)) {
            provider = await this.get(provider.scope);
        }

        return { provider: provider, trigger: provider.trigger };
    }

    // Sets up a new container for place storage
    async init() {
        let datapack = new DataPack(".", "testDB.db", "places");
        datapack.addValue("id", "TEXT PRIMARY KEY");
        datapack.addValue("name", "TEXT");
        datapack.addValue("scope", "TEXT");
        datapack.addValue("tz", "TEXT");
        datapack.addValue("trigger", "TEXT");
        datapack.addValue("children", "TEXT");
        await APP.get('store').newContainer(datapack);
        await this.add(GLOBAL);
        return true;
    }
}

module.exports = { PlaceManager };