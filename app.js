import Navigation from "./components/Navigation.js"

import Feed from "./pages/Feed.js";
import Part from "./pages/Part.js";
import Series from "./pages/Series.js"
import Events from "./pages/Events.js"

import api from "./services/api.js"
import sharedStore from "./services/sharedStore.js";
import ReadingList from "./services/ReadingList.js";
import EventParser from "./services/EventParser.js";

const routes = [
    { path: '/series', component: Series },
    { path: '/series/:filter', component: Series },
    { path: '/series/:serieId/part/:id', component: Part },
    { path: '/feed', component: Feed },
    { path: '/feed/:filter', component: Feed },
    { path: '/coming-up', component: Events },
    { path: '/coming-up/:filter', component: Events }
];

const router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.path.includes('/part/') && to.path !== from.path) {
            window.scrollTo({ top: 0 }); // Reset scroll position when navigating between parts
            return { top: 0 };
        } else {
            return savedPosition;
        }
    }
});

new Vue({
    components: {
        Navigation
    },
    data: {
        api,
        sharedStore,
        readingList: new ReadingList(sharedStore, api),
        eventParser: new EventParser(sharedStore),
        noSleep: new NoSleep()
    },
    router,
    created() {
        this.sharedStore.retrieveUser();
        this.sharedStore.retrievePreferences();

        if(this.$route.path === '/') {
            router.push('/series');
        }

        this.loadSeries();
        this.loadFeed();
        this.loadEvents();
        this.loadUserDetails();
    },
    computed: {
        isUserAuthValid() {
            let now = new Date();
            return this.sharedStore.user && this.sharedStore.user.auth &&
                this.sharedStore.user.auth.authToken && this.sharedStore.user.auth.authExpiresAt &&
                new Date(this.sharedStore.user.auth.authExpiresAt).getTime() > now.getTime();
        },
    },
    methods: {
        async loadSeries() {
            let response = await this.api.loadSeries();
            this.sharedStore.series.push.apply(this.sharedStore.series, response.data);
        },

        async loadFeed() {
            let response = await this.$root.api.loadFeed();
            this.sharedStore.feed.push.apply(this.sharedStore.feed, response.data);
        },

        async loadEvents() {
            let response = await this.$root.api.loadEvents();
            let predicate = event => event.details.toLowerCase().indexOf('release of part') > -1;
            this.sharedStore.events.push.apply(this.sharedStore.events, response.data.filter(predicate));
        },

        async loadUserDetails() {
            if(this.isUserAuthValid) {
                let userDetailsResponse = await this.$root.api.loadUserDetails(this.$root.sharedStore.user.userId);
                this.$root.sharedStore.setUserDetails(userDetailsResponse.data);
                await this.readingList.updateFromUserDetails();
            }
        },

        fuseSearchFilter(items, search) {
            const options = {
                shouldSort: false,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "title",
                    "titleShort",
                    "titleOriginal",
                    "author",
                    "illustrator",
                    "translator",
                    "editor",
                    "tags"
                ]
            };
            let fuse = new Fuse(items, options);
            return fuse.search(search);
        },

        handleFilterChange(filter) {
            if(filter) {
                this.$root.sharedStore.preferredFilter = filter;
                this.$root.sharedStore.savePreferences();
                return filter;
            } else {
                return filter || 'all';
            }
        }
    }
}).$mount('#app');
