const { APP } = require('./GlobalManager');
const { ConfigController } = require('../storage/controllers/ConfigController');
const path = require('node:path');
const readlineSync = require('readline-sync');

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

    update(configname, updateConfig) {
        this.config.set(configname, updateConfig);
        return configname;
    }

    updateProperty(configname, property, newValue) {
        let entry = this.config.get(configname);
        if (entry != undefined) {
            entry[property] = newValue;
            return configname;
        } else {
            return false;
        }
    }

    remove(configname) {
        this.config.delete(configname);
        return configname;
    }

    removeProperty(configname, property) {
        let entry = this.config.get(configname);
        if (entry != undefined) {
            entry.get(configname).delete(property);
            return configname;
        } else {
            return false;
        }
    }

    all() {
        return this.config;
    }

    clear() {
        this.config.clear();
    }

    async create(configname) {
        let entry = this.config.get(configname);
        if (entry != undefined) {
            return await this.controller.add(configname, entry);
        } else {
            return false;
        }
    }

    async load(configname) {
        let entry = await this.controller.get(configname);
        if (entry) {
            this.update(configname, entry);
            return configname;
        } else {
            return false;
        }
    }

    async save(configname) {
        let entry = this.config.get(configname);
        if (entry != undefined) {
            return await this.controller.update(configname, entry);
        } else {
            return false;
        }
    }

    async setup() {
        this.add('global',
            {
                'root': path.join(__dirname, '../../..'),
                'configdir': 'config'
            });

        await this.controller.setup();

        if (!await this.load('global')) {
            console.log('Data storage config not found!');

            let accepted = false;

            let controllers = ['SQLITE', 'JSON', 'MEMORY'];
            let datamethod = readlineSync.keyInSelect(controllers, `Choose storage method`, {cancel: 'EXIT'});

            if (datamethod < 0) {
                process.exit(0);
            }

            this.updateProperty('global', 'datacontroller', controllers[datamethod]);
            console.log('');

            //console.log(`Data storage settings\nDirectory: ${this.getProperty('global', 'datadir')}\nMethod: ${this.getProperty('global', 'datacontroller')}`);

            //console.log('');
                //let response = readlineSync.keyIn(`Accept this configuration? (q to quit) ` );

                //if (response == 'q') {
                    //process.exit(0);
                //} else if (response == 'y') {
                    //accepted = true;
                //}
            //}
            console.log('');

            await this.save('global');
        }
    }
}

module.exports = { ConfigManager };