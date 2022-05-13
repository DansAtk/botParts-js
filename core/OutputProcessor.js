/*
    An "abstract" class defining static constructor calls and expected methods
    that should apply to any given output processor.

    Output processors take output from bot command jobs in the form of message objects, format them,
    and post/present them in a way specific to the specified platform.
*/


const { Theme } = require("./Theme");

class OutputProcessor {
    constructor(context, theme=Theme) {
        this.context = context;
        this.theme = theme;
        this.context.add('output', this);
        this.init();
    }

    init() {}

    post(message) {}

    output(message) {
        this.post(this.theme.apply(message));
    }

    cleanup() {}
}

module.exports = { OutputProcessor };