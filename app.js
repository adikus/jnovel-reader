import Navigation from "./components/Navigation.js"

import Feed from "./pages/Feed.js";
import Series from "./pages/Series.js";

import api from "./services/api.js"

const routes = [
    { path: '/series', component: Series },
    { path: '/feed', component: Feed }
];

const router = new VueRouter({
    routes
});

new Vue({
    components: {
        Navigation
    },
    data: {
        api: api
    },
    router,
    created() {
        if(this.$route.path === '/') {
            router.push('/series');
        }
    }
}).$mount('#app');
