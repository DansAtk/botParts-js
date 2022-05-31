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
const { ChatTheme } = require('./io/themes/ChatTheme');
const { SQLiteController } = require('./data/storage/controllers/SQLiteController');
const { JSONController } = require('./data/storage/controllers/JSONController');
const { Dispatcher } = require('./commands/Dispatcher');
const { CommandManager } = require('./commands/CommandManager');
const { BUIDManager } = require('./data/managers/BUIDManager');
const path = require('node:path');
const { ConfigManager } = require('./data/managers/ConfigManager');


class BotController {
    constructor() {
        APP.add('projectroot', path.join(__dirname, '..'))
        APP.add('configdir', 'config');
        APP.add('datadir', 'data');
        APP.add('data', new SQLiteController());
        APP.add('config', new JSONController());
        APP.add('cfgmgr', new ConfigManager());
        APP.add('buids', new BUIDManager());
        APP.add('groups', new GroupManager());
        APP.add('users', new UserManager());
        APP.add('places', new PlaceManager());
        APP.add('commands', new CommandManager());
        APP.add('dispatcher', new Dispatcher());

        APP.add('logging', new LogAdapter());
        APP.add('output', new BasicOutputAdapter(ChatTheme));
        APP.add('input', new BasicInputAdapter());

        APP.get('events').on('inmessage', (message) => APP.get('dispatcher').parse(message));
        APP.get('events').on('shutdown', this.cleanup);
    }

    async start() {
        await APP.get('cfgmgr').setup();
        await APP.get('cfgmgr').add('configstore', {'directory': 'config', 'controller': 'JSON'});
        await APP.get('cfgmgr').add('datastore', {'directory': 'data', 'controller': 'SQLite'});
        //await APP.get('cfgmgr').findUpdate('datastore', 'controller', 'SQLite');
        //console.log(await APP.get('cfgmgr').all('datastore'));
        //console.log(await APP.get('cfgmgr').get('datastore', 'controller'));
        //console.log(await APP.get('cfgmgr').update('configstore', {'directory': 'config', 'controller': 'JSON'}));
        //await APP.get('cfgmgr').raze();
        await APP.get('buids').setup();
        await APP.get('groups').setup();
        await APP.get('users').setup();
        await APP.get('places').setup();
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