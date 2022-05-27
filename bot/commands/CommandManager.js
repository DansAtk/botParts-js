const { APP } = require('../data/managers/GlobalManager');
const { GLOBAL } = require('../data/models/Place');
const { TesterEcho } = require('./testers/echo');
const { TesterFake } = require('./testers/fake');
const { TesterNotReal } = require('./testers/notreal');
const { TesterOngoing } = require('./testers/ongoing');
const { TesterRandomUser } = require('./testers/randomuser');
const { UserC } = require('./user/UserC');
const { PlaceC } = require('./place/PlaceC');

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
        this.add(new TesterOngoing());
        this.add(new UserC());
        this.add(new PlaceC());
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