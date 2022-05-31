const { APP } = require('./GlobalManager');
const EventEmitter = require('events');
const { DataPack } = require('../storage/DataPack');

class ConfigManager {
    constructor() {
        //this.data = new Map();

        this.store = APP.get('configdir');
        this.storeController = APP.get('config');
    }

    async add(configname, newObject) {
        if (await this.make(configname)) {
            let datapack = new DataPack(this.store, configname, null, null, newObject);
            let newConfigID = await this.storeController.add(datapack);

            if (newConfigID == undefined) {
                return configname;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async get(configname, property) {
        let datapack = new DataPack(this.store, configname, null);
        let result = await this.storeController.get(datapack);

        if (result && result[property]) {
            return result[property];
        } else {
            return false;
        }
    }

    async update(configname, updateConfig) {
        let configObject = await this.all(configname);

        if (configObject) {
            let datapack = new DataPack(this.store, configname, null, null, updateConfig);
            let updatedConfigID = await this.storeController.update(datapack);

            if (updatedConfigID == undefined) {
                return configname;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async findUpdate(configname, property, newValue) {
        let configObject = await this.all(configname);

        if (configObject) {
            configObject[property] = newValue;

            let datapack = new DataPack(this.store, configname, null, null, configObject);
            let updatedConfigID = await this.storeController.update(datapack);

            if (updatedConfigID == undefined) {
                return property;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async delete(configname) {
        let datapack = new DataPack(this.store, configname);
        return await this.storeController.deleteContainer(datapack);
    }

    async findDelete(configname, property) {
        let configObject = await this.all(configname);

        if (configObject) {
            delete configObject[property];

            let datapack = new DataPack(this.store, configname, null, null, configObject);
            let deletedConfigID = await this.storeController.update(datapack);

            if (deletedConfigID == undefined) {
                return property;
            } else {
                return false;
            }
        }
    }

    async all(configname) {
        let datapack = new DataPack(this.store, configname, null);
        return await this.storeController.get(datapack);
    }

    async clear(configname) {
        return await this.update(configname, {});
    }

    async make(configname) {
        let datapack = new DataPack(this.store, configname);
        return await this.storeController.newContainer(datapack);
    }

    async setup() {
        let datapack = new DataPack(this.store);
        await this.storeController.newStore(datapack);

        return true;
    }

    async raze() {
        let datapack = new DataPack(this.store);
        return await this.storeController.deleteStore(datapack);
    }
}

module.exports = { ConfigManager };