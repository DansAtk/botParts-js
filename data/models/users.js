/*
    Defines User objects.
*/


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
            console.log(`User time (${this.tz}): ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        } else {
            console.log(`Server time: ${format(today, 'yyyy-MM-dd HH:mm:ss')}`);
        }
    }
}

module.exports = { User };