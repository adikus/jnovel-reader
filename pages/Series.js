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
        </div>
        
        <div class="flex content-center flex-wrap">
            <serie v-for="serie in filteredSeries" v-bind:key="serie.id" :serie="serie"></serie>
        </div>
    </div>
  `,
    data() {
        return {
            series: [],
            filter: 'all'
        }
    },
    async created() {
        this.filter = this.$route.params.filter || 'all';

        let response = await this.$root.api.loadSeries();
        this.series.push.apply(this.series, response.data);

        if(this.$root.sharedStore.isUserAuthValid()){
            let userDetailsResponse = await this.$root.api.loadUserDetails(this.$root.sharedStore.user.userId);
            this.$root.sharedStore.setUserDetails(userDetailsResponse.data);
            await this.$root.readingList.updateFromUserDetails(this.series);
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
            if(this.isFilteredAll) {
                return this.series;
            } else if(this.isFilteredReadingList) {
                return this.series.filter((serie) => this.$root.readingList.isReading(serie));
            }
        }
    },
    components: {
        Serie
    }
}
