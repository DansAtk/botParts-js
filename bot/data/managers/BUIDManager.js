/*
    A manager for Bot Unique ID's.
*/

const { APP } = require('./GlobalManager');
const { v4: uuidv4 } = require('uuid');
const { DataPack } = require('../storage/DataPack');

class BUIDManager {
    constructor() {
        APP.get('events').on('useradd', (newUserID) => {
            this.add(newUserID, 'user');
        });
        APP.get('events').on('userdelete', (deletedUserID) => {
            this.delete(deletedUserID);
        });

        APP.get('events').on('placeadd', (newPlaceID) => {
            this.add(newPlaceID, 'place');
        });
        APP.get('events').on('placedelete', (deletedPlaceID) => {
            this.delete(deletedPlaceID);
        });

        APP.get('events').on('groupadd', (newGroupID) => {
            this.add(newGroupID, 'group');
        });
        APP.get('events').on('groupdelete', (deletedGroupID) => {
            this.delete(deletedGroupID);
        });
    }

    async new() {
        let id = uuidv4();

        while (await this.get(id)) {
            id = uuidv4();
        }

        return id;
    }

    // Create a new entry for a buid
    async add(id, type) {
        // Build a datapack from the passed user
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.key = 'id';
        datapack.addValue("id", id);
        datapack.addValue("type", type);

        // Submit request for storage of the datapack to the storage manager
        let newBUID = await APP.get('store').add(datapack);

        if (newBUID) {
            APP.get('events').emit('buidadd', newBUID);
            return newBUID;
        } else {
            return false;
        }
    }

    // Get a single user directly via its ID
    async get(buid) {
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.key = 'id';
        datapack.addQuery('id', buid);

        let result = await APP.get('store').get(datapack);

        if (result) {
            return result;
        } else {
            return false;
        }
    }

    // Find buids that have properties matching the query type
    async find(queryType) {
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.key = 'id';
        datapack.addQuery("type", queryType);

        // Submit query to storage manager
        let results = await APP.get('store').find(datapack);

        // Return results if any
        if (results) {
            return results;
        } else {
            return false;
        }
    }

    // Overwrite the buid specified by ID with values in updateBUID
    async update(buid, updateBUID) {
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.key = 'id';
        datapack.addQuery("id", buid);

        datapack.addValue("id", updateBUID.id);
        datapack.addValue("type", updateBUID.type);

        // Submit update request to storage manager
        let updatedBUID = await APP.get('store').update(datapack);

        if (updatedBUID) {
            APP.get('events').emit('buidupdate', updatedBUID);

            return updatedBUID;
        } else {
            return false;
        }
    }

    // Update all buids matching query values with values in updateBUID
    async findUpdate(queryBUID, updateBUID) {
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.key = 'id';
        if (queryBUID.id) datapack.addQuery("id", queryBUID.id);
        if (queryBUID.type) datapack.addQuery("type", queryBUID.type);

        if (updateBUID.id) datapack.addValue("id", updateBUID.id);
        if (updateBUID.type) datapack.addValue("type", updateBUID.type);

        // Submit update request to storage manager
        let updatedBUIDs = await APP.get('store').findUpdate(datapack);

        if (updatedBUIDs) {
            for (let buid of updatedBUIDs) {
                APP.get('events').emit('buidupdate', buid);
            }

            return updatedBUIDs;
        } else {
            return false;
        }
    }

    // Deletes a single buid
    async delete(buid) {
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.key = 'id';
        datapack.addQuery("id", buid);

        let deletedBUID = await APP.get('store').delete(datapack);

        if (deletedBUID) {
            APP.get('events').emit('buiddelete', deletedBUID);

            return deletedBUID;
        } else {
            return false;
        }
    }

    // Remove buid(s) from storage matching the provided query values
    async findDelete(queryBUID) {
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.key = 'id';
        if (queryBUID.id) datapack.addQuery("id", queryBUID.id);
        if (queryBUID.type) datapack.addQuery("type", queryBUID.type);

        // Submit removal request to storage manager
        let deletedBUIDs = await APP.get('store').findDelete(datapack);

        if (deletedBUIDs) {
            for (let buid of deletedBUIDs) {
                APP.get('events').emit('buiddelete', buid);
            }

            return deletedBUIDs;
        } else {
            return false;
        }
    }

    // Retreives all buids
    async all() {
        let datapack = new DataPack(".", "testDB.db", "buids");

        let results = await APP.get('store').all(datapack);

        if (results) {
            return results;
        } else {
            return false;
        }
    }

    // Clears all BUIDs
    async clear() {
        let datapack = new DataPack(".", "testDB.db", "buids");

        await APP.get('store').clear(datapack);
        return true;
    }

    // Sets up a new container for user storage
    async setup() {
        let datapack = new DataPack(".", "testDB.db", "buids");
        datapack.addValue("id", "TEXT PRIMARY KEY");
        datapack.addValue("type", "TEXT");
        await APP.get('store').newContainer(datapack);
        return true;
    }

    async raze() {
        let datapack = new DataPack(".", "testDB.db", "buids");

        await APP.get('store').deleteContainer(datapack);
        return true;
    }
}

module.exports = { BUIDManager };