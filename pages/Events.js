import Event from "../components/Event.js";

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <div class="border-b-2 border-blue-700 flex justify-start items-baseline mb-4">
            <h1 class="text-2xl px-2 sm:mr-10">Feed</h1>
            <router-link to="/coming-up/all" class="border-b-4 hover:border-blue-700 px-2 sm:mr-10" :class="{'border-transparent': !isFilteredAll, 'border-blue-700': isFilteredAll}">
                All
            </router-link>
            <router-link to="/coming-up/reading-list" class="border-b-4 hover:border-blue-700 px-2 sm:mr-10" :class="{'border-transparent': !isFilteredReadingList, 'border-blue-700': isFilteredReadingList}">
                Reading&nbsp;list
            </router-link>
        </div>
        
        <div class="flex content-center flex-wrap">
            <event v-for="event in filteredEvents" v-bind:key="event.id" :event="event"></event>
        </div>
    </div>
  `,
    data() {
        return {
            filter: 'all'
        }
    },
    async created() {
        this.filter = this.$route.params.filter || this.$root.sharedStore.preferredFilter;
        this.$root.sharedStore.hideAlert();
        this.$root.noSleep.disable();
        console.log('NoSleep disabled');
    },
    watch: {
        $route(to, _from) {
            this.filter = this.$root.handleFilterChange(to.params.filter);
        }
    },
    computed: {
        isFilteredAll() {
            return this.filter === 'all';
        },
        isFilteredReadingList() {
            return this.filter === 'reading-list';
        },
        filteredEvents() {
            let filteredEvents = [];
            if(this.isFilteredAll) {
                filteredEvents = this.$root.sharedStore.events;
            } else if(this.isFilteredReadingList) {
                filteredEvents = this.$root.sharedStore.events.filter((event) => {
                    let partInfo = this.$root.eventParser.parse(event);
                    return this.$root.readingList.isPartInFeed(partInfo);
                });
            }

            return filteredEvents.slice(0, 50);
        }
    },
    components: {
        Event
    }
}
