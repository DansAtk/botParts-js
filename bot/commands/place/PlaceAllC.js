const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class PlaceAllC extends Command {
    constructor() {
        super(
            'all',
            GLOBAL,
            "Displays a list of all places."
        );

        this.job = async (message) => {
            let places = await APP.get('places').all();

            if (places) {
                let placeStrings = places.map((place) => {return place.toString()});
                message.content = `All places(${places.length}):\n${placeStrings.join('\n')}`;
            } else {
                message.content = `No places found.`;
            }

            APP.get('events').emit('outmessage', message);
        }
    }
}

module.exports = { PlaceAllC };