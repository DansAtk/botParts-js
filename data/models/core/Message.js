/*
    A model of the message objects that are passed around the bot internally.
*/


const { Place } = require('./Scope');
const { User } = require('./User');

class Message {
    constructor(
        author = null,
        content = null,
        source = null,
        destination = null,
        recipient = null,
        time = null
    ) {
        this.author = author;
        this.source = source;
        this.content = content;
        this.destination = destination;
        this.recipient = recipient;
        this.time = time;
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