/*
    Main
*/


const { APP } = require('./bot/data/managers/GlobalManager');
const { BotController } = require('./bot/BotController');

let bot = new BotController();

APP.add('root', __dirname);

bot.start();

// For handling unexpected shutdown via keyboard interrupt
process.on('SIGINT', cleanup);

function cleanup() {
    APP.get('events').emit('logmessage', "");
    bot.cleanup();
    process.exit(0);
}
