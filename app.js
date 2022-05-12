/*
    Main
*/


const { BotController } = require('./core/BotController');
const { BasicInputProcessor } = require('./front/BasicInputProcessor');
const { OneShotInputProcessor } = require('./front/OneShotInputProcessor');

let bot = new BotController();
let inputProcessor = new BasicInputProcessor(bot);

// For handling unexpected shutdown via keyboard interrupt

process.on('SIGINT', cleanup);

function cleanup() {
    console.log("");
    bot.cleanup();
    process.exit(0);
}
