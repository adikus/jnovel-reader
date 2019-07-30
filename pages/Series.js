import Serie from "../components/Serie.js"

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <h1 class="text-2xl px-2 border-b-2 border-blue-700 mb-4">Series</h1>
        
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
