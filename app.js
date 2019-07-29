import Navigation from "./components/Navigation.js"

import Feed from "./pages/Feed.js";
import Part from "./pages/Part.js";
import Series from "./pages/Series.js"

import api from "./services/api.js"
import sharedStore from "./services/sharedStore.js";

const routes = [
    { path: '/series', component: Series },
    { path: '/series/:serieId/part/:id', component: Part },
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
        api: api,
        sharedStore
    },
    router,
    created() {
        if(this.$route.path === '/') {
            router.push('/series');
        }
    }
}).$mount('#app');
