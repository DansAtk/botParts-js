const { APP } = require('../../data/managers/GlobalManager');
const { GLOBAL, Place } = require('../../data/models/Place');
const { User } = require('../../data/models/User');
const { Command } = require('../Command');
const { UserAllC } = require('./UserAllC');

class UserFindC extends Command {
    constructor() {
        super(
            'find',
            GLOBAL,
            "Searches for a user based on matching criteria.",
            "Specify search criteria."
        );

        this.job = async (message) => {
            let property = message.content.split(' ')[0].toLowerCase();

            if (property.length > 0) {
                let validProperties = ['id', 'name', 'scope', 'timezone', 'birthday', 'country', 'points'];
                if (validProperties.includes(property)) {
                    message.content = message.content.slice(property.length).trim();
                    let value = message.content;

                    if (value.length > 0) {
                        let qUser = new User();
                        let valid = true;

                        switch (property) {
                            case 'id':
                                qUser.id = value;
                                break;
                            case 'name':
                                qUser.name = value;
                                break;
                            case 'scope':
                                qUser.scope = new Place(value);
                                break;
                            case 'timezone':
                                qUser.tz = value;
                                break;
                            case 'birthday':
                                qUser.bday = value;
                                break;
                            case 'country':
                                qUser.country = value;
                                break;
                            case 'points':
                                qUser.points = parseInt(value);
                                break;
                            default:
                                valid = false;
                        }
                        if (valid) {
                            let results = await APP.get('users').find(qUser);
                            if (results) {
                                let userStrings = results.map((user) => {return user.toString()});
                                message.content = `Found users(${results.length}):\n${userStrings.join('\n')}`;
                            } else {
                                message.content = `No users found.`;
                            }
                        } else {
                            message.content = `Invalid query. Searchable properties: id, name, scope, timezone, birthday, country, and points.`;
                        }
                    } else {
                        message.content = `Please provide a value for ${property}.`;
                    }
                } else {
                    message.content = `Invalid search property. Searchable properties: id, name, scope, timezone, birthday, country and points.`;
                }
            } else {
                message.content = `Please specify a property to search with. Searchable properties: id, name, scope, timezone, birthday, country and points.`;
            }

            APP.get('events').emit('outmessage', message);
        }
    }

    init() {
        this.addChild(new UserAllC());
    }
}

module.exports = { UserFindC };