const { APP } = require('./GlobalManager');
const { ConfigController } = require('../storage/controllers/ConfigController');

class ConfigManager {
    constructor() {
        this.config = new Map();
        this.controller = new ConfigController();
    }

    add(configname, newConfig) {
        if (this.config.get(configname) == undefined) {
            this.config.set(configname, newConfig);
            return configname;
        } else {
            return false;
        }
    }

    addProperty(configname, property, newValue) {
        let entry = this.config.get(configname);
        if (entry != undefined) {
            if (entry[property] == undefined) {
                entry[property] = newValue;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    get(configname) {
        return this.config.get(configname);
    }

    getProperty(configname, property) {
        let result = this.config.get(configname);
        return result != undefined ? result[property] : undefined;
    }

    async update() {
        //TODO
    }

    async updateProperty() {
        //TODO
    }

    async delete() {
        //TODO
    }

    async deleteProperty() {
        //TODO
    }

    async all() {
        //TODO
    }

    async clear() {
        //TODO
    }

    async setup() {
        //TODO
    }

    async teardown() {
        //TODO
    }
}

module.exports = { ConfigManager };