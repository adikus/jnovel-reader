export default {
    minute: 60,
    hour: 60 * 60,
    day: 60 * 60 * 24,
    month: 60 * 60 * 24 * 30,
    year: 60 * 60 * 24 * 365,
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    timeDifferenceHumanized(to, from) {
        from = from || new Date();
        to = new Date(to);

        let delta = Math.round((+from - new Date(to)) / 1000);
        if(delta > 0) {
            return this.timeDifferenceHumanizedInPast(delta, to, from);
        } else {
            return this.timeDifferenceHumanizedInFuture(delta * -1, to, from);
        }
    },

    timeDifferenceHumanizedInPast(delta, to, from) {
        if (delta < 30) {
            return 'just now';
        } else if (delta < this.minute) {
            return delta + ' seconds ago';
        } else if (delta < 2 * this.minute) {
            return 'a minute ago'
        } else if (delta < this.hour) {
            return Math.floor(delta / this.minute) + ' minutes ago';
        } else if (Math.floor(delta / this.hour) === 1) {
            return '1 hour ago'
        } else if (to > this.endOf(this.yesterday(from))) {
            return Math.floor(delta / this.hour) + ' hours ago';
        } else if (to > this.startOf(this.yesterday(from))) {
            return 'yesterday ' + to.toLocaleTimeString([], { timeStyle: 'short' });
        } else if (delta < this.month) {
            return  Math.ceil(delta / this.day) + ' days ago';
        } else if (Math.floor(delta / this.month) === 1) {
            return '1 month ago';
        } else if (delta < this.year) {
            return  Math.floor(delta / this.month) + ' months ago';
        } else if (Math.floor(delta / this.year) === 1) {
            return '1 year ago';
        } else {
            return Math.floor(delta / this.year) + ' years ago';
        }
    },

    timeDifferenceHumanizedInFuture(delta, to, from) {
        if (delta < 30) {
            return 'just now';
        } else if (delta < this.minute) {
            return 'in ' + delta + ' seconds';
        } else if (delta < 2 * this.minute) {
            return 'in a minute'
        } else if (delta < this.hour) {
            return 'in ' + Math.floor(delta / this.minute) + ' minutes';
        } else if (Math.floor(delta / this.hour) === 1) {
            return 'in 1 hour'
        } else if (to < this.startOf(this.tomorrow(from))) {
            return 'in ' + Math.floor(delta / this.hour) + ' hours';
        } else if (to < this.endOf(this.tomorrow(from))) {
            return 'tomorrow ' + to.toLocaleTimeString([], { timeStyle: 'short' });
        } else if (delta < this.day * 6) {
            return 'on ' + this.days[to.getDay()] + ' ' + to.toLocaleTimeString([], { timeStyle: 'short' });
        } else if (delta < this.month) {
            return  'in ' + Math.ceil(delta / this.day) + ' days';
        } else if (Math.floor(delta / this.month) === 1) {
            return 'in 1 month';
        } else if (delta < this.year) {
            return  'in ' + Math.floor(delta / this.month) + ' months';
        } else if (Math.floor(delta / this.year) === 1) {
            return 'in 1 year';
        } else {
            return 'in ' + Math.floor(delta / this.year) + ' years';
        }
    },

    yesterday(from) {
        let date = new Date(from.getTime());
        date.setDate(date.getDate() - 1);
        return date;
    },

    tomorrow(from) {
        let date = new Date(from.getTime());
        date.setDate(date.getDate() + 1);
        return date;
    },

    startOf(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    },

    endOf(date) {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        return date;
    }
}
