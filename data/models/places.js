/*
    Defines Place objects.
*/


const { format, utcToZonedTime } = require("date-fns-tz");

class Place {
    constructor(
        id = null,
        name = null,
        tz = null,
        trigger = null
    ) {
        this.id = id;
        this.name = name;
        this.tz = tz;
        this.trigger = trigger;
    }

    get now() {
        let today = new Date();
        if (this.tz) {
            return utcToZonedTime(today, this.tz);
        } else {
            return today;
        }
    }

    printNow() {
        let today = this.now;
        if (this.tz) {
            console.log(`Place time (${this.tz}): ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        } else {
            console.log(`Server time: ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        }
    }
}

module.exports = { Place };
