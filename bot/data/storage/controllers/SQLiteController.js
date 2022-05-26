const { APP } = require('../../managers/GlobalManager');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('node:path');

class SQLiteController {
    constructor() {
    }

    async add(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        let values = new Array();

        let queryNames = Object.keys(datapack.values);
        let queryNamesString = queryNames.join(', ');
        let queryVarsString = new Array(queryNames.length).fill('?').join(', ');

        queryNames.forEach(field => {
            values.push(datapack.values[field]);
        });

        let sqlString = `INSERT INTO ${datapack.container} (${queryNamesString}) VALUES (${queryVarsString})`;

        await db.run(sqlString, values);

        await db.close();

        return datapack.values[datapack.key];
    }

    // Get a single entry directly using its key
    async get(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        let sqlString = `SELECT * FROM ${datapack.container} WHERE ${datapack.key} = ?`;
        let result = await db.get(sqlString, datapack.queries[datapack.key]);

        if (result) {
            return result;
        } else {
            return false;
        }
    }

    // Get all entries that match the provided query values
    async find(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        let values = new Array();

        let queriesArray = Object.entries(datapack.queries);
        let queryFields = new Array();

        queriesArray.forEach(field => {
            if (field[1] != null) {
                if (typeof field[1] == 'string') {
                    queryFields.push(`LOWER(${field[0]}) LIKE ?`);
                    values.push(`%${field[1].toLowerCase()}%`);
                } else {
                    queryFields.push(`${field[0]} = ?`);
                    values.push(field[1]);
                }
            }
        });

        let queriesString = queryFields.join(' AND ');

        let sqlString = `SELECT * FROM ${datapack.container} WHERE ${queriesString}`;

        let results = await db.all(sqlString, values);

        await db.close();

        if (results.length > 0) {
            return results;
        } else {
            return false;
        }
    }

    async update(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        let values = new Array();

        let valuesArray = Object.entries(datapack.values);
        let valueFields = new Array();

        valuesArray.forEach(field => {
            if (field[1] != null) {
                valueFields.push(`${field[0]} = ?`);
                values.push(field[1]);
            }
        });

        let valuesString = valueFields.join(', ');

        values.push(datapack.queries[datapack.key]);

        let sqlString = `UPDATE ${datapack.container} SET ${valuesString} WHERE ${datapack.key} = ?`;

        let res = await db.run(sqlString, values);

        await db.close();

        if (res.changes > 0) {
            return datapack.queries[datapack.key];
        } else {
            return false;
        }
    }

    async findUpdate(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        console.log(datapack.values);
        console.log(datapack.queries);

        let values = new Array();

        let valuesArray = Object.entries(datapack.values);
        let valueFields = new Array();

        valuesArray.forEach(field => {
            if (field[1] != null) {
                valueFields.push(`${field[0]} = ?`);
                values.push(field[1]);
            }
        });

        let valuesString = valueFields.join(', ');

        let queriesArray = Object.entries(datapack.queries);
        let queryFields = new Array();

        queriesArray.forEach(field => {
            if (field[1] != null) {
                if (typeof field[1] == 'string') {
                    queryFields.push(`LOWER(${field[0]}) LIKE ?`);
                    values.push(`%${field[1].toLowerCase()}%`);
                } else {
                    queryFields.push(`${field[0]} = ?`);
                    values.push(field[1]);
                }
            }
        });

        let queriesString = queryFields.join(' AND ');

        let sqlString = `UPDATE ${datapack.container} SET ${valuesString} WHERE ${queriesString}`;

        let updatedUsers = await this.find(datapack);

        await db.run(sqlString, values);

        await db.close()

        if (updatedUsers.length > 0) {
            return updatedUsers.map(user => {
                return user.id;
            });
        } else {
            return false;
        }
    }

    async delete(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        let values = datapack.queries[datapack.key];

        let sqlString = `DELETE FROM ${datapack.container} WHERE ${datapack.key} = ?`;

        let res = await db.run(sqlString, values);

        await db.close();

        if (res.changes > 0) {
            return datapack.queries[datapack.key];
        } else {
            return false;
        }
    }

    async findDelete(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        let values = new Array();

        let queriesArray = Object.entries(datapack.queries);
        let queryFields = new Array();

        queriesArray.forEach(field => {
            if (field[1] != null) {
                if (typeof field[1] == 'string') {
                    queryFields.push(`LOWER(${field[0]}) LIKE ?`);
                    values.push(`%${field[1].toLowerCase()}%`);
                } else {
                    queryFields.push(`${field[0]} = ?`);
                    values.push(field[1]);
                }
            }
        });

        let queriesString = queryFields.join(' AND ');

        let sqlString = `DELETE FROM ${datapack.container} WHERE ${queriesString}`;

        let deletedUsers = await this.find(datapack);

        await db.run(sqlString, values);

        await db.close();

        if (deletedUsers.length > 0) {
            return deletedUsers.map(user => {
                return user.id;
            });
        } else {
            return false;
        }
    }

    async newStore(datapack) { }

    async newContainer(datapack) {
        const db = await open({
            filename: path.join(datapack.location, datapack.store),
            driver: sqlite3.Database
        });

        let newFields = Object.entries(datapack.values).map(property => `${property[0]} ${property[1]}`).join(', ');

        let sqlString = `CREATE TABLE IF NOT EXISTS ${datapack.container} (${newFields})`;

        await db.run(sqlString);

        await db.close();

        return true;
    }
}

module.exports = { SQLiteController };