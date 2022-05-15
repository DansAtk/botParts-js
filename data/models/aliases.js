/*
    Defines Alias objects.
*/


const { format, utcToZonedTime } = require("date-fns-tz");

class Alias {
    constructor(
        id = null,
        user = null,
        place = null,
        nick = null
    ) {
        this.id = id;
        this.user = user;
        this.place = place;
        this.nick = nick;
    }

    get goesBy() {
        if (this.nick) {
            return this.nick;
        } else {
            return this.user.name;
        }
    }

    get now() {
        let today = new Date();
        let tzToday = today;
        if (this.user.tz) {
            tzToday = utcToZonedTime(today, this.user.tz);
        } else if (this.place.tz) {
            tzToday = utcToZonedTime(today, this.place.tz);
        }

        return tzToday;
    }

    printNow() {
        let tzToday = this.now;
        if (this.user.tz) {
            console.log(`User time (${this.user.tz}): ${format(tzToday, 'yyyy-MM-dd HH:mm:ss')}`);
        } else if (this.place.tz) {
            console.log(`Place time (${this.place.tz}): ${format(tzToday, 'yyyy-MM-dd HH:mm:ss')}`);
        } else {
            console.log(`Server time: ${format(tzToday, 'yyyy-MM-dd HH:mm:ss')}`);
        }
    }
}

module.exports = { Alias };
