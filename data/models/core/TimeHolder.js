/*
    A prototype for providing timezone localization to inheritors
*/


const { format, utcToZonedTime } = require("date-fns-tz");
const { ScopedObject } = require('./ScopedObject');

class TimeHolder extends ScopedObject {
    constructor(
        id = null,
        scope = null,
        tz = null
    ) {
        super(id, scope);
        this.tz = tz;
    }

    get now() {
        if (this.tz) {
            let provider = this,
                time = utcToZonedTime(new Date(), this.tz);
            return { provider, time };
        } else {
            return this.scope.now;
        }
    }

    printNow() {
        let nowPackage = this.now;
        console.log(
            `Time (${nowPackage.provider.tz}): ${format(nowPackage.time, 'yyyy-MM-dd HH:mm:ss')} (provided by ${nowPackage.provider === this ? "SELF" : nowPackage.provider.name})`
            );
    }
}

module.exports = { TimeHolder };