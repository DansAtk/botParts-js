/*
    A model of the message objects that are passed around the bot internally.
*/


const { Place } = require('../data/models/Place');
const { User } = require('../data/models/User');

class Message {
    constructor(
        author = null,
        content = null,
        source = null,
        destination = null,
        recipient = null,
        time = null,
        raw = null,
        commands = new Array(),
        trigger = null,
        id = null
    ) {
        this.author = author;
        this.source = source;
        this.content = content;
        this.destination = destination;
        this.recipient = recipient;
        this.time = time;
        this.raw = raw;
        this.commands = commands;
        this.trigger = trigger;
        this.id = id;
    }

    set author(user) {
        if (user instanceof User || user == null) {
            this._author = user;
        } else {
            throw `Author must be of type 'User' or null`;
        }
    }

    get author() {
        return this._author;
    }

    set source(place) {
        if (place instanceof Place || place == null) {
            this._source = place;
        } else {
            throw `Source must be of type 'Place' or null`;
        }
    }

    get source() {
        return this._source;
    }

    set content(contentString) {
        if (typeof contentString == 'string' || contentString == null) {
            this._content = contentString;
        } else {
            throw `Content must be of type 'String' or null`;
        }
    }

    get content() {
        return this._content;
    }

    set destination(place) {
        if (place instanceof Place || place == null) {
            this._destination = place;
        } else {
            throw `Destination must be of type 'Place' or null`;
        }
    }

    get destination() {
        return this._destination;
    }

    set recipient(user) {
        if (user instanceof User || user == null) {
            this._recipient = user;
        } else {
            throw `Recipient must be of type 'User' or null`;
        }
    }

    get recipient() {
        return this._recipient;
    }

    set time(date) {
        if (date instanceof Date || date == null) {
            this._time = date;
        } else {
            throw `Time must be of type 'Date' or null`;
        }
    }

    get time() {
        return this._time;
    }

    // For storing the original raw content of the message, before processing or parsing it and before running any jobs
    set raw(rawString) {
        if (typeof rawString == 'string' || rawString == null) {
            this._raw = rawString;
        } else {
            throw `Raw must be of type 'String' or null`;
        }
    }

    get raw() {
        return this._raw;
    }

    // For setting or getting the message's trigger, if one was found
    set trigger(triggerString) {
        if (typeof triggerString == 'string' || triggerString == null) {
            this._trigger = triggerString;
        } else {
            throw `Trigger must be of type 'String' or null`;
        }
    }

    get trigger() {
        return this._trigger;
    }

    // For setting or getting the message's ID, if assigned one
    set id(idString) {
        if (typeof idString == 'string' || idString == null) {
            this._id = idString;
        } else {
            throw `ID must be of type 'String' or null`;
        }
    }

    get id() {
        return this._id;
    }

    toString() {
        return this.content;
    }

    get details() {
        return `Message:\n` +
            `  Author: ${this.author}\n` +
            `  Source: ${this.source}\n` +
            `  Destination: ${this.destination}\n` +
            `  Recipient: ${this.recipient}\n` +
            `  Content: ${this.content}\n` +
            `  Time: ${this.time}`;
    }
}

module.exports = { Message };