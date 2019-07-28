const apiAxiosInstance = axios.create();

apiAxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    config.headers['Authorization'] = token;

    return config
});

export default {
    loadSeries() {
        return apiAxiosInstance.get('https://api.j-novel.club/api/series')
    }
}
