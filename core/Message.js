/*
    A model of the message objects that are passed around the bot internally.
*/


class Message {
    constructor(author, location, content) {
        this.author = author;
        this.location = location;
        this.content = content;
    }

    toString(){
        return 'Author: ' + this.author + '\nLocation: ' + this.location + '\nContent: ' + this.content;
    }
}

module.exports = { Message };