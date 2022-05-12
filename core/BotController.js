/*
    A class for managing jobs, handling bot events and passing messages around.
*/


const EventEmitter = require('events');

class BotController {
    constructor() {
        this.children = new Map();
        this.emitter = new EventEmitter();
        this.emitter.on('shutdown', this.cleanup);
    }

    add(name, job) {
        this.children.set(name, job);
    }

    onMessage(message) {
        console.log(message.toString());
    }

    cleanup() {
        this.children.forEach((job) => {
            job.cleanup();
        })

        console.log("Cleaning up BotController");
    }
}

module.exports = { BotController };