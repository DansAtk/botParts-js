/*
    Main
*/


const { BotController } = require('./core/BotController');
const { BasicInputProcessor } = require('./front/BasicInputProcessor');
const { BasicOutputProcessor } = require('./front/BasicOutputProcessor');
//const { OneShotInputProcessor } = require('./front/OneShotInputProcessor');
//const { OneShotOutputProcessor } = require('./front/OneShotOutputProcessor');
const { ChatTheme } = require('./front/theme/ChatTheme');
//const { BareTheme } = require('./front/theme/BareTheme');

let bot = new BotController();

let outputProcessor = new BasicOutputProcessor(bot, ChatTheme);
let inputProcessor = new BasicInputProcessor(bot);
//let outputProcessor = new OneShotOutputProcessor(bot, BareTheme);
//let inputProcessor = new OneShotInputProcessor(bot);

// For handling unexpected shutdown via keyboard interrupt

process.on('SIGINT', cleanup);

function cleanup() {
    console.log("");
    bot.cleanup();
    process.exit(0);
}
