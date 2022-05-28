/*
    Defines common properties and methods for all command objects
*/


const { APP } = require('../data/managers/GlobalManager');
const { Place } = require('../data/models/Place');

class Command {
    constructor(
        name = null,
        scope = null,
        description = null,
        instruction = null,
        job = null
    ) {
        this.name = name;
        this.scope = scope;
        this.description = description;
        this.instruction = instruction;
        this.job = job;
        this.children = new Map();

        this.init();
    }

    // Used to set up children/subcommands
    init() {}

    // The command's name. Also the string that will trigger the command from a message
    set name(nameString) {
        if (typeof nameString == 'string' || nameString == null) {
            this._name = nameString;
        } else {
            throw `Name must be of type 'String' or null`;
        }
    }

    get name() {
        return this._name;
    }

    // The scope that the command is active/valid in
    set scope(place) {
        if (place instanceof Place || place == null) {
            this._scope = place == null ? null : place.id;
        } else {
            throw `Scope must be of type 'Place' or null`;
        }
    }

    get scope() {
        return this._scope;
    }

    // An overview of what the command does
    set description(descriptionString) {
        if (typeof descriptionString == 'string' || descriptionString == null) {
            this._description = descriptionString;
        } else {
            throw `Description must be of type 'String' or null`;
        }
    }

    get description() {
        return this._description;
    }

    // Instructions on how to properly use the command
    set instruction(instructionString) {
        if (typeof instructionString == 'string' || instructionString == null) {
            this._instruction = instructionString;
        } else {
            throw `Instruction must be of type 'String' or null`;
        }
    }

    get instruction() {
        return this._instruction;
    }

    // The function that will be run when the command is called
    set job(jobFunction) {
        if (typeof jobFunction == 'function' || jobFunction == null) {
            this._job = jobFunction;
        } else {
            throw `Job must be of type 'Function' or null`;
        }
    }

    get job() {
        return this._job;
    }

    // Used to manage children (subcommands)
    addChild(child) {
        if (child instanceof Command) {
            this.children.set(child.name, child);
        } else {
            throw `Child must be of type 'Command'`;
        }
    }

    removeChild(childName) {
        this.children.delete(childName);
    }

    // Returns an array of all available parameters/subcommands, including help
    get params() {
        return [...this.children.keys(), "help"];
    }

    // Runs the command's job
    async execute(message) {
        if (this.job) {
            await this.job(message);
        } else {
            this.howto(message);
        }
    }

    // Outputs a description of the command, including available parameters/subcommands
    async help(message) {
        message.content = `${this.description} Available parameters: ${this.params.join(', ')}`;
        APP.get('events').emit('outmessage', message);
    }

    // Outputs all help text including instructions on how to use the command
    async howto(message) {
        message.content = `${this.description} ${this.instruction} Available parameters: ${this.params.join(', ')}`;
        APP.get('events').emit('outmessage', message);
    }
}

module.exports = { Command };