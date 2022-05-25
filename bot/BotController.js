/*
    A class for managing jobs, handling bot events and passing messages around.
*/


const { APP } = require('./data/managers/GlobalManager');
const { PlaceManager } = require('./data/managers/PlaceManager');
const { UserManager } = require('./data/managers/UserManager');
const { GroupManager } = require('./data/managers/GroupManager');
const { LogAdapter } = require('./io/adapters/LogAdapter');
const { BasicOutputAdapter } = require('./io/adapters/Basic/BasicOutputAdapter');
const { BasicInputAdapter } = require('./io/adapters/Basic/BasicInputAdapter');
const { OneShotInputAdapter } = require('./io/adapters/OneShot/OneShotInputAdapter');
const { OneShotOutputAdapter } = require('./io/adapters/OneShot/OneShotOutputAdapter');
const { LogTheme } = require('./io/themes/LogTheme');
const { ChatTheme } = require('./io/themes/ChatTheme');
const { BareTheme } = require('./io/themes/BareTheme');
const { SQLiteController } = require('./data/storage/controllers/SQLiteController');

class BotController {
    constructor() {
        new GroupManager();
        new UserManager();
        new PlaceManager();
        new SQLiteController();

        APP.add('logging', new LogAdapter());

        // Uncomment to use REPL mode
        APP.add('output', new BasicOutputAdapter(ChatTheme));
        APP.add('input', new BasicInputAdapter());

        // Uncomment to use OneShot mode
        //APP.add('output', new OneShotOutputAdapter(BareTheme));
        //APP.add('input', new OneShotInputAdapter());

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