const { APP } = require('./GlobalManager');
const { GLOBAL } = require('../models/Place');
const { Group } = require("../models/Group");
const { DataPack } = require('../storage/DataPack');

class GroupManager {
    constructor() {
        APP.get('events').on('userdelete', (userid) => {
            this.deleteMemberUser(userid);
        })

        APP.get('events').on('placedelete', (placeid) => {
            this.deleteScope(placeid);
            this.deleteMemberPlace(placeid);
        })

        this.store = APP.get('datadir');
        this.storeController = APP.get('data');
    }

    // Generate a new Group object with a unique ID
    async new(
        name = null,
        scope = GLOBAL,
        tz = null
    ) {
        let id = await APP.get('buids').new();

        return new Group(id, name, scope, tz);
    }

    // Create a new entry for a group
    async add(newGroup) {
        let datapack = new DataPack(this.store, "groups");
        datapack.key = 'id';
        datapack.addValue("id", newGroup.id);
        datapack.addValue("name", newGroup.name);
        datapack.addValue("scope", newGroup.scope);
        datapack.addValue("tz", newGroup.tz);
        datapack.addValue("users", [...updateGroup.users].join(','));
        datapack.addValue("places", [...updateGroup.places].join(','));

        let newGroupID = await this.storeController.add(datapack);

        if (newGroupID) {
            APP.get('events').emit('groupadd', newGroupID);
            return newGroupID;
        } else {
            return false;
        }
    }

    // Get a single group directly via its ID
    async get(groupid) {
        let datapack = new DataPack(this.store, "groups");
        datapack.key = 'id';
        datapack.addQuery('id', groupid)

        let result = await this.storeController.get(datapack);

        if (result) {
            let resultGroup = new Group(result.id, result.name, null, result.tz);
            resultGroup._scope = result.scope;

            if (result.users.length > 0) {
                const users = result.users.split(',');
                for (let userIndex in users) {
                    resultGroup.users.add(users[userIndex]);
                }
            }

            if (result.places.length > 0) {
                const places = result.places.split(',');
                for (let placeIndex in places) {
                    resultGroup.places.add(places[placeIndex]);
                }
            }

            return resultGroup;
        } else {
            return false;
        }
    }

    // Find groups that have properties matching the query group object
    async find(queryGroup) {
        let datapack = new DataPack(this.store, "groups");
        datapack.key = 'id';
        if (queryGroup.id) datapack.addQuery("id", queryGroup.id);
        if (queryGroup.name) datapack.addQuery("name", queryGroup.name);
        if (queryGroup.scope) datapack.addQuery("scope", queryGroup.scope);
        if (queryGroup.tz) datapack.addQuery("tz", queryGroup.tz);
        if (queryGroup.users.size > 0) datapack.addQuery("users", [...queryGroup.users].join(','));
        if (queryGroup.places.size > 0) datapack.addQuery("places", [...queryGroup.places].join(','));

        let results = await this.storeController.find(datapack);

        if (results) {
            let resultGroups = new Array();
            for (let index in results) {
                let res = results[index];
                let resultGroup = new Group(res.id, res.name, null, res.tz);
                // Set scope using '_scope' to bypass type checking in 'scope's setter function
                resultGroup._scope = res.scope;
                // Parse users and places from comma separated strings and add each to the group
                if (res.users.length > 0) {
                    const users = res.users.split(',');
                    for (let userIndex in users) {
                        resultGroup.users.add(users[userIndex]);
                    }
                }

                if (res.places.length > 0) {
                    const places = res.places.split(',');
                    for (let placeIndex in places) {
                        resultGroup.places.add(places[placeIndex]);
                    }
                }

                resultGroups.push(resultGroup);
            }

            // Return an array of all found groups
            return resultGroups;
        } else {
            return false;
        }
    }

    // Overwrite the group specified by ID with values in updateGroup
    async update(groupid, updateGroup) {
        let datapack = new DataPack(this.store, "groups");
        datapack.key = 'id';
        datapack.addQuery("id", groupid);

        datapack.addValue("id", updateGroup.id);
        datapack.addValue("name", updateGroup.name);
        datapack.addValue("scope", updateGroup.scope);
        datapack.addValue("tz", updateGroup.tz);
        datapack.addValue("users", [...updateGroup.users].join(','));
        datapack.addValue("places", [...updateGroup.places].join(','));

        let updatedGroupID = await this.storeController.update(datapack);

        if (updatedGroupID) {
            APP.get('events').emit('groupupdate', updatedGroupID);
            return updatedGroupID;
        } else {
            return false;
        }
    }

    // Update all groups matching query values with values in updateGroup
    async findUpdate(queryGroup, updateGroup) {
        let datapack = new DataPack(this.store, "groups");
        datapack.key = 'id';
        if (queryGroup.id) datapack.addQuery("id", queryGroup.id);
        if (queryGroup.name) datapack.addQuery("name", queryGroup.name);
        if (queryGroup.scope) datapack.addQuery("scope", queryGroup.scope);
        if (queryGroup.tz) datapack.addQuery("tz", queryGroup.tz);
        if (queryGroup.users.size > 0) datapack.addQuery("users", [...queryGroup.users].join(','));
        if (queryGroup.places.size > 0) datapack.addQuery("places", [...queryGroup.places].join(','));

        if (updateGroup.id) datapack.addValue("id", updateGroup.id);
        if (updateGroup.name) datapack.addValue("name", updateGroup.name);
        if (updateGroup.scope) datapack.addValue("scope", updateGroup.scope);
        if (updateGroup.tz) datapack.addValue("tz", updateGroup.tz);
        if (updateGroup.users.size > 0) datapack.addValue("users", [...updateGroup.users].join(','));
        if (updateGroup.places.size > 0) datapack.addValue("places", [...updateGroup.places].join(','));

        let updatedGroupIDs = await this.storeController.findUpdate(datapack);

        if (updatedGroupIDs) {
            for (let groupid of updatedGroupIDs) {
                APP.get('events').emit('groupupdate', groupid);
            }

            return updatedGroupIDs;
        } else {
            return false;
        }
    }

    // Deletes a single group selected via its exact ID
    async delete(groupid) {
        let datapack = new DataPack(this.store, "groups");
        datapack.key = 'id';
        datapack.addQuery("id", groupid);

        let deletedGroupID = await this.storeController.delete(datapack);

        if (deletedGroupID) {
            APP.get('events').emit('groupdelete', deletedGroupID);

            return deletedGroupID;
        } else {
            return false;
        }
    }

    // Remove group(s) from storage matching the provided group
    async findDelete(queryGroup) {
        let datapack = new DataPack(this.store, "groups");
        datapack.key = 'id';
        if (queryGroup.id) datapack.addQuery("id", queryGroup.id);
        if (queryGroup.name) datapack.addQuery("name", queryGroup.name);
        if (queryGroup.scope) datapack.addQuery("scope", queryGroup.scope);
        if (queryGroup.tz) datapack.addQuery("tz", queryGroup.tz);
        if (queryGroup.users.size > 0) datapack.addQuery("users", [...queryGroup.users].join(','));
        if (queryGroup.places.size > 0) datapack.addQuery("places", [...queryGroup.places].join(','));

        let deletedGroupIDs = await this.storeController.findDelete(datapack);

        if (deletedGroupIDs) {
            for (let groupid of deletedGroupIDs) {
                APP.get('events').emit('groupdelete', groupid);
            }

            return deletedGroupIDs;
        } else {
            return false;
        }
    }

    // Retrieves all groups
    async all() {
        let datapack = new DataPack(this.store, "groups");

        let results = await this.storeController.all(datapack);

        if (results) {
            let resultGroups = new Array();
            for (let index in results) {
                let res = results[index];
                let resultGroup = new Group(res.id, res.name, null, res.tz);
                // Set scope using '_scope' to bypass type checking in 'scope's setter function
                resultGroup._scope = res.scope;
                // Parse users and places from comma separated strings and add each to the group
                if (res.users.length > 0) {
                    const users = res.users.split(',');
                    for (let userIndex in users) {
                        resultGroup.users.add(users[userIndex]);
                    }
                }

                if (res.places.length > 0) {
                    const places = res.places.split(',');
                    for (let placeIndex in places) {
                        resultGroup.places.add(places[placeIndex]);
                    }
                }

                resultGroups.push(resultGroup);
            }

            // Return an array of all found groups
            return resultGroups;
        } else {
            return false;
        }
    }

    // Deletes all group entries
    async clear() {
        let datapack = new Datapack(this.store, "groups");

        await this.storeController.clear(datapack);
        return true;
    }

    // Delete all groups that are part of the given scope (specified by ID)
    async deleteScope(scopeid) {
        let qGroup = new Group();
        qGroup._scope = scopeid;
        return await this.findDelete(qGroup);
    }

    // Retreive all groups of which the given user (specified by ID) is a member
    async findUserMemberships(userid) {
        let qGroup = new Group();
        qGroup._scope = null;
        qGroup.users.add(userid);

        let results = await this.find(qGroup);

        if (results) {
            return results;
        } else {
            return false;
        }
    }

    // Retreive all groups of which the given place (specified by ID) is a member
    async findPlaceMemberships(placeid) {
        let qGroup = new Group();
        qGroup._scope = null;
        qGroup.places.add(placeid);

        let results = await this.find(qGroup);

        if (results) {
            return results;
        } else {
            return false;
        }
    }

    // Removes a user specified by ID from all groups it was a member of
    async deleteMemberUser(userid) {
        let memberships = await this.findUserMemberships(userid);

        if (memberships) {
            for (let group of memberships) {
                group.removeUser(userid);

                await this.update(group.id, group);
            }
        }
    }

    // Removes a place specified by ID from all groups it was a member of
    async deleteMemberPlace(placeid) {
        let memberships = await this.findPlaceMemberships(placeid);

        if (memberships) {
            for (let group of memberships) {
                group.removePlace(placeid);

                await this.update(group.id, group);
            }
        }
    }

    // Sets up a new container for group storage
    async setup() {
        let datapack = new DataPack(this.store, "groups");
        datapack.addValue("id", "TEXT PRIMARY KEY");
        datapack.addValue("name", "TEXT");
        datapack.addValue("scope", "TEXT");
        datapack.addValue("tz", "TEXT");
        datapack.addValue("users", "TEXT");
        datapack.addValue("places", "TEXT");
        await this.storeController.newStore(datapack);
        await this.storeController.newContainer(datapack);
        return true;
    }

    // Removes/deletes the groups container
    async raze() {
        let datapack = new DataPack(this.store, "groups");

        await this.storeController.deleteContainer(datapack);
        return true;
    }
}

module.exports = { GroupManager };