/*
    A class for managing jobs, handling bot events and passing messages around.
*/


const { APP } = require('../data/managers/GlobalManager');

class BotController {
    constructor() {
        this.logProcess = null;
        this.outProcess = null;
        this.inProcess = null;
        APP.on('shutdown', this.cleanup);
    }

    start() {
        this.logProcess.init();
        this.outProcess.init();
        this.inProcess.init();
    }

    get(name) {
        return this.data.get(name);
    }

    onMessage(message) {
        this.output(message);
    }

    output(message) {
        this.outProcess.output(message);
    }

    log(content) {
        this.logProcess.output(content);
    }

    cleanup() {
        this.log("Shutting down...");
        this.inProcess.cleanup();
        this.outProcess.cleanup();

        this.logProcess.cleanup();
    }
}

module.exports = { BotController };