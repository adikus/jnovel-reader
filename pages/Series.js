import Serie from "../components/Serie.js"

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <div class="border-b-2 border-blue-700 flex justify-start items-baseline mb-4">
            <h1 class="text-2xl px-2 mr-10">Series</h1>
            <router-link to="/series/all" class="hover:border-b-4 border-blue-700 px-2 mr-10">
                All
            </router-link>
            <router-link to="/series/reading-list" class="hover:border-b-4 border-blue-700 px-2 mr-10">
                Reading&nbsp;list
            </router-link>
            <div class="w-full">&nbsp;</div>
        </div>
        
        <div class="flex content-center flex-wrap">
            <serie v-for="serie in series" v-bind:key="serie.id" :serie="serie"></serie>
        </div>
    </div>
  `,
    data() {
        return {
            series: []
        }
    },
    async created() {
        let response = await this.$root.api.loadSeries();
        this.series.push.apply(this.series, response.data);

        if(this.$root.sharedStore.isUserAuthValid()){
            let userDetailsResponse = await this.$root.api.loadUserDetails(this.$root.sharedStore.user.userId);
            this.$root.sharedStore.setUserDetails(userDetailsResponse.data);
            await this.$root.readingList.updateFromUserDetails(this.series);
        }
    },
    components: {
        Serie
    }
}
