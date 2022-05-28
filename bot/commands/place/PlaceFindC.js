const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL, Place } = require('../../data/models/Place');
const { Command } = require('../Command');
const { PlaceAllC } = require('./PlaceAllC');

class PlaceFindC extends Command {
    constructor() {
        super(
            'find',
            GLOBAL,
            "Searches for a place based on matching criteria.",
            "Specify search criteria."
        );

        this.job = async (message) => {
            let property = message.content.split(' ')[0].toLowerCase();

            if (property.length > 0) {
                let validProperties = ['id', 'name', 'scope', 'timezone', 'trigger', 'child'];
                if (validProperties.includes(property)) {
                    message.content = message.content.slice(property.length).trim();
                    let value = message.content;

                    if (value.length > 0) {
                        let qPlace = new Place();
                        let valid = true;

                        switch (property) {
                            case 'id':
                                qPlace.id = value;
                                break;
                            case 'name':
                                qPlace.name = value;
                                break;
                            case 'scope':
                                qPlace.scope = new Place(value);
                                break;
                            case 'timezone':
                                qPlace.tz = value;
                                break;
                            case 'trigger':
                                qPlace.trigger = value;
                                break;
                            case 'child':
                                qPlace.addChild(new Place(value));
                                break;
                            default:
                                valid = false;
                        }
                        if (valid) {
                            let results = await APP.get('places').find(qPlace);
                            if (results) {
                                let placeStrings = results.map((place) => {return place.toString()});
                                message.content = `Found places(${results.length}):\n${placeStrings.join('\n')}`;
                            } else {
                                message.content = `No places found.`;
                            }
                        } else {
                            message.content = `Invalid query. Searchable properties: id, name, scope, timezone, trigger, and child.`;
                        }
                    } else {
                        message.content = `Please provide a value for ${property}.`;
                    }
                } else {
                    message.content = `Invalid search property. Searchable properties: id, name, scope, timezone, trigger, and child.`;
                }
            } else {
                message.content = `Please specify a property to search with. Searchable properties: id, name, scope, timezone, trigger, and child.`;
            }

            APP.get('events').emit('outmessage', message);
        }
    }

    init() {
        this.addChild(new PlaceAllC());
    }
}

module.exports = { PlaceFindC };