/*
    A static abstract class defining values available to Theme objects, to be used by OutputProcessors.
*/


class Theme {
    static width = null;

    static addBanner(message) {
        return message;
    }

    static addHeader(message) {
        return message;
    }

    static addFrame(message) {
        return message;
    }

    static apply(message) {
        return this.addFrame(this.addHeader(this.addBanner(message)));
    }
}

module.exports = { Theme };