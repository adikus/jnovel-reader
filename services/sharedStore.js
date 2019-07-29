export default {
    alert: null,

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
    }
};
