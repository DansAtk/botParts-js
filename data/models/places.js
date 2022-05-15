/*
    Defines Place objects.
*/


const { format, utcToZonedTime } = require("date-fns-tz");

class Place {
    constructor(
        id = null,
        name = null,
        tz = null
        trigger = null,
    ) {
        this.id = id;
        this.name = name;
        this.tz = tz;
        this.trigger = trigger;
    }

    now() {
        let today = new Date();
        if (this.tz) {
            return utcToZonedTime(today, this.tz);
        } else {
            return today;
        }
    }

    printNow() {
        let today = new Date();
        if (this.tz) {
            let tzToday = utcToZonedTime(today, this.tz);
            console.log(`Time in ${this.tz}: ${format(tzToday, 'yyyy-MM-dd HH:mm:ss')}`);
        } else {
            console.log(`Place timezone not set. Server time: ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        }
    }
}