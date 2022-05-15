/*
    A prototype for providing id and scope properties to its inheritors.
*/


class ScopedObject {
    constructor(id = null, scope = null) {
        this.id = id;
        this.scope = scope;
    }
}

module.exports = { ScopedObject };