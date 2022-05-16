/*
    A prototype for providing id and scope properties to its inheritors.
*/


class ScopedObject {
    constructor(id = null, scope = null, name = null) {
        this.id = id;
        this.scope = scope;
        this.name = name;
    }
}

module.exports = { ScopedObject };