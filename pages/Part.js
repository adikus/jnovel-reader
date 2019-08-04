import SignInForm from "../components/SignInForm.js"

export default {
    template: `
    <div class="container mx-auto pt-3 text-gray-700 flex-1 flex flex-col">
        <h1 class="text-2xl px-2 border-b-2 border-blue-700">{{part.title}}</h1>
        
        <sign-in-form v-show="showSignInForm" @signed-in="loadPartData" class="mt-4 flex-1"></sign-in-form>
        
        <div v-html="partData" v-show="partData" @click="toggleFooterTouch" id="part-data" class="px-2 py-4 bg-white flex-1"></div>
        
        <div v-show="!showSignInForm && !partData" class="flex-1 w-full"></div>
        
        <footer class="w-full sticky bottom-0">
            <div 
                class="bg-blue-700 p-4 flex" 
                :class="{'opacity-0': !showFooter && partData}" 
                @mouseover="showFooterSmart" 
                @mouseleave="showFooter = false"
                style="transition-property: opacity; transition-duration: 200ms"
            >
                <router-link 
                    v-if="showFooter"
                    v-show="previousPartId !== undefined" 
                    :to="'/series/' + part.serieId + '/part/' + previousPartId" 
                    class="flex-shrink text-left block lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
                >
                    < Previous Part 
                </router-link>
                <div class="flex-grow">&nbsp;</div>
                <router-link 
                    v-if="showFooter"
                    v-show="nextPartId !== undefined" 
                    :to="'/series/' + part.serieId + '/part/' + nextPartId" 
                    class="flex-shrink text-right block lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
                >
                    Next Part > 
                </router-link>
            </div>
            <div class="w-full bg-white" style="height: 5px" v-show="partData">
                <div class="bg-blue-700 h-full" :style="{width: (100 * progress) + '%'}"></div>
            </div>
        </footer>
    </div>
  `,
    data() {
        return {
            partId: null,
            part: {},
            partData: "",
            showSignInForm: false,
            showFooter: true,
            progress: 0,
            volumes: []
        }
    },
    created() {
        this.initPart();
    },
    mounted() {
        window.addEventListener('scroll', () => {
            let scrollPos = window.scrollY;
            let winHeight = window.innerHeight;
            let docHeight = document.documentElement.scrollHeight;
            this.progress = scrollPos / (docHeight - winHeight);
            this.showFooter = this.progress > 0.99;
        })
    },
    watch: {
        $route(to, _from) {
            this.initPart();
        }
    },
    computed: {
        sortedSerieParts() {
            return this.volumes.map(volume => volume.parts).flat().filter(part => !part.expired);
        },

        nextPartId() {
            let nextPart = (this.sortedSerieParts || []).filter(part => part.partNumber - 1 === this.part.partNumber)[0];
            console.log(nextPart, nextPart && nextPart.id);
            return nextPart && nextPart.id;
        },

        previousPartId() {
            let previousPart = (this.sortedSerieParts || []).filter(part => part.partNumber + 1 === this.part.partNumber)[0];
            console.log(previousPart, previousPart && previousPart.id);
            return  previousPart && previousPart.id;
        }
    },
    methods: {
        async initPart() {
            this.partData = "";
            this.$root.sharedStore.hideAlert();
            this.volumes = await this.loadVolumes();

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
            window.scrollTo(0, 0);
        },

        async loadVolumes() {
            let partsResponse = await this.$root.api.loadSerieParts(this.$route.params.serieId);
            console.log(partsResponse.data);
            return partsResponse.data;
        },

        async findLatestPart() {
            this.volumes.sort((volumeA, volumeB) => volumeB.volumeNumber - volumeA.volumeNumber);
            let parts = this.volumes[0].parts;
            parts.sort((partA, partB) => partB.partNumber - partA.partNumber);
            return parts[0];
        },

        async loadPartData() {
            let partDataResponse = await this.$root.api.loadPartData(this.partId);
            this.partData = partDataResponse.data.dataHTML;

            this.$root.sharedStore.hideAlert();
            this.showSignInForm = false;
        },

        showFooterSmart() {
            let delta = new Date().getTime() - this.$root.sharedStore.touchStart.getTime();
            setTimeout(() => { this.showFooter = true }, 10);
        },

        toggleFooterTouch() {
            let delta = new Date().getTime() - this.$root.sharedStore.touchStart.getTime();
            if(delta < 100) {
                this.showFooter = !this.showFooter;
            }
        }
    },
    components: {
        SignInForm
    }
}
