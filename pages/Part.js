import SignInForm from "../components/SignInForm.js"

export default {
    template: `
    <div class="container mx-auto py-3 text-gray-700">
        <h1 class="text-2xl px-2 border-b-2 border-blue-700">{{part.title}}</h1>
        
        <sign-in-form v-show="showSignInForm" @signed-in="loadPartData" class="mt-4"></sign-in-form>
        
        <div v-html="partData" id="part-data" class="px-2 py-4 bg-white"></div>
    </div>
  `,
    data() {
        return {
            partId: null,
            part: {},
            partData: "",
            showSignInForm: false
        }
    },
    async created() {
        this.$root.sharedStore.hideAlert();
        let partId = this.$route.params.id;

        if(partId === "latest") {
            this.part = await this.findLatestPart();
            this.partId = this.part.id;
        } else {
            let partResponse = await this.$root.api.loadPart(this.$route.params.id);
            this.part = partResponse.data;
            this.partId = this.part.id;
        }

        try {
            await this.loadPartData();
        } catch(error) {
            if(error.response.data.error.message === 'You cannot access this content') {
                this.$root.sharedStore.setAlert('You must sign in to access this part');
            }
            this.showSignInForm = true;
        }
    },
    methods: {
        async findLatestPart() {
            let partsResponse = await this.$root.api.loadSerieParts(this.$route.params.serieId);
            let volumes = partsResponse.data;
            volumes.sort((volumeA, volumeB) => volumeB.volumeNumber - volumeA.volumeNumber);
            let parts = volumes[0].parts;
            parts.sort((partA, partB) => partB.partNumber - partA.partNumber);
            return parts[0];
        },
        async loadPartData() {
            let partDataResponse = await this.$root.api.loadPartData(this.partId);
            this.partData = partDataResponse.data.dataHTML;

            this.$root.sharedStore.hideAlert();
            this.showSignInForm = false;
        }
    },
    components: {
        SignInForm
    }
}
