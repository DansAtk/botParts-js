const EventEmitter = require('events');

class GlobalManager {
    constructor() {
        this.data = new Map();
        this.add('events', new EventEmitter());
    }
    add(key, obj) {
        // Create new entry in data
        if (this.data.has(key)) {
            return false;
        } else {
            this.data.set(key, obj);
            return true;
        }
    }

    get(query) {
        // Read data from data
        return this.data.has(query) ? this.data.get(query) : false;
    }

    edit(query, obj) {
        // Update an entry in data
        if (this.data.has(query)) {
            this.data.set(query, obj);
            return true;
        } else {
            return false;
        }
    }

    remove(obj) {
        // Delete entry from data
        return this.data.delete(obj);
    }
}

let APP = new GlobalManager();

module.exports = { APP };