const apiAxiosInstance = axios.create();

apiAxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    config.headers['Authorization'] = token;

    return config
});

export default {
    loadSeries() {
        return apiAxiosInstance.get('https://api.j-novel.club/api/series');
    },

    loadLatestParts() {
        let params = {
            filter: {
                limit: 500,
                order: "launchDate DESC"
            }
        };
        return apiAxiosInstance.get('https://api.j-novel.club/api/parts', { params });
    },

    loadSerieParts(serieId) {
        return apiAxiosInstance.get(`https://api.j-novel.club/api/volumes?filter[where][serieId]=${serieId}&filter[include][parts]`);
    },

    loadPartData(partId) {
        return apiAxiosInstance.get(`https://api.j-novel.club/api/parts/${partId}/partData`);
    },

    loadPart(partId) {
        return apiAxiosInstance.get(`https://api.j-novel.club/api/parts/findOne?filter={"where":{"id":"${partId}"}}`);
    },

    signIn(email, password) {
        return apiAxiosInstance.post(`https://api.j-novel.club/api/users/login?include=user`, {email, password});
    },

    loadUserDetails(userId) {
        let params = {
            filter: {
                include: [{readParts: "part"}]
            }
        };
        return apiAxiosInstance.get(`https://api.j-novel.club/api/users/${userId}`, { params });
    },

    updatePartCompletionStatus(userId, partId, completion) {
        let params = {
            partId: partId,
            completion: completion
        };
        return apiAxiosInstance.post(`https://api.j-novel.club/api/users/${userId}/updateReadCompletion`, params);
    }
}
