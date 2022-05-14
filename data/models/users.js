const { format, utcToZonedTime } = require("date-fns-tz");

class User {
    constructor(
        id = null,
        name = null,
        tz = null,
        bday = null,
        rank = null,
        country = null,
        points = null
    ) {
        this.id = id;
        this.name = name;
        this.tz = tz;
        this.bday = bday;
        this.rank = rank;
        this.country = country;
        this.points = points;
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
            console.log(`User timezone not set. Server time: ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        }
    }
}

module.exports = { User };