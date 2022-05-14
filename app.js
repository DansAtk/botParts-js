/*
    Main
*/


const { BotController } = require('./core/BotController');
const { LogProcessor } = require('./core/LogProcessor');
const { BasicOutputProcessor } = require('./front/BasicOutputProcessor');
const { BasicInputProcessor } = require('./front/BasicInputProcessor');
//const { OneShotInputProcessor } = require('./front/OneShotInputProcessor');
//const { OneShotOutputProcessor } = require('./front/OneShotOutputProcessor');
//const { LogTheme } = require('./front/theme/LogTheme');
const { ChatTheme } = require('./front/theme/ChatTheme');
//const { BareTheme } = require('./front/theme/BareTheme');

let bot = new BotController();

bot.logProcess = new LogProcessor(bot);
bot.outProcess = new BasicOutputProcessor(bot, ChatTheme);
bot.inProcess = new BasicInputProcessor(bot);
//bot.outProcess = new OneShotOutputProcessor(bot, BareTheme);
//bot.inProcess = new OneShotInputProcessor(bot);

bot.init();

// For handling unexpected shutdown via keyboard interrupt

process.on('SIGINT', cleanup);

function cleanup() {
    console.log("");
    bot.cleanup();
    process.exit(0);
}
