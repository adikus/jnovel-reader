import Part from "../components/Part.js"
import SignInForm from "../components/SignInForm.js";

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <div class="border-b-2 border-blue-700 flex justify-start items-baseline mb-4">
            <h1 class="text-2xl px-2 sm:mr-10">Feed</h1>
            <router-link to="/feed/all" class="border-b-4 hover:border-blue-700 px-2 sm:mr-10" :class="{'border-transparent': !isFilteredAll, 'border-blue-700': isFilteredAll}">
                All
            </router-link>
            <router-link to="/feed/reading-list" class="border-b-4 hover:border-blue-700 px-2 sm:mr-10" :class="{'border-transparent': !isFilteredReadingList, 'border-blue-700': isFilteredReadingList}">
                Reading&nbsp;list
            </router-link>
            <div class="w-full flex-1"></div>
            <input v-model="search" class="flex-shrink min-w-0 shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" id="series-search" type="text" placeholder="Search">
        </div>
        
        <sign-in-form v-show="showSignInForm" @signed-in="loadReadingList" class="mt-4 flex-1"></sign-in-form>
        
        <div v-show="!showSignInForm" class="flex content-center flex-wrap">
            <part v-for="part in filteredParts" v-bind:key="part.id" :part="part"></part>
        </div>
    </div>
  `,
    data() {
        return {
            filter: 'all',
            search: ''
        }
    },
    async created() {
        this.filter = this.$route.params.filter || this.$root.sharedStore.preferredFilter;
        this.$root.sharedStore.hideAlert();
    },
    watch: {
        $route(to, _from) {
            if(to.params.filter) {
                this.$root.sharedStore.preferredFilter = to.params.filter;
                this.$root.sharedStore.savePreferences();
                this.filter = to.params.filter;
            } else {
                this.filter = this.$root.sharedStore.preferredFilter || 'all';
            }
        }
    },
    computed: {
        showSignInForm() {
            return this.filter === 'reading-list' && !this.$root.isUserAuthValid;
        },
        isFilteredAll() {
            return this.filter === 'all';
        },
        isFilteredReadingList() {
            return this.filter === 'reading-list';
        },
        filteredParts() {
            let filteredParts = [];
            if(this.isFilteredAll) {
                filteredParts = this.$root.sharedStore.feed;
            } else if(this.isFilteredReadingList) {
                filteredParts = this.$root.sharedStore.feed.filter((part) => this.$root.readingList.isPartInFeed(part));
            }

            if(this.search && this.search.length > 0) {
                filteredParts = this.$root.fuseSearchFilter(filteredParts, this.search);
            }

            return filteredParts.slice(0, 51);
        }
    },
    methods: {
        async loadReadingList() {
            let userDetailsResponse = await this.$root.api.loadUserDetails(this.$root.sharedStore.user.userId);
            this.$root.sharedStore.setUserDetails(userDetailsResponse.data);
            await this.$root.readingList.updateFromUserDetails();
        }
    },
    components: {
        Part, SignInForm
    }
}
