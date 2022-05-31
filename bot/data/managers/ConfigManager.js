const { APP } = require('./GlobalManager');
const { DataPack } = require('../storage/DataPack');
const { ConfigController } = require('../storage/controllers/ConfigController');

class ConfigManager {
    constructor() {
        this.config = new Map();
        this.controller = new ConfigController();
    }

    async add() {
        //TODO
    }

    async get() {
        //TODO
    }

    async getProperty() {
        //TODO
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