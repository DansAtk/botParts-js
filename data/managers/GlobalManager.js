const { DataManager } = require("./DataManager");
const EventEmitter = require('events');

class GlobalManager extends DataManager {
    constructor() {
        super();
        this.data = new Map();
        this.add('events', new EventEmitter());
    }
}

let APP = new GlobalManager();

module.exports = { APP };