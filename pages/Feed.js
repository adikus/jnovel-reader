import Part from "../components/Part.js"

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <div class="border-b-2 border-blue-700 flex justify-start items-baseline mb-4">
            <h1 class="text-2xl px-2 mr-10">Feed</h1>
            <router-link to="/feed/all" class="border-b-4 hover:border-blue-700 px-2 mr-10" :class="{'border-transparent': !isFilteredAll, 'border-blue-700': isFilteredAll}">
                All
            </router-link>
            <router-link to="/feed/reading-list" class="border-b-4 hover:border-blue-700 px-2 mr-10" :class="{'border-transparent': !isFilteredReadingList, 'border-blue-700': isFilteredReadingList}">
                Reading&nbsp;list
            </router-link>
            <div class="w-full flex-grow"></div>
            <input v-model="search" class="flex-shrink shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" id="series-search" type="text" placeholder="Search">
        </div>
        
        <div class="flex content-center flex-wrap">
            <part v-for="part in filteredParts" v-bind:key="part.id" :part="part"></part>
        </div>
    </div>
  `,
    data() {
        return {
            parts: [],
            filter: 'all',
            search: ''
        }
    },
    async created() {
        this.filter = this.$route.params.filter || 'all';
        this.$root.sharedStore.hideAlert();

        this.fetchParts();

        if(this.$root.isUserAuthValid){
            let userDetailsResponse = await this.$root.api.loadUserDetails(this.$root.sharedStore.user.userId);
            this.$root.sharedStore.setUserDetails(userDetailsResponse.data);
            await this.$root.readingList.updateFromUserDetails();
        }
    },
    watch: {
        $route(to, _from) {
            this.filter = to.params.filter;
        }
    },
    computed: {
        isFilteredAll() {
            return !this.filter || this.filter === 'all';
        },
        isFilteredReadingList() {
            return !this.filter || this.filter === 'reading-list';
        },
        filteredParts() {
            let filteredParts = [];
            if(this.isFilteredAll) {
                filteredParts = this.parts;
            } else if(this.isFilteredReadingList) {
                filteredParts = this.parts.filter((part) => this.$root.readingList.isPartInFeed(part));
            }

            if(this.search && this.search.length > 0)
                filteredParts = filteredParts.filter((part) => part.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1);

            return filteredParts.slice(0, 30);
        }
    },
    methods: {
        async fetchParts() {
            let response = await this.$root.api.loadLatestParts();
            this.parts = [];
            this.parts.push.apply(this.parts, response.data);
        }
    },
    components: {
        Part
    }
}
