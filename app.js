/*
    Main
*/


const { APP } = require('./data/managers/GlobalManager');
const { BotController } = require('./core/BotController');

let bot = new BotController();

bot.start();

// For handling unexpected shutdown via keyboard interrupt

process.on('SIGINT', cleanup);

function cleanup() {
    APP.get('events').emit('logmessage', "");
    bot.cleanup();
    process.exit(0);
}
