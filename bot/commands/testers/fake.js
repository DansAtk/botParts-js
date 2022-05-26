const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class TesterFake extends Command {
    constructor() {
        super(
            'fake',
            GLOBAL,
            "donk.",
            "dink."
        );
    }
}

module.exports = { TesterFake };