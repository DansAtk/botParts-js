const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL } = require('../../data/models/Place');
const { Command } = require('../Command');
const { Place } = require('../../data/models/Place');

class PlaceNewC extends Command {
    constructor() {
        super(
            'new',
            GLOBAL,
            "Creates a new place.",
            "Specify the new place's name."
        );

        this.job = async (message) => {
            let name = message.content.split(' ')[0];

            if (name.length > 0) {
                message.content = message.content.slice(name.length).trim();

                let placeid = await APP.get('places').add(await APP.get('places').new(name));

                message.content = `Place ${name}(${placeid}) added.`;
                APP.get('events').emit('outmessage', message);
            }
        };
    }
}

module.exports = { PlaceNewC };