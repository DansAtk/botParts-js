const { APP } = require("../data/managers/GlobalManager");

class Dispatcher {
    constructor() {
    }

    init() {}

    async parse(message) {
        message.content = message.content.trim();
        let trigger = await APP.get('places').triggerof(message.source);
        if (message.content.startsWith(trigger.value)) {
            message.content = message.content.slice(trigger.value.length);

            var commands = APP.get('commands');
            var param = message.content.split(' ')[0].toLowerCase();
            var cmd = null;

            while (commands.has(param)) {
                cmd = commands.get(param);
                commands = cmd.children;
                message.content = message.content.slice(param.length).trim();
                param = message.content.split(' ')[0].toLowerCase();
            }

            if (cmd) {
                if (param == "help") {
                    cmd.help(message);
                } else {
                    cmd.execute(message);
                }
            }
        }
    }

}

module.exports = { Dispatcher };