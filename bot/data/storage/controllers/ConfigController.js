const { APP } = require('../../managers/GlobalManager');
const path = require('node:path');
const fs = require('fs');

class ConfigController {
    constructor() {
        this.root = APP.get('projectroot');
        this.store = APP.get('configdir');
    }

    async exists(testPath) {
        try {
            fs.accessSync(testPath, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    async add(configname, newConfig) {
        let file = path.join(this.root, this.store, configname.concat('.json'));

        if (!await this.exists(file)) {
            fs.writeFileSync(file, JSON.stringify(newConfig, null, 2));
            return configname;
        } else {
            return false;
        }
    }

    async addProperty(configname, property, newValue) {
        let contents = await this.get(configname);

        if (!contents) {
            contents[property] = newValue;

            fs.writeFileSync(file, JSON.stringify(contents, null, 2));

            return configname;
        } else {
            return false;
        }
    }

    async get(configname) {
        let file = path.join(this.root, this.store, configname.concat('.json'));

        if (await this.exists(file)) {
            let contents = JSON.parse(fs.readFileSync(file, 'utf-8'));

            if (contents) {
                return contents;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async getProperty(configname, property) {
        let contents = await this.get(configname);

        if (contents) {
            if (property in contents) {
                return contents[property];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async update(configname, updateConfig) {
        let file = path.join(this.root, this.store, configname.concat('.json'));

        try {
            fs.writeFileSync(file, JSON.stringify(updateConfig, null, 2));
            return configname;
        } catch {
            return false;
        }
    }

    async updateProperty(configname, property, newValue) {
        let contents = await this.get(configname);

        if (contents) {
            contents[property] = newValue;

            fs.writeFileSync(file, JSON.stringify(contents, null, 2));

            return configname;
        } else {
            return false;
        }
    }

    async delete(configname) {
        let file = path.join(this.root, this.store, configname.concat('.json'));

        try {
            fs.unlinkSync(file);
            return true;
        } catch {
            return false;
        }
    }

    async deleteProperty(configname, property) {
        let contents = await this.get(configname);

        if (contents) {
            delete contents[property];

            return await this.update(configname, contents);
        } else {
            return false;
        }
    }

    async all() {
        let datapack = new DataPack(this.store, configname, null);
        return await this.storeController.get(datapack);
    }

    async clear(configname) {
        return await this.update(configname, {});
    }

    async setup() {
        let folder = path.join(this.root, this.store);
        if (!await this.exists(folder)) {
            fs.mkdirSync(folder);
            return true;
        } else {
            return false;
        }
    }

    async teardown() {
        let folder = path.join(this.root, this.store);
        if (await this.exists(folder)) {
            fs.rmSync(folder, { recursive: true, force: true });
            return true;
        } else {
            return false;
        }
    }
}

module.exports = { ConfigController };