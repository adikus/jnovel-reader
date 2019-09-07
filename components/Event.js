import dateHelper from "../services/date.js"

export default {
    template: `
    <div style="background-clip: content-box" class="relative w-full lg:w-1/5 flex-grow p-2 mb-4 bg-blue-200">
        <div class="text-gray-700 text-xs w-full pb-12">
            <div class="h-24 flex flex-wrap items-center bg-blue-300 px-2 w-full">
                <strong class="w-full text-center text-base">{{event.name}}</strong>
                <span class="w-full text-center text-xs">
                    {{event.details}}
                </span>
            </div>
            <img :src="coverImageUrl" class="w-full"/>
            <div style="background-clip: content-box" class="text-m h-12 bg-blue-300 px-2 w-full absolute bottom-0 left-0 flex items-center justify-center">
                <strong>Releases {{releasesInHumanized}}</strong>
            </div>
        </div>
    </div>  
  `,
    props: ['event'],
    computed: {
        coverImageUrl() {
            let attachments = this.event.attachments;
            attachments.sort((attachA, attachB) => attachB.size - attachA.size);
            return 'https://d2dq7ifhe7bu0f.cloudfront.net/' + (attachments[0]).fullpath;
        },
        releasesInHumanized() {
            return dateHelper.timeDifferenceHumanized(this.event.date);
        },
    }
}
