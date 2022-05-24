const { APP } = require('./GlobalManager');
const { v4: uuidv4 } = require('uuid');
const { GLOBAL } = require('../models/core/Scope');
const { User, BOTUSER } = require('../models/core/User');
const { DataManager } = require("./DataManager");
const { DataPack } = require('../storage/DataPack');

class UserManager extends DataManager {
    constructor() {
        super();
        APP.add('users', this);

        APP.get('events').on('placedelete', (scopeid) => {
            this.deleteScope(scopeid);
        })
    }

    // Generate a new user with an ID not yet used
    async new(
        name = null,
        scope = GLOBAL,
        tz = null,
        bday = null,
        country = null,
        points = null
    ) {
        let id = uuidv4();

        while (await this.get(id)) {
            id = uuidv4();
        }

        return new User(id, name, scope, tz, bday, country, points);
    }

    // Create an entry for a new user in storage
    async add(newUser) {
        // Build a datapack from the passed user
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        datapack.addValue("id", newUser.id);
        datapack.addValue("name", newUser.name);
        datapack.addValue("scope", newUser.scope);
        datapack.addValue("tz", newUser.tz);
        datapack.addValue("bday", newUser.bday);
        datapack.addValue("country", newUser.country);
        datapack.addValue("points", newUser.points);

        // Submit request for storage of the datapack to the storage manager
        let newUserID = await APP.get('store').add(datapack);

        if (newUserID) {
            APP.get('events').emit('useradd', newUserID);
            return newUserID;
        } else {
            return false;
        }
    }

    // Get a single user directly via its ID
    async get(userid) {
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        datapack.addQuery('id', userid);

        let result = await APP.get('store').get(datapack);

        if (result) {
            let resultUser = new User(result.id, result.name, null, result.tz, result.bday, result.country, result.points);
            resultUser._scope = result.scope;
            return resultUser;
        } else {
            return false;
        }
    }

    // Find users from storage that have values matching the provided user object
    async find(queryUser) {
        // Build a datapack from the passed user object, using its values as a query
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        datapack.addQuery("id", queryUser.id);
        datapack.addQuery("name", queryUser.name);
        datapack.addQuery("scope", queryUser.scope);
        datapack.addQuery("tz", queryUser.tz);
        datapack.addQuery("bday", queryUser.bday);
        datapack.addQuery("country", queryUser.country);
        datapack.addQuery("points", queryUser.points);

        // Submit query to storage manager
        let results = await APP.get('store').find(datapack);

        // Repackage results back into User objects and store them in an array
        if (results) {
            let resultUsers = new Array();
            for (let index in results) {
                let res = results[index];
                let resultUser = new User(res.id, res.name, null, res.tz, res.bday, res.country, res.points);
                // Set scope using '_scope' to bypass type checking in 'scope's setter function.
                resultUser._scope = res.scope;
                resultUsers.push(resultUser);
            }

            // Return an array of all found users
            return resultUsers;
        } else {
            return false;
        }
    }

    // Update the values supplied in updateUser to the user with the exact ID specified
    async update(userid, updateUser) {
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        datapack.addQuery("id", userid);

        datapack.addValue("id", updateUser.id);
        datapack.addValue("name", updateUser.name);
        datapack.addValue("scope", updateUser.scope);
        datapack.addValue("tz", updateUser.tz);
        datapack.addValue("bday", updateUser.bday);
        datapack.addValue("country", updateUser.country);
        datapack.addValue("points", updateUser.points);

        // Submit update request to storage manager
        let updatedUserID = await APP.get('store').update(datapack);

        if (updatedUserID) {
            APP.get('events').emit('userupdate', updatedUserID);

            return updatedUserID;
        } else {
            return false;
        }
    }

    // Update the values supplied in updateUser to all matching 
    async findUpdate(queryUser, updateUser) {
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        datapack.addQuery("id", queryUser.id);
        datapack.addQuery("name", queryUser.name);
        datapack.addQuery("scope", queryUser.scope);
        datapack.addQuery("tz", queryUser.tz);
        datapack.addQuery("bday", queryUser.bday);
        datapack.addQuery("country", queryUser.country);
        datapack.addQuery("points", queryUser.points);

        datapack.addValue("id", updateUser.id);
        datapack.addValue("name", updateUser.name);
        datapack.addValue("scope", updateUser.scope);
        datapack.addValue("tz", updateUser.tz);
        datapack.addValue("bday", updateUser.bday);
        datapack.addValue("country", updateUser.country);
        datapack.addValue("points", updateUser.points);

        // Submit update request to storage manager
        let updatedUserIDs = await APP.get('store').findUpdate(datapack);

        if (updatedUserIDs) {
            for (let userid of updatedUserIDs) {
                APP.get('events').emit('userupdate', userid);
            }

            return updatedUserIDs;
        } else {
            return false;
        }
    }

    // Deletes a single user selected via its exact ID
    async delete(userid) {
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        datapack.addQuery("id", userid);

        let deletedUserID = await APP.get('store').delete(datapack);

        if (deletedUserID) {
            APP.get('events').emit('userdelete', deletedUserID);

            return deletedUserID;
        } else {
            return false;
        }
    }

    // Remove user(s) from storage matching the provided user
    async findDelete(queryUser) {
        // Build a datapack using the passed in user for query values
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        datapack.addQuery("id", queryUser.id);
        datapack.addQuery("name", queryUser.name);
        datapack.addQuery("scope", queryUser.scope);
        datapack.addQuery("tz", queryUser.tz);
        datapack.addQuery("bday", queryUser.bday);
        datapack.addQuery("country", queryUser.country);
        datapack.addQuery("points", queryUser.points);

        // Submit removal request to storage manager
        let deletedUserIDs = await APP.get('store').findDelete(datapack);

        if (deletedUserIDs) {
            for (let userid of deletedUserIDs) {
                APP.get('events').emit('userdelete', userid);
            }

            return deletedUserIDs;
        } else {
            return false;
        }
    }

    // Deletes all users with the given scope
    async deleteScope(scopeid) {
        let qUser = new User();
        qUser._scope = scopeid;
        return await this.findDelete(qUser);
    }

    // Sets up a new container for user storage
    async init() {
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.addValue("id", "TEXT PRIMARY KEY");
        datapack.addValue("name", "TEXT");
        datapack.addValue("scope", "TEXT");
        datapack.addValue("tz", "TEXT");
        datapack.addValue("bday", "TEXT");
        datapack.addValue("country", "TEXT");
        datapack.addValue("points", "INTEGER");
        await APP.get('store').newContainer(datapack);
        this.add(BOTUSER);
        return true;
    }
}

module.exports = { UserManager };