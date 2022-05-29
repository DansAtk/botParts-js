class DataPack {
    constructor(
        store = null,
        container = null,
        key = null,
        queries = null,
        values = null
    ) {
        this._store = store;
        this._container = container;
        this._key = key;
        this._queries = queries ? queries : {};
        this._values = values ? values : {};
    }

    set store(storeString) {
        if (typeof storeString == 'string' || storeString == null) {
            this._store = storeString;
        } else {
            throw `Store must be of type 'String' or null`;
        }
    }

    get store() {
        return this._store;
    }

    set container(containerString) {
        if (typeof containerString == 'string' || containerString == null) {
            this._container = containerString;
        } else {
            throw `Container must be of type 'String' or null`;
        }
    }

    get container() {
        return this._container;
    }

    set key(keyValue) {
        this._key = keyValue;
    }

    get key() {
        return this._key;
    }

    addQuery(name, value = null) {
        this._queries[name] = value;
    }

    addValue(name, value = null) {
        this._values[name] = value;
    }

    get queries() {
        return this._queries;
    }

    get values() {
        return this._values;
    }
}

module.exports = { DataPack };