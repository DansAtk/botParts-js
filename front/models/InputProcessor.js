/*
    An "abstract" class defining static constructor calls and expected methods
    that should apply to any given input processor.

    Input processors take input from various sources and format it into Message
    objects before passing them on to the bot controller.
*/


class InputProcessor {
    constructor(context) {
        this.context = context;
    }

    init() {
        this.context.log("Input process initializing");
    }

    processMessage() {}

    cleanup() {
        this.context.log("Cleaning up input process");
    }
}

module.exports = { InputProcessor };