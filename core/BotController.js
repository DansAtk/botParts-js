/*
    A class for managing jobs, handling bot events and passing messages around.
*/


const EventEmitter = require('events');

class BotController {
    constructor() {
        this.logProcess = null;
        this.outProcess = null;
        this.inProcess = null;
        this.children = new Map();
        this.emitter = new EventEmitter();
        this.emitter.on('shutdown', this.cleanup);
    }

    init() {
        this.logProcess.init();
        this.outProcess.init();
        this.inProcess.init();
    }

    add(name, job) {
        this.children.set(name, job);
    }

    remove(name) {
        this.children.delete(name);
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

        this.children.forEach((job) => {
            job.cleanup();
        })

        this.logProcess.cleanup();
    }
}

module.exports = { BotController };