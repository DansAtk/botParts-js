const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

const { PlaceNewC } = require('./PlaceNewC');
const { PlaceDeleteC } = require('./PlaceDeleteC');
const { PlaceGetC } = require('./PlaceGetC');
const { PlaceFindC } = require('./PlaceFindC');
const { PlaceAllC } = require('./PlaceAllC');

class PlaceC extends Command {
    constructor() {
        super(
            'place',
            GLOBAL,
            "Commands for managing places.",
            "Specify an action."
        );
    }

    init() {
        this.addChild(new PlaceNewC());
        this.addChild(new PlaceDeleteC());
        this.addChild(new PlaceGetC());
        this.addChild(new PlaceFindC());
        this.addChild(new PlaceAllC());
    };
}

module.exports = { PlaceC };