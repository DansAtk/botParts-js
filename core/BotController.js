/*
    A class for managing jobs, handling bot events and passing messages around.
*/


const { APP } = require('../data/managers/GlobalManager');
const { PlaceManager } = require('../data/managers/PlaceManager');
const { UserManager } = require('../data/managers/UserManager');
const { GroupManager } = require('../data/managers/GroupManager');
const { LogProcessor } = require('../front/processors/LogProcessor');
const { BasicOutputProcessor } = require('../front/processors/BasicOutputProcessor');
const { BasicInputProcessor } = require('../front/processors/BasicInputProcessor');
const { OneShotInputProcessor } = require('../front/processors/OneShotInputProcessor');
const { OneShotOutputProcessor } = require('../front/processors/OneShotOutputProcessor');
const { LogTheme } = require('../front/themes/LogTheme');
const { ChatTheme } = require('../front/themes/ChatTheme');
const { BareTheme } = require('../front/themes/BareTheme');
const SQLiteManager = require('../data/storage/SQLiteManager');

class BotController {
    constructor() {
        new GroupManager();
        new UserManager();
        new PlaceManager();
        new SQLiteManager();

        APP.add('logging', new LogProcessor());

        // Uncomment to use REPL mode
        APP.add('output', new BasicOutputProcessor(ChatTheme));
        APP.add('input', new BasicInputProcessor());

        // Uncomment to use OneShot mode
        //APP.add('output', new OneShotOutputProcessor(BareTheme));
        //APP.add('input', new OneShotInputProcessor());

        APP.get('events').on('shutdown', this.cleanup);
    }

    start() {
        APP.get('logging').init();
        APP.get('output').init();
        APP.get('input').init();
        APP.get('events').emit('logmessage', "");
    }

    cleanup() {
        APP.get('events').emit('logmessage', "Shutting down...");

        APP.get('input').cleanup();
        APP.get('output').cleanup();
        APP.get('logging').cleanup();
    }
}

module.exports = { BotController };