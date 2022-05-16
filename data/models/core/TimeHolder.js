/*
    A prototype for providing timezone localization to inheritors
*/


const { format, utcToZonedTime } = require("date-fns-tz");
const { ScopedObject } = require('./ScopedObject');

class TimeHolder extends ScopedObject {
    constructor(
        id = null,
        scope = null,
        tz = null,
        name = null
    ) {
        super(id, scope, name);
        this.tz = tz;
    }

    get time() {
        return this.tz ? { 'provider': this, 'value': utcToZonedTime(new Date(), this.tz) } : this.scope.time;
    }

    printNow() {
        console.log(
            `Time (${this.time.provider.tz}): ` +
            `${format(this.time.value, 'yyyy-MM-dd HH:mm:ss')} ` +
            `(provided by ${this.time.provider})`
            );
    }
}

module.exports = { TimeHolder };