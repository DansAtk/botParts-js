const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');

class PlaceDeleteC extends Command {
    constructor() {
        super(
            'delete',
            GLOBAL,
            "Deletes a place.",
            "Specify a place via ID."
        );

        this.job = async (message) => {
            let placeid = message.content.split(' ')[0];

            if (placeid.length > 0) {
                let foundPlace = await APP.get('places').get(placeid);
                if (foundPlace) {
                    let deletedPlace = await APP.get('places').delete(foundPlace.id);
                    message.content = deletedPlace ? `Deleted place ${foundPlace.toString()}.` : `Failed to delete place ${foundPlace.toString()}.`;
                } else {
                    message.content = `Place not found.`;
                }

                APP.get('events').emit('outmessage', message);
            }
        }
    }
}

module.exports = { PlaceDeleteC };