import SerieDetailRow from "../components/SerieDetailRow.js"

export default {
    template: `
    <div style="background-clip: content-box" class="relative w-full lg:w-1/3 flex-grow p-2 mb-4 bg-blue-200">
        <div class="text-gray-700 text-xs w-full pb-12">
            <div class="h-24 flex flex-wrap items-center bg-blue-300 px-2 w-full">
                <strong class="w-full text-center text-base">{{serie.title}}</strong>
                <span class="w-full text-center text-xxs">
                    ({{serie.titleShort}} / {{serie.titleOriginal}})
                </span>
            </div>
            <div class="flex items-start">
                <div class="w-1/3">
                    <img :src="coverImageUrl" class="w-full mb-2"/>
                    <serie-detail-row key-name="Author" :value="serie.author"></serie-detail-row>
                    <serie-detail-row key-name="Illustrator" :value="serie.illustrator"></serie-detail-row>
                    <serie-detail-row key-name="Translator" :value="serie.translator"></serie-detail-row>
                    <serie-detail-row key-name="Editor" :value="serie.editor"></serie-detail-row>
                </div>
                <p class="p-2 flex-grow w-2/3">
                    {{serie.description}}
                    <strong class="block mt-2 font-semibold">
                        {{serie.tags}}
                    </strong>
                </p>
            </div>
            <div style="background-clip: content-box" class="h-12 bg-blue-300 px-2 w-full absolute bottom-0 left-0 flex items-center justify-end">
                <router-link :to="linkToLatestPart" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-4 border border-blue-300 hover:border-blue-500 rounded mx-2">
                    Go to latest part
                </router-link>
            </div>
        </div>
        </div>
  `,
    props: ['serie'],
    components: {
        SerieDetailRow
    },
    computed: {
        linkToLatestPart() {
            return '/series/' + this.serie.id + '/part/latest';
        },
        coverImageUrl() {
            let attachments = this.serie.attachments;
            attachments.sort((attachA, attachB) => attachB.size - attachA.size);
            return 'https://d2dq7ifhe7bu0f.cloudfront.net/' + attachments[0].fullpath;
        }
    }
}
