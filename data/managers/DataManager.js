class DataManager {
    constructor(storage = null, owner = null, name = null) {
        this.storage = storage;
        this.data = new Map();
    }

    init() {
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

    create(obj) {
        // Create new entry in storage
        if (this.storage) {
            return this.storage.create(obj);
        } else {
            return false;
        }
    }

    get(query) {
        // Read data from data
        return this.data.has(query) ? this.data.get(query) : false;
    }

    read(query) {
        // Read data from storage
        if (this.storage) {
            return this.storage.read(query);
        } else {
            return false;
        }
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

    update(query, obj) {
        // Update an entry in storage
        if (this.storage) {
            return this.storage.update(query, obj);
        } else {
            return false;
        }
    }

    remove(obj) {
        // Delete entry from data
        return this.data.delete(obj);
    }

    delete(query) {
        // Delete entry from storage
        if (this.storage) {
            return this.storage.delete(query);
        } else {
            return false;
        }
    }
}

module.exports = { DataManager };