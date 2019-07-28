export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <h1 class="text-2xl px-2">Series</h1>
        
        <div class="flex content-center flex-wrap">
            <div style="background-clip: content-box" class="w-full lg:w-1/3 flex-grow p-2 bg-blue-200" v-for="serie in series">
                <div class="text-gray-700 text-xs w-full">
                    <div class="h-16 flex items-center bg-blue-300 p-2 w-100 text-sm">
                        <strong class="w-full text-center">{{serie.title}}</strong>
                    </div>
                    <p class="p-2">
                        <img :src="'https://d2dq7ifhe7bu0f.cloudfront.net/' + serie.attachments[0].fullpath" class="float-left w-1/3 mb-2 mr-2"/>
                        {{serie.description}}
                    </p>
                </div>
            </div>
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

        console.log(this.series);
    }
}
