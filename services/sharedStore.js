export default {
    alert: null,

    user: {},

    series: [],
    feed: [],
    events: [],

    preferredFilter: 'all',

    setAlert(message) {
        this.alert = message;
    },
    hideAlert() {
        this.alert = null;
    },
    setUser(user) {
        this.user = user;
        localStorage.setItem('authToken', user.auth.authToken);
        localStorage.setItem('authExpiresAt', user.auth.authExpiresAt);
        localStorage.setItem('userId', user.userId);
    },
    signOut() {
        Vue.set(this.user, 'auth', {});
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiresAt');
        localStorage.removeItem('userId');
    },
    retrieveUser() {
        this.user = {
            auth: {
                authToken: localStorage.authToken,
                authExpiresAt: localStorage.authExpiresAt
            },
            userId: localStorage.userId
        }
    },
    setUserDetails(userDetails) {
        this.user.username = userDetails.username;
        this.user.readParts = userDetails.readParts;
    },
    retrievePreferences() {
        this.preferredFilter = localStorage.preferredFilter || this.preferredFilter;
    },
    savePreferences() {
        localStorage.setItem('preferredFilter', this.preferredFilter);
    },
    saveSettings(settings) {
        localStorage.setItem('settings', JSON.stringify(settings));
    },
    retrieveSettings() {
        return (localStorage.settings && JSON.parse(localStorage.settings)) || {
            appearance: 'light',
            fontSize: 'medium',
            readingDirection: 'vertical',
            textAlignment: 'left',
            font: 'Open Sans'
        };
    },
    saveLastPartHeight(height) {
        localStorage.setItem('lastPartHeight', height);
    },
    retrieveLastPartHeight() {
        return localStorage.lastPartHeight && parseInt(localStorage.lastPartHeight);
    }
};
