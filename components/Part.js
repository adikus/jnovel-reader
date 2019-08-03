import SerieDetailRow from "../components/SerieDetailRow.js"

export default {
    template: `
    <div style="background-clip: content-box" class="relative w-full lg:w-1/3 flex-grow p-2 mb-4 bg-blue-200">
        <div class="text-gray-700 text-xs w-full pb-12">
            <div class="h-24 flex flex-wrap items-center bg-blue-300 px-2 w-full">
                <strong class="w-full text-center text-base">{{part.title}}</strong>
                <span class="w-full text-center text-xxs">
                    ({{part.titleShort}} / {{part.titleOriginal}})
                </span>
            </div>
            <div class="flex items-start">
                <div class="w-1/3">
                    <img :src="coverImageUrl" class="w-full mb-2"/>
                    <serie-detail-row key-name="Author" :value="part.author"></serie-detail-row>
                    <serie-detail-row key-name="Illustrator" :value="part.illustrator"></serie-detail-row>
                    <serie-detail-row key-name="Translator" :value="part.translator"></serie-detail-row>
                    <serie-detail-row key-name="Editor" :value="part.editor"></serie-detail-row>
                    <serie-detail-row key-name="Released" :value="releasedAtHumanized"></serie-detail-row>
                </div>
                <p class="p-2 flex-grow w-2/3">
                    {{part.description}}
                    <strong class="block mt-2 font-semibold">
                        {{part.tags}}
                    </strong>
                </p>
            </div>
            <div style="background-clip: content-box" class="h-12 bg-blue-300 px-2 w-full absolute bottom-0 left-0 flex items-center justify-end">
                <div class="mr-1 bg-yellow-500 rounded px-2 py-1 font-semibold" v-show="isReading">Reading</div>
                <div class="mr-1 bg-green-500 rounded px-2 py-1 font-semibold" v-show="hasRead">Read</div>
                <div class="mr-1 bg-blue-700 rounded px-2 py-1 font-semibold text-white" v-show="part.preview">Preview</div>
                <div class="mr-1 bg-red-500 rounded px-2 py-1 font-semibold text-white" v-show="part.expired">Expired</div>
                <div @click="markAsRead" v-show="!hasRead && signedIn" class="cursor-pointer bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-4 border border-blue-300 hover:border-blue-500 rounded mx-2">
                    Mark as read
                </div>
                <div @click="markAsUnread" v-show="hasRead && signedIn" class="cursor-pointer bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-4 border border-blue-300 hover:border-blue-500 rounded mx-2">
                    Mark as unread
                </div>
                <router-link :to="linkToPart" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-4 border border-blue-300 hover:border-blue-500 rounded mx-2">
                    Go to part
                </router-link>
            </div>
        </div>
        </div>
  `,
    props: ['part'],
    components: {
        SerieDetailRow
    },
    computed: {
        signedIn() {
            return this.$root.isUserAuthValid;
        },
        linkToPart() {
            return '/series/' + this.part.serieId + '/part/' + this.part.id;
        },
        coverImageUrl() {
            let attachments = this.part.attachments;
            attachments.sort((attachA, attachB) => attachB.size - attachA.size);
            let filteredAttachments = attachments.filter((attachment) => attachment.filename.toLowerCase().indexOf('cover') > -1);
            return 'https://d2dq7ifhe7bu0f.cloudfront.net/' + (filteredAttachments[0] || attachments[0]).fullpath;
        },
        isReading() {
            return this.$root.readingList.readParts[this.part.id] && this.$root.readingList.readParts[this.part.id].completion > 0.1
                && this.$root.readingList.readParts[this.part.id].completion < 0.9;
        },
        hasRead() {
            return this.$root.readingList.readParts[this.part.id] && this.$root.readingList.readParts[this.part.id].completion > 0.9;
        },
        releasedAtHumanized() {
            let delta = Math.round((+new Date - new Date(this.part.launchDate)) / 1000);

            let minute = 60;
            let hour = minute * 60;
            let day = hour * 24;
            let month = day * 30;
            let year = day * 365;

            if (delta < 30) {
                return 'just now';
            } else if (delta < minute) {
                return delta + ' seconds ago';
            } else if (delta < 2 * minute) {
                return 'a minute ago'
            } else if (delta < hour) {
                return Math.floor(delta / minute) + ' minutes ago';
            } else if (Math.floor(delta / hour) === 1) {
                return '1 hour ago'
            } else if (delta < day) {
                return Math.floor(delta / hour) + ' hours ago';
            } else if (delta < day * 2) {
                return 'yesterday';
            } else if (delta < month) {
                return  Math.floor(delta / day) + ' days ago';
            } else if (Math.floor(delta / month) === 1) {
                return '1 month ago';
            } else if (delta < year) {
                return  Math.floor(delta / month) + ' months ago';
            } else if (Math.floor(delta / year) === 1) {
                return '1 year ago';
            } else {
                return  Math.floor(delta / year) + ' years ago';
            }
        }
    },
    methods: {
        markAsRead() {
            this.$root.api.updatePartCompletionStatus(this.$root.sharedStore.user.userId, this.part.id, 1);
            if(this.$root.readingList.readParts[this.part.id]){
                Vue.set(this.$root.readingList.readParts[this.part.id], 'completion', 1);
            } else {
                Vue.set(this.$root.readingList.readParts, this.part.id, {completion: 1, maxCompletion: 1});
            }
        },
        markAsUnread() {
            this.$root.api.updatePartCompletionStatus(this.$root.sharedStore.user.userId, this.part.id, 0);
            if(this.$root.readingList.readParts[this.part.id]){
                Vue.set(this.$root.readingList.readParts[this.part.id], 'completion', 0);
            } else {
                Vue.set(this.$root.readingList.readParts, this.part.id, {completion: 0, maxCompletion: 0});
            }
        }
    }
}
