const { APP } = require('../data/managers/GlobalManager');
const { GLOBAL } = require('../data/models/Place');
const { TesterEcho } = require('./testers/echo');
const { TesterFake } = require('./testers/fake');
const { TesterNotReal } = require('./testers/notreal');
const { TesterRandomUser } = require('./testers/randomuser');

class CommandManager {
    constructor() {
        this.data = new Map();
        this.init();
    }

    init() {
        this.add(new TesterRandomUser());
        this.add(new TesterEcho());
        this.add(new TesterFake());
        this.add(new TesterNotReal());
    }

    add(command) {
        this.data.set(command.name, command);
    }

    set(key, value) {
        this.data.set(key, value);
    }

    get(query) {
        return this.data.get(query);
    }

    has(query) {
        return this.data.has(query);
    }
}

module.exports = { CommandManager };