const { APP } = require('../../managers/GlobalManager');

class MemoryController {
    constructor() {
        this.data = new Map();
    }

    async add(datapack) {
        this.data.get(datapack.container).set(datapack.values[datapack.key], datapack.values);
        return datapack.values[datapack.key];
    }

    async get(datapack) {
        let result = this.data.get(datapack.container).get(datapack.queries[datapack.key]);

        if (result) {
            return result;
        } else {
            return false;
        }
    }

    async find(datapack) {
        let results = new Array();

        for (let entry of this.data.get(datapack.container).values()) {
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
                results.push(entry);
            }
        }

        if (results.length > 0) {
            return results;
        } else {
            return false;
        }
    }

    async update(datapack) {
        let thisObj = this.data.get(datapack.container).get(datapack.queries[datapack.key]);

        if (thisObj) {
            for (let prop of Object.entries(datapack.values)) {
                thisObj[prop[0]] = prop[1];
            }

            return thisObj[datapack.key];
        } else {
            return false;
        }
    }

    async findUpdate(datapack) {
        let updates = new Array();

        for (var [key, value] of this.data.get(datapack.container)) {
            let valid = true;
            for (let prop of Object.entries(datapack.queries)) {
                if (prop[1] != null) {
                    let proptype = typeof value[prop[0]];
                    switch (proptype) {
                        case 'string':
                            if (!value[prop[0]].includes(prop[1])) {
                                valid = false;
                            }
                            break;
                        default:
                            if (value[prop[0]] != prop[1]) {
                                valid = false;
                            }
                    }
                }
            }
            if (valid) {
                for (let prop of Object.entries(datapack.values)) {
                    if (prop[1] != null) {
                        value[prop[0]] = prop[1];
                    }
                }
                updates.push(key);
            }
        }

        if (updates.length > 0) {
            return updates;
        } else {
            return false;
        }
    }

    async delete(datapack) {
        if (await this.get(datapack)) {
            this.data.get(datapack.container).delete(datapack.queries[datapack.key]);
            return datapack.queries[datapack.key];
        } else {
            return false;
        }
    }

    async findDelete(datapack) {
        let updates = new Array();

        for (var [key, value] of this.data.get(datapack.container)) {
            let valid = true;
            for (let prop of Object.entries(datapack.queries)) {
                if (prop[1] != null) {
                    let proptype = typeof value[prop[0]];
                    switch (proptype) {
                        case 'string':
                            if (!value[prop[0]].includes(prop[1])) {
                                valid = false;
                            }
                            break;
                        default:
                            if (value[prop[0]] != prop[1]) {
                                valid = false;
                            }
                    }
                }
            }
            if (valid) {
                this.data.get(datapack.container).delete(key);
                updates.push(key);
            }
        }

        if (updates.length > 0) {
            return updates;
        } else {
            return false;
        }
    }

    async all(datapack) {
        let results = [...this.data.get(datapack.container).values()];

        if (results.length > 0) {
            return results;
        } else {
            return false;
        }
    }

    async clear(datapack) {
        this.data.get(datapack.container).clear();
        return true;
    }

    async newStore(datapack) {
        return true;
    }

    async deleteStore(datapack) {
        return true;
    }

    async newContainer(datapack) {
        this.data.set(datapack.container, new Map());
        return true;
    }

    async deleteContainer(datapack) {
        this.data.delete(datapack.container);
        return true;
    }

    async setup() {
        return true;
    }
}

module.exports = { MemoryController };