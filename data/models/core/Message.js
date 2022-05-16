/*
    A model of the message objects that are passed around the bot internally.
*/


class Message {
    constructor(
        author = null,
        content = null,
        source = null,
        destination = null,
        recipient = null
    ) {
        this.author = author;
        this.source = source;
        this.content = content;
        this.destination = destination;
        this.recipient = recipient;
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
        `  Content: ${this.content}`;
    }
}

module.exports = { Message };