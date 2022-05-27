const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');
const { PlaceAllC } = require('./PlaceAllC');

class PlaceGetC extends Command {
    constructor() {
        super(
            'get',
            GLOBAL,
            "Looks up a single place.",
            "Specify a place id to look up."
        );

        this.job = async (message) => {
            let placeid = message.content.split(' ')[0];

            if (placeid.length > 0) {
                let gotPlace = await APP.get('places').get(placeid);

                message.content = gotPlace ? `${gotPlace.details}` : `Place not found.`;
                APP.get('events').emit('outmessage', message);
            }
        }
    }

    init() {
        this.addChild(new PlaceAllC());
    }
}

module.exports = { PlaceGetC };