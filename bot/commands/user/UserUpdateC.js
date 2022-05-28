const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL, Place } = require('../../data/models/Place');
const { User } = require('../../data/models/User');
const { Command } = require('../Command');

class UserUpdateC extends Command {
    constructor() {
        super(
            'update',
            GLOBAL,
            "Updates a user property.",
            "Specify a user by id followed by the property name and value."
        );

        this.job = async (message) => {
            let userid = message.content.split(' ')[0].toLowerCase();

            if (userid.length > 0) {
                message.content = message.content.slice(userid.length).trim();
                let property = message.content.split(' ')[0].toLowerCase();

                if (property.length > 0) {
                    let validProperties = ['id', 'name', 'scope', 'timezone', 'birthday', 'country', 'points'];
                    if (validProperties.includes(property)) {
                        message.content = message.content.slice(property.length).trim();
                        let value = message.content;

                        if (value.length > 0) {
                            let uUser = new User();
                            let valid = true;

                            switch (property) {
                                case 'id':
                                    uUser.id = value;
                                    break;
                                case 'name':
                                    uUser.name = value;
                                    break;
                                case 'scope':
                                    uUser.scope = new Place(value);
                                    break;
                                case 'timezone':
                                    uUser.tz = value;
                                    break;
                                case 'birthday':
                                    uUser.bday = value;
                                    break;
                                case 'country':
                                    uUser.country = value;
                                    break;
                                case 'points':
                                    uUser.points = parseInt(value);
                                    break;
                                default:
                                    valid = false;
                            }
                            if (valid) {
                                let result = await APP.get('users').findUpdate(new User(userid), uUser);
                                if (result) {
                                    message.content = `User ${property} updated successfully.`;
                                } else {
                                    message.content = `User not found.`;
                                }
                            } else {
                                    message.content = `Invalid update. Updateable properties: id, name, scope, timezone, birthday, country, and points.`;
                                }
                        } else {
                            message.content = `Please provide a value for ${property}.`;
                        }
                    } else {
                        message.content = `Invalid update property. Updateable properties: id, name, scope, timezone, birthday, country and points.`;
                    }
                } else {
                    message.content = `Please specify a property to update. Updateable properties: id, name, scope, timezone, birthday, country and points.`;
                }
            } else {
                message.content = `Please specify a user via ID.`;
            }

            APP.get('events').emit('outmessage', message);
        }
    }
}

module.exports = { UserUpdateC };