const { APP } = require('../../managers/GlobalManager');
const path = require('node:path');
const fs = require('fs');

class JSONController {
    constructor() {
        this.location = __dirname;
        this.store = "data";
    }

    async exists(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        
        try {
            await fs.promises.access(container);
            return true;
        } catch {
            return false;
        }
    }

    async add(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));
        filecontents[datapack.values[datapack.key]] = datapack.values;
        fs.writeFileSync(container, JSON.stringify(filecontents, null, 2));
        return datapack.values[datapack.key];
    }

    // Get a single entry directly using its key
    async get(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));

        if (datapack.queries[datapack.key] in filecontents) {
            return filecontents[datapack.queries[datapack.key]];
        } else {
            return false;
        }
    }

    // Get all entries that match the provided query values
    async find(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));

        let results = new Array();

        for (let entry of Object.values(filecontents)) {
            var valid = true;
            for (let prop of Object.entries(datapack.queries)) {
                if (prop[1] != null) {
                    let proptype = typeof entry[prop[0]];
                    switch (proptype) {
                        case 'string':
                            if (!entry[prop[0]].includes(prop[1].toLowerCase())) {
                                valid = false;
                            }
                            break;
                        default:
                            if (entry[prop[0]] != prop[1]) {
                                valid = false;
                            }
                    }
                }
            }
            if (valid) {
                results.push(entry)
            }
        }

        if (results.length > 0) {
            return results;
        } else {
            return false;
        }
    }

    async update(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));

        let thisObj = filecontents[datapack.queries[datapack.key]];

        if (thisObj) {
            filecontents[datapack.queries[datapack.key]] = datapack.values;
            fs.writeFileSync(container, JSON.stringify(filecontents, null, 2));

            return thisObj[datapack.key];
        } else {
            return false;
        }
    }

    async findUpdate(datapack) {
        let updates = new Array();

        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));

        for (let entry of Object.values(filecontents)) {
            var valid = true;
            for (let prop of Object.entries(datapack.queries)) {
                if (prop[1] != null) {
                    let proptype = typeof entry[prop[0]];
                    switch (proptype) {
                        case 'string':
                            if (!entry[prop[0]].includes(prop[1].toLowerCase())) {
                                valid = false;
                            }
                            break;
                        default:
                            if (entry[prop[0]] != prop[1]) {
                                valid = false;
                            }
                    }
                }
            }
            if (valid) {
                for (let prop of Object.entries(datapack.values)) {
                    if (prop[1] != null) {
                        entry[prop[0]] = prop[1];
                    }
                }
                filecontents[entry[datapack.key]] = entry;
                updates.push(entry[datapack.key]);
            }
        }

        if (updates.length > 0) {
            fs.writeFileSync(container, JSON.stringify(filecontents, null, 2));
            return updates;
        } else {
            return false;
        }
    }

    async delete(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));

        if (datapack.queries[datapack.key] in filecontents) {
            delete filecontents[datapack.queries[datapack.key]];
            fs.writeFileSync(container, JSON.stringify(filecontents, null, 2));
            return datapack.queries[datapack.key];
        } else {
            return false;
        }
    }

    async findDelete(datapack) {
        let deletes = new Array();

        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));

        for (let entry of Object.values(filecontents)) {
            var valid = true;
            for (let prop of Object.entries(datapack.queries)) {
                if (prop[1] != null) {
                    let proptype = typeof entry[prop[0]];
                    switch (proptype) {
                        case 'string':
                            if (!entry[prop[0]].includes(prop[1].toLowerCase())) {
                                valid = false;
                            }
                            break;
                        default:
                            if (entry[prop[0]] != prop[1]) {
                                valid = false;
                            }
                    }
                }
            }
            if (valid) {
                delete filecontents[entry[datapack.key]];
                deletes.push(entry[datapack.key]);
            }
        }

        if (deletes.length > 0) {
            fs.writeFileSync(container, JSON.stringify(filecontents, null, 2));
            return deletes;
        } else {
            return false;
        }
    }

    async all(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        
        let filecontents = JSON.parse(fs.readFileSync(container, 'utf-8'));

        let results = [...Object.values(filecontents)];

        if (results.length > 0) {
            return results;
        } else {
            return false;
        }
    }

    async clear(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        await fs.promises.writeFile(container, JSON.stringify({}, null, 2));
        return true;
    }

    async newContainer(datapack) {
        if (!await this.exists(datapack)) {
            let file = datapack.container.concat('.json');
            let container = path.join(APP.get('projectroot'), this.store, file);
            await fs.promises.writeFile(container, JSON.stringify({}, null, 2));
            return true;
        } else {
            return false;
        }
    }

    async deleteContainer(datapack) {
        let file = datapack.container.concat('.json');
        let container = path.join(APP.get('projectroot'), this.store, file);
        try {
            fs.unlinkSync(container);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = { JSONController };