const { APP } = require('./GlobalManager');
const { GLOBAL } = require('../models/Place');
const { User, BOTUSER } = require('../models/User');
const { DataPack } = require('../storage/DataPack');

class UserManager {
    constructor() {
        APP.get('events').on('placedelete', (scopeid) => {
            this.deleteScope(scopeid);
        })
    }

    // Generate a new User object with a unique ID
    async new(
        name = null,
        scope = GLOBAL,
        tz = null,
        bday = null,
        country = null,
        points = 0
    ) {
        let id = await APP.get('buids').new();

        return new User(id, name, scope, tz, bday, country, points);
    }

    // Create a new entry for a user
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

    // Find users that have properties matching the query user object
    async find(queryUser) {
        // Build a datapack from the passed user object, using its values as a query
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        if (queryUser.id) datapack.addQuery("id", queryUser.id);
        if (queryUser.name) datapack.addQuery("name", queryUser.name);
        if (queryUser.scope) datapack.addQuery("scope", queryUser.scope);
        if (queryUser.tz) datapack.addQuery("tz", queryUser.tz);
        if (queryUser.bday) datapack.addQuery("bday", queryUser.bday);
        if (queryUser.country) datapack.addQuery("country", queryUser.country);
        if (queryUser.points != null) datapack.addQuery("points", queryUser.points);

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

    // Overwrite the user specified by ID with values in updateUser
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

    // Update all users matching query values with values in updateUser
    async findUpdate(queryUser, updateUser) {
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.key = 'id';
        if (queryUser.id) datapack.addQuery("id", queryUser.id);
        if (queryUser.name) datapack.addQuery("name", queryUser.name);
        if (queryUser.scope) datapack.addQuery("scope", queryUser.scope);
        if (queryUser.tz) datapack.addQuery("tz", queryUser.tz);
        if (queryUser.bday) datapack.addQuery("bday", queryUser.bday);
        if (queryUser.country) datapack.addQuery("country", queryUser.country);
        if (queryUser.points != null) datapack.addQuery("points", queryUser.points);

        if (updateUser.id) datapack.addValue("id", updateUser.id);
        if (updateUser.name) datapack.addValue("name", updateUser.name);
        if (updateUser.scope) datapack.addValue("scope", updateUser.scope);
        if (updateUser.tz) datapack.addValue("tz", updateUser.tz);
        if (updateUser.bday) datapack.addValue("bday", updateUser.bday);
        if (updateUser.country) datapack.addValue("country", updateUser.country);
        if (updateUser.points != null) datapack.addValue("points", updateUser.points);

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
        if (queryUser.id) datapack.addQuery("id", queryUser.id);
        if (queryUser.name) datapack.addQuery("name", queryUser.name);
        if (queryUser.scope) datapack.addQuery("scope", queryUser.scope);
        if (queryUser.tz) datapack.addQuery("tz", queryUser.tz);
        if (queryUser.bday) datapack.addQuery("bday", queryUser.bday);
        if (queryUser.country) datapack.addQuery("country", queryUser.country);
        if (queryUser.points != null) datapack.addQuery("points", queryUser.points);

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

    // Retrieves all users
    async all() {
        let datapack = new DataPack(".", "testDB.db", "users");

        let results = await APP.get('store').all(datapack);

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

    // Deletes all user entries
    async clear() {
        let datapack = new DataPack(".", "testDB.db", "users");
    
        await APP.get('store').clear(datapack);
        return true;
    }

    // Delete all users that are part of the given scope (specified by ID)
    async deleteScope(scopeid) {
        let qUser = new User();
        qUser._scope = scopeid;
        return await this.findDelete(qUser);
    }

    // Adds points to a user and updates their entry with the new value
    async addPoints(userid, addition) {
        let user = await this.get(userid);
        user.points += addition;

        await this.update(user.id, user);
    }

    // Removes points from a user and updates their entry with the new value
    async removePoints(userid, subtraction) {
        let user = await this.get(userid);
        user.points -= subtraction;

        await this.update(user.id, user);
    }

    // Sets up a new container for user storage
    async setup() {
        let datapack = new DataPack(".", "testDB.db", "users");
        datapack.addValue("id", "TEXT PRIMARY KEY");
        datapack.addValue("name", "TEXT");
        datapack.addValue("scope", "TEXT");
        datapack.addValue("tz", "TEXT");
        datapack.addValue("bday", "TEXT");
        datapack.addValue("country", "TEXT");
        datapack.addValue("points", "INTEGER");
        await APP.get('store').newContainer(datapack);
        if (!(await this.get(BOTUSER.id))) await this.add(BOTUSER);
        return true;
    }

    // Removes/deletes the users container
    async raze() {
        let datapack = new DataPack(".", "testDB.db", "users");

        await APP.get('store').deleteContainer(datapack);
        return true;
    }
}

module.exports = { UserManager };