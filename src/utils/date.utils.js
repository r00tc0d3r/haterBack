const logger = require('./logger.utils');
const MILISECONDS_TO_HOURS = (60 * 60 * 1000);

const validateDate = (from_date, to_date) => {
    let timeInterval;

    try {
        const from = new Date(from_date);
        const to = new Date(to_date);
        const today = new Date();

        if (from < to && to < today) {
            timeInterval = {
                from,
                to
            }
        }
    } catch (err) {
        logger('An error has ocurred while parsing date');
    }

    return timeInterval;
}

const setTimeInterval = (interval) => {
    let timeInterval;

    if (interval && typeof (interval) === 'number' && interval > 0) {
        const fromDate = new Date();
        const toDate = new Date();
        toDate.setTime(toDate.getTime() + (interval * MILISECONDS_TO_HOURS));

        timeInterval = validateDate(fromDate, toDate);
    }

    return timeInterval;
}


Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

module.exports = {
    validateDate,
    setTimeInterval
}