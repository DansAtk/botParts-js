const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class TesterNotReal extends Command {
    constructor() {
        super(
            'notreal',
            GLOBAL,
            "dank.",
            "dunk.",
        );
    }
}

module.exports = { TesterNotReal };