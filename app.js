import Navigation from "./components/Navigation.js"

import Feed from "./pages/Feed.js";
import Part from "./pages/Part.js";
import Series from "./pages/Series.js"

import api from "./services/api.js"
import sharedStore from "./services/sharedStore.js";
import ReadingList from "./services/ReadingList.js";

const routes = [
    { path: '/series', component: Series },
    { path: '/series/:filter', component: Series },
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
        api,
        sharedStore,
        readingList: new ReadingList(sharedStore, api)
    },
    router,
    created() {
        this.sharedStore.retrieveUser();

        if(this.$route.path === '/') {
            router.push('/series');
        }
    },
    computed: {
        isUserAuthValid() {
            let now = new Date();
            return this.sharedStore.user && this.sharedStore.user.auth &&
                this.sharedStore.user.auth.authToken && this.sharedStore.user.auth.authExpiresAt &&
                new Date(this.sharedStore.user.auth.authExpiresAt).getTime() > now.getTime();
        },
    }
}).$mount('#app');
