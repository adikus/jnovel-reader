import Serie from "../components/Serie.js"

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <div class="border-b-2 border-blue-700 flex justify-start items-baseline mb-4">
            <h1 class="text-2xl px-2 mr-10">Series</h1>
            <router-link to="/series/all" class="border-b-4 hover:border-blue-700 px-2 mr-10" :class="{'border-transparent': !isFilteredAll, 'border-blue-700': isFilteredAll}">
                All
            </router-link>
            <router-link to="/series/reading-list" class="border-b-4 hover:border-blue-700 px-2 mr-10" :class="{'border-transparent': !isFilteredReadingList, 'border-blue-700': isFilteredReadingList}">
                Reading&nbsp;list
            </router-link>
            <div class="w-full flex-grow"></div>
            <input v-model="search" class="flex-shrink shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" id="series-search" type="text" placeholder="Search">
        </div>
        
        <div class="flex content-center flex-wrap">
            <serie v-for="serie in filteredSeries" v-bind:key="serie.id" :serie="serie"></serie>
        </div>
    </div>
  `,
    data() {
        return {
            series: [],
            filter: 'all',
            search: ''
        }
    },
    async created() {
        this.filter = this.$route.params.filter || 'all';
        this.$root.sharedStore.hideAlert();

        let response = await this.$root.api.loadSeries();
        this.series.push.apply(this.series, response.data);

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
        filteredSeries() {
            let filteredSeries = [];
            if(this.isFilteredAll) {
                filteredSeries = this.series;
            } else if(this.isFilteredReadingList) {
                filteredSeries = this.series.filter((serie) => this.$root.readingList.isReadingSerie(serie));
            }

            if(this.search && this.search.length > 0)
            filteredSeries = filteredSeries.filter((serie) => serie.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1);

            return filteredSeries;
        }
    },
    components: {
        Serie
    }
}
