export default {
    alert: null,

    partSeriesMap: {},
    partVolumeMap: {},
    volumeSeriesMap: {},

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
    retrieveUser() {
        this.user = {
            auth: {
                authToken: localStorage.authToken,
                authExpiresAt: localStorage.authExpiresAt
            },
            userId: localStorage.userId
        }
    },
    isUserAuthValid() {
        let now = new Date();
        return this.user && this.user.auth && this.user.auth.authToken && this.user.auth.authExpiresAt &&
            new Date(this.user.auth.authExpiresAt).getTime() > now.getTime();
    },
    setUserDetails(userDetails) {
        this.user.username = userDetails.username;
        this.user.readParts = userDetails.readParts;
    },
    retrievePartMaps() {
        if(localStorage.partSeriesMap) this.partSeriesMap = JSON.parse(localStorage.partSeriesMap);
        if(localStorage.partVolumeMap) this.partVolumeMap = JSON.parse(localStorage.partVolumeMap);
        if(localStorage.volumeSeriesMap) this.volumeSeriesMap = JSON.parse(localStorage.volumeSeriesMap);
    },
    savePartMaps() {
        localStorage.setItem('partSeriesMap', JSON.stringify(this.partSeriesMap));
        localStorage.setItem('partVolumeMap', JSON.stringify(this.partVolumeMap));
        localStorage.setItem('volumeSeriesMap', JSON.stringify(this.volumeSeriesMap));
    }
};
