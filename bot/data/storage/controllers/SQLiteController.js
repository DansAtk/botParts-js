const { APP } = require('../../managers/GlobalManager');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('node:path');
const fs = require('fs');
const readlineSync = require('readline-sync');

class SQLiteController {
    constructor() {
        this.root;
        this.store;
        this.file;
    }

    async exists(testPath) {
        try {
            fs.accessSync(testPath, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    async add(datapack) {
        const db = await open({
            filename: path.join(this.root, this.store, this.file),
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
            filename: path.join(this.root, this.store, this.file),
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
            filename: path.join(this.root, this.store, this.file),
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
            filename: path.join(this.root, this.store, this.file),
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
            filename: path.join(this.root, this.store, this.file),
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

        let updatedEntries = await this.find(datapack);

        await db.run(sqlString, values);

        await db.close()

        if (updatedEntries.length > 0) {
            return updatedEntries.map(entry => {
                return entry[datapack.key];
            });
        } else {
            return false;
        }
    }

    async delete(datapack) {
        const db = await open({
            filename: path.join(this.root, this.store, this.file),
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
            filename: path.join(this.root, this.store, this.file),
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

        let deletedEntries = await this.find(datapack);

        await db.run(sqlString, values);

        await db.close();

        if (deletedEntries.length > 0) {
            return deletedEntries.map(entry => {
                return entry[datapack.key];
            });
        } else {
            return false;
        }
    }

    async all(datapack) {
        const db = await open({
            filename: path.join(this.root, this.store, this.file),
            driver: sqlite3.Database
        });

        let sqlString = `SELECT * FROM ${datapack.container}`;

        let results = await db.all(sqlString);

        await db.close();

        if (results.length > 0) {
            return results;
        } else {
            return false;
        }
    }

    async clear(datapack) {
        const db = await open({
            filename: path.join(this.root, this.store, this.file),
            driver: sqlite3.Database
        });

        let sqlString = `DELETE FROM ${datapack.container}`;

        await db.run(swlString);

        await db.close();

        return true;
    }

    async newStore(datapack) {
        let folder = path.join(this.root, this.store);
        if (!await this.exists(folder)) {
            fs.mkdirSync(folder);
            return true;
        } else {
            return false;
        }
    }

    async deleteStore(datapack) {
        let folder = path.join(this.root, this.store);
        if (await this.exists(folder)) {
            fs.rmSync(folder, { recursive: true, force: true });
            return true;
        } else {
            return false;
        }
    }

    async newContainer(datapack) {
        const db = await open({
            filename: path.join(this.root, this.store, this.file),
            driver: sqlite3.Database
        });

        let newFields = Object.entries(datapack.values).map(property => `${property[0]} ${property[1]}`).join(', ');

        let sqlString = `CREATE TABLE IF NOT EXISTS ${datapack.container} (${newFields})`;

        await db.run(sqlString);

        await db.close();

        return true;
    }

    async deleteContainer(datapack) {
        const db = await open({
            filename: path.join(this.root, this.store, this.file),
            driver: sqlite3.Database
        });

        let sqlString = `DROP TABLE ${datapack.container}`;

        await db.run(sqlString);

        await db.close();

        return true;
    }

    async setup() {
        this.root = APP.get('configs').getProperty('global', 'root');

        if (!await APP.get('configs').load('sqlite')) {
            APP.get('configs').add('sqlite', {});

            console.log('SQLite config not found!');

            let datadir = readlineSync.question(`Set directory (default: data) `, {
                defaultInput: 'data'
            });
            APP.get('configs').updateProperty('sqlite', 'directory', datadir);
            console.log('');

            let filename = readlineSync.question(`Set database name (default: data) `, {
                defaultInput: 'data'
            });
            APP.get('configs').updateProperty('sqlite', 'filename', filename);
            console.log('');
        }

        this.store = APP.get('configs').getProperty('sqlite', 'directory');
        this.file = APP.get('configs').getProperty('sqlite', 'filename').concat('.db');
        await APP.get('configs').save('sqlite');
    }
}

module.exports = { SQLiteController };