export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <h1 class="text-2xl px-2">Series</h1>
        
        <div class="flex content-center flex-wrap">
            <div style="background-clip: content-box" class="relative w-full lg:w-1/3 flex-grow p-2 mb-4 bg-blue-200" v-for="serie in series">
                <div class="text-gray-700 text-xs w-full pb-12">
                    <div class="h-24 flex flex-wrap items-center bg-blue-300 px-2 w-full">
                        <strong class="w-full text-center text-base">{{serie.title}}</strong>
                        <span class="w-full text-center text-xxs">
                            ({{serie.titleShort}} / {{serie.titleOriginal}})
                        </span>
                    </div>
                    <div class="flex items-start">
                        <div class="w-1/3">
                            <img :src="'https://d2dq7ifhe7bu0f.cloudfront.net/' + serie.attachments[0].fullpath" class="w-full mb-2"/>
                            <strong class="ml-2 block">Author:</strong><span class="ml-5 block">{{serie.author}}</span>
                            <strong class="ml-2 block">Illustrator:</strong><span class="ml-5 block">{{serie.illustrator}}</span>
                            <strong class="ml-2 block">Translator:</strong><span class="ml-5 block">{{serie.translator}}</span>
                            <strong class="ml-2 block">Editor:</strong><span class="ml-5 block">{{serie.editor}}</span>
                        </div>
                        <p class="p-2 flex-grow w-2/3">
                            {{serie.description}}
                            <strong class="block mt-2">
                                {{serie.tags}}
                            </strong>
                        </p>
                    </div>
                    <div style="background-clip: content-box" class="h-12 bg-blue-300 px-2 w-full absolute bottom-0 left-0">
                    </div>
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
    }
}
