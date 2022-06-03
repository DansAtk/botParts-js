/*
    A basic REPL input interface for the bot.
*/


const { APP } = require('../../../data/managers/GlobalManager');
const { InputAdapter } = require('../InputAdapter');
const { Message } = require('../../Message');
const { User } = require('../../../data/models/User')
const { Place, GLOBAL } = require('../../../data/models/Place')

class BasicInputAdapter extends InputAdapter {
    constructor() {
        super();
        this.cliuser;
        this.stdout;
        this.stdin;
    }

    async setup() {
        super.init();

        this.cliuser = await APP.get('users').get('CLIUSER');
        if (!this.cliuser) {
            this.cliuser = new User('CLIUSER', 'CLIUSER', GLOBAL);
            await APP.get('users').add(this.cliuser);
        }

        this.stdout = await APP.get('places').get('STDOUT');
        if (!this.stdout) {
            this.stdout = new Place('STDOUT', 'STDOUT', GLOBAL, 'America/New_York', '!');
            await APP.get('places').add(this.stdout);
        }

        this.stdin = await APP.get('places').get('STDIN');
        if (!this.stdin) {
            this.stdin = new Place('STDIN', 'STDIN', GLOBAL, 'America/New_York', '!');
            await APP.get('places').add(this.stdin);
        }

        process.stdin.resume();
        process.stdin.setEncoding("ascii");
        process.stdin.on("data", (content) => this.processMessage(content.trim()));
    }

    async processMessage(content) {
        let newMessage = new Message(this.cliuser, null, this.stdin, this.stdout, null, new Date(), content);
        let words = content.trim().split(' ');
        
        for (var i = 0; i < words.length; i++) {
            if (words[i].startsWith('@')) {
                let ref = words[i].slice(1);
                var refUser = await APP.get('users').get(ref);
                if (refUser) {
                    words[i] = refUser.id;
                } else {
                    refUser = await APP.get('users').find(new User(null, ref));
                    if (refUser.length === 1) {
                        words[i] = refUser[0].id;
                    }
                }
            }
            if (words[i].startsWith('#')) {
                let ref = words[i].slice(1);
                var refPlace = await APP.get('places').get(ref);
                if (refPlace) {
                    words[i] = refPlace.id;
                } else {
                    refPlace = await APP.get('places').find(new Place(null, ref));
                    if (refPlace.length === 1) {
                        words[i] = refPlace[0].id;
                    }
                }
            }
        }

        newMessage.content = words.join(' ');
        
        APP.get('events').emit('inmessage', newMessage);
    }
}

module.exports = { BasicInputAdapter };