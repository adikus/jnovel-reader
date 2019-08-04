export default {
    minute: 60,
    hour: 60 * 60,
    day: 60 * 60 * 24,
    month: 60 * 60 * 24 * 30,
    year: 60 * 60 * 24 * 365,

    timeDifferenceHumanized(to, from) {
        from = from || new Date();

        let delta = Math.round((+from - new Date(to)) / 1000);
        if(delta > 0) {
            return this.timeDifferenceHumanizedInPast(delta);
        } else {
            return this.timeDifferenceHumanizedInFuture(delta * -1);
        }
    },

    timeDifferenceHumanizedInPast(delta) {
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
        } else if (delta < this.day) {
            return Math.floor(delta / this.hour) + ' hours ago';
        } else if (delta < this.day * 2) {
            return 'yesterday';
        } else if (delta < this.month) {
            return  Math.floor(delta / this.day) + ' days ago';
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

    timeDifferenceHumanizedInFuture(delta) {
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
        } else if (delta < this.day) {
            return 'in ' + Math.floor(delta / this.hour) + ' hours';
        } else if (delta < this.day * 2) {
            return 'tomorrow';
        } else if (delta < this.month) {
            return  'in ' + Math.floor(delta / this.day) + ' days';
        } else if (Math.floor(delta / this.month) === 1) {
            return 'in 1 month';
        } else if (delta < this.year) {
            return  'in ' + Math.floor(delta / this.month) + ' months';
        } else if (Math.floor(delta / this.year) === 1) {
            return 'in 1 year';
        } else {
            return 'in ' + Math.floor(delta / this.year) + ' years';
        }
    }
}
