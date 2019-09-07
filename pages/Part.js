import SignInForm from "../components/SignInForm.js"

export default {
    template: `
    <div class="container mx-auto pt-3 text-gray-700 flex-1 flex flex-col" :class="{'reading-horizontal': horizontalReading}">
        <h1 class="text-2xl px-2 border-b-2 border-blue-700">{{part.title}}</h1>
        
        <sign-in-form v-show="showSignInForm" @signed-in="loadPartData" class="mt-4 flex-1"></sign-in-form>
        
        <div class="w-full h-3 bg-white flex-shrink"></div>
        <div v-html="adjustedPartData" v-show="partData" @click="toggleFooterTouch" id="part-data" class="px-2 bg-white flex-1 max-h-full overflow-hidden"></div>
        
        <div v-show="!showSignInForm && !partData" class="flex-1 w-full"></div>
        
        <footer class="w-full sticky bottom-0">
            <div 
                class="bg-blue-700 p-4 flex" 
                :class="{'opacity-0': !showFooter && partData && !horizontalReading}" 
                @mouseover="showFooterSmart" 
                @mouseleave="showFooter = false"
                style="transition-property: opacity; transition-duration: 200ms"
            >
                <router-link 
                    v-if="(showFooter && !(horizontalReading && horizontalReadingPage > 0)) || (horizontalReading && horizontalReadingPage == 0)"
                    v-show="previousPartId !== undefined" 
                    :to="'/series/' + part.serieId + '/part/' + previousPartId" 
                    class="flex-shrink text-left block lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
                >
                    < Previous Part
                </router-link>
                <div
                    v-if="horizontalReading && horizontalReadingPage > 0" 
                    class="flex-shrink text-left block lg:inline-block lg:mt-0 text-blue-200 hover:text-white cursor-pointer"
                    @click="goToPreviousPage"
                >
                    < Previous Page 
                </div>
                <div class="flex-grow">
                    <div 
                        class="text-center text-blue-200 hover:text-white cursor-pointer" 
                        @click="changeReadingDirection"
                    >
                        Direction
                    </div>
                </div>
                <router-link 
                    v-if="(showFooter && !(horizontalReading && !onLastPage)) || (horizontalReading && onLastPage)"
                    v-show="nextPartId !== undefined" 
                    :to="'/series/' + part.serieId + '/part/' + nextPartId" 
                    class="flex-shrink text-right block lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
                >
                    Next Part > 
                </router-link>
                <div
                    v-if="horizontalReading && !onLastPage" 
                    class="flex-shrink text-left block lg:inline-block lg:mt-0 text-blue-200 hover:text-white cursor-pointer"
                    @click="goToNextPage"
                >
                    Next Page >
                </div>
            </div>
            <div class="w-full bg-white" style="height: 5px" v-show="partData">
                <div class="bg-blue-700 h-full" :style="{width: (100 * progress) + '%'}" style="transition-property: width; transition-duration: 500ms"></div>
            </div>
        </footer>
    </div>
  `,
    data() {
        return {
            part: {},
            partData: "",
            showSignInForm: false,
            showFooter: true,
            progress: 0,
            volumes: [],
            horizontalReading: false,
            horizontalReadingBreakpoints: [],
            horizontalReadingPage: 0
        }
    },
    created() {
        this.horizontalReading = this.$root.sharedStore.retrieveReadingDirection();
        this.initPart();
        this.$root.noSleep.enable();
        console.log('NoSleep enabled');
    },
    mounted() {
        window.addEventListener('scroll', () => {
            let scrollPos = window.scrollY;
            let winHeight = window.innerHeight;
            let docHeight = document.documentElement.scrollHeight;
            if(!this.horizontalReading) {
                this.progress = scrollPos / (docHeight - winHeight);
                this.showFooter = this.progress > 0.99;
            }
        })
    },
    watch: {
        $route(to, _from) {
            this.initPart();
        }
    },
    computed: {
        adjustedPartData() {
            return this.horizontalReading ? this.horizontalReadingPartData : this.partData;
        },

        horizontalReadingPartData() {
            let partData = this.partData;
            partData = partData.replace(/<p(.*?)>/ig, '<p$1><span>');
            partData = partData.replace(/<\/p>/ig, '</span></p>');
            partData = partData.replace(/<em(.*?)<em>/ig, '<em$1></em>');
            partData = partData.replace(/<em(.*?)>/ig, '</span><em$1><span>');
            partData = partData.replace(/<\/em>/ig, '</span></em><span>');
            partData = partData.replace(/\. /g, '. </span><span>');
            partData = partData.replace(/, /g, ', </span><span>');
            return partData + '<section class="reading-spacer"></section>';
        },

        sortedSerieParts() {
            return this.volumes.map(volume => volume.parts).flat().filter(part => !part.expired);
        },

        nextPartId() {
            let nextPart = (this.sortedSerieParts || []).filter(part => part.partNumber - 1 === this.part.partNumber)[0];
            return nextPart && nextPart.id;
        },

        previousPartId() {
            let previousPart = (this.sortedSerieParts || []).filter(part => part.partNumber + 1 === this.part.partNumber)[0];
            return  previousPart && previousPart.id;
        },

        onLastPage() {
            return this.horizontalReadingBreakpoints.length - 1 <= this.horizontalReadingPage;
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
            } else {
                let partResponse = await this.$root.api.loadPart(this.$route.params.id);
                this.part = partResponse.data;
            }

            try {
                await this.loadPartData();
            } catch(error) {
                if(error.response.data.error.message === 'You cannot access this content') {
                    this.$root.sharedStore.setAlert('You must sign in to access this part');
                    this.showSignInForm = true;
                } else {
                    this.$root.sharedStore.setAlert(error.response.data.error.message);
                }
            }
            window.scrollTo(0, 0);
        },

        async loadVolumes() {
            let partsResponse = await this.$root.api.loadSerieParts(this.$route.params.serieId);
            return partsResponse.data;
        },

        async findLatestPart() {
            this.volumes.sort((volumeA, volumeB) => volumeB.volumeNumber - volumeA.volumeNumber);
            let parts = this.volumes[0].parts;
            parts.sort((partA, partB) => partB.partNumber - partA.partNumber);
            return parts[0];
        },

        async loadPartData() {
            let partDataResponse = await this.$root.api.loadPartData(this.part.id);
            this.partData = partDataResponse.data.dataHTML;

            this.$root.sharedStore.hideAlert();
            this.showSignInForm = false;

            if(this.horizontalReading) {
                setTimeout(() => this.initHorizontalReading(), 100);
            }
        },

        changeReadingDirection() {
            this.horizontalReading = !this.horizontalReading;
            this.$root.sharedStore.saveReadingDirection(this.horizontalReading);
            if(this.horizontalReading) {
                setTimeout(() => this.initHorizontalReading(), 100);
            }
        },

        initHorizontalReading() {
           let partDataContainer = document.getElementById('part-data');
           partDataContainer.scrollTop = 0;
           this.horizontalReadingPage = 0;
           let breakpoints = [];
           let lastBreakpointOffset = -999999;
           for(let outerTag of partDataContainer.children) {
               if(outerTag.tagName.toLowerCase() === 'section') {
                   continue;
               }

               let innerTags = [outerTag];
               if(outerTag.tagName.toLowerCase() === 'p') {
                   innerTags = outerTag.children;
               }
               for(let tag of innerTags) {
                   let containerBottom = partDataContainer.offsetTop + lastBreakpointOffset + partDataContainer.clientHeight;
                   let tagBottom = tag.offsetTop + tag.offsetHeight;

                   if(tagBottom + 15 > containerBottom || tag.tagName.toLowerCase() === 'h1' || tag.tagName.toLowerCase() === 'img') {
                       breakpoints.push(tag);
                       lastBreakpointOffset = tag.offsetTop - partDataContainer.offsetTop;
                   }
               }
           }
           this.horizontalReadingBreakpoints = [];
           this.horizontalReadingBreakpoints.push.apply(this.horizontalReadingBreakpoints, breakpoints);
           this.updateHorizontalReadingScrollBar();
           this.updateHorizontalReadingVisibility();
        },

        goToPreviousPage() {
            this.horizontalReadingPage = this.horizontalReadingPage - 1;
            this.horizontalReadingBreakpoints[this.horizontalReadingPage].scrollIntoView();
            this.updateHorizontalReadingScrollBar();
            this.updateHorizontalReadingVisibility();
        },

        goToNextPage() {
            this.horizontalReadingPage = this.horizontalReadingPage + 1;
            this.horizontalReadingBreakpoints[this.horizontalReadingPage].scrollIntoView();
            this.updateHorizontalReadingScrollBar();
            this.updateHorizontalReadingVisibility();
        },

        updateHorizontalReadingVisibility() {
            let partDataContainer = document.getElementById('part-data');
            for(let outerTag of partDataContainer.children) {
                let innerTags = [outerTag];
                if(outerTag.tagName.toLowerCase() === 'p') {
                    innerTags = outerTag.children;
                }
                for(let tag of innerTags) {
                    tag.classList.remove('invisible');
                    tag.classList.remove('breakpoint-clearfix');
                }
            }

            let insidePage = false;
            let currentBreakpoint = this.horizontalReadingBreakpoints[this.horizontalReadingPage];

            for(let outerTag of partDataContainer.children) {
                let innerTags = [outerTag];
                if(outerTag.tagName.toLowerCase() === 'p') {
                    innerTags = outerTag.children;
                }
                for(let tag of innerTags) {
                    if(tag === currentBreakpoint) {
                        insidePage = true;
                        if(tag.offsetLeft - partDataContainer.offsetLeft > 30) {
                            tag.classList.add('breakpoint-clearfix');
                        }
                    } else if(this.horizontalReadingBreakpoints.indexOf(tag) > -1) {
                        insidePage = false;
                    }

                    if(!insidePage) {
                        tag.classList.add('invisible');
                    }
                }
            }
        },

        updateHorizontalReadingScrollBar() {
            let partDataContainer = document.getElementById('part-data');
            let scrollHeight = partDataContainer.scrollHeight;
            let scrollTop = partDataContainer.scrollTop;
            let height = partDataContainer.clientHeight;
            this.progress = Math.min(1, scrollTop / (scrollHeight - height - window.innerHeight));
        },

        showFooterSmart() {
            let delta = this.$root.sharedStore.touchStart && new Date().getTime() - this.$root.sharedStore.touchStart.getTime();
            if(delta && delta < 100) {
                setTimeout(() => { this.showFooter = true }, 10);
            } else {
                this.showFooter = true;
            }
        },

        toggleFooterTouch() {
            let delta = this.$root.sharedStore.touchStart && new Date().getTime() - this.$root.sharedStore.touchStart.getTime();
            if(delta && delta < 100) {
                this.showFooter = !this.showFooter;
            }
        }
    },
    components: {
        SignInForm
    }
}
