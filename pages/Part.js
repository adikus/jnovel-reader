import SignInForm from "../components/SignInForm.js"
import SettingsModal from "../components/SettingsModal.js"
import SeriePartList from "../components/SeriePartList.js"

export default {
    template: `
    <div class="container mx-auto pt-3 text-gray-700 flex-1 flex flex-col" :class="{'reading-horizontal': horizontalReading}">
        <h1 class="text-2xl px-2 border-b-2 border-blue-700">{{part.title}}</h1>
        
        <sign-in-form v-show="showSignInForm" @signed-in="loadPartData" class="mt-4 flex-1"></sign-in-form>
        
        <div class="w-full h-3 bg-white flex-shrink" :class="[backgroundColorClass]"></div>
        <div 
            ref="partData"
            v-html="adjustedPartData" 
            @click="toggleFooterTouch"
            id="part-data"
            class="px-2 flex-1 max-h-full overflow-hidden"
            :class="[backgroundColorClass, textColorClass, fontSizeClass, textAlignmentClass]"
            :style="{ 'font-family': settings.font, 'min-height': minPartHeight + 'px' }"
        ></div>
        
        <div v-show="!showSignInForm && !partData" class="flex-1 w-full"></div>
        
        <settings-modal :open="showSettings" :settings="settings" @close="showSettings=false" @change="changeSettings"></settings-modal>
        <serie-part-list :open="showPartList" :volumes="volumes" @close="showPartList=false"></serie-part-list>
        
        <footer class="w-full sticky bottom-0">
            <div
                class="bg-blue-700 p-4 flex justify-center" 
                :class="{'opacity-0': !showFooter && partData && !horizontalReading}"
                v-if="!showPartList && !showSettings"
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
                <div class="flex-shrink mx-4 md:mx-10 flex">
                    <div 
                        class="text-center text-blue-200 hover:text-white cursor-pointer mr-2" 
                        @click="showPartList = true"
                    >
                        <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <title>Part List</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                        </svg>
                    </div>
                    <div 
                        class="text-center text-blue-200 hover:text-white cursor-pointer" 
                        @click="showSettings = true"
                    >
                        <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <title>Settings</title>
                            <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
                        </svg>
                    </div>
                </div>
                <router-link 
                    v-if="(showFooter && !(horizontalReading && !onLastPage)) || (horizontalReading && onLastPage)"
                    v-show="nextPartId !== undefined" 
                    :to="'/series/' + part.serieId + '/part/' + nextPartId" 
                    class="flex-shrink text-right block lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
                >
                    Next Part > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </router-link>
                <div
                    v-if="horizontalReading && !onLastPage" 
                    class="flex-shrink text-left block lg:inline-block lg:mt-0 text-blue-200 hover:text-white cursor-pointer"
                    @click="goToNextPage"
                >
                    Next Page > &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            showSettings: false,
            showPartList: false,
            showFooter: true,
            progress: 0,
            volumes: [],
            horizontalReading: false,
            horizontalReadingBreakpoints: [],
            horizontalReadingPage: 0,
            settings: {}
        }
    },
    created() {
        this.settings = this.$root.sharedStore.retrieveSettings();
        this.horizontalReading = this.settings.readingDirection === 'horizontal';
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
        });

        window.history.scrollRestoration = 'auto'; // Allow keeping scroll position on page refresh
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
        },

        backgroundColorClass() {
            return {
                'light': 'bg-white',
                'lightLowContrast': 'bg-gray-100',
                'dark': 'bg-gray-800'
            }[this.settings.appearance]
        },

        textColorClass() {
            return {
                'light': 'text-gray-800',
                'lightLowContrast': 'text-gray-700',
                'dark': 'text-white'
            }[this.settings.appearance]
        },

        fontSizeClass() {
            return 'font-' + this.settings.fontSize;
        },

        textAlignmentClass() {
            return 'text-' + this.settings.textAlignment;
        },

        minPartHeight() {
            if(this.partData) return 0;

            return this.$root.sharedStore.retrieveLastPartHeight() || 1000;
        }
    },
    methods: {
        async initPart() {
            this.showPartList = false;
            this.partData = "";
            this.$root.sharedStore.hideAlert();
            this.volumes = await this.loadVolumes();

            let partId = this.$route.params.id;
            if(partId === "latest") {
                this.part = await this.findLatestPart();
            } else if(partId === "preview") {
                this.part = await this.findPreview();
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

        async findPreview() {
            this.volumes.sort((volumeA, volumeB) => volumeA.volumeNumber - volumeB.volumeNumber);
            let parts = this.volumes[0].parts.filter(part => part.preview);
            parts.sort((partA, partB) => partA.partNumber - partB.partNumber);
            return parts[0];
        },

        async loadPartData() {
            let partDataResponse = await this.$root.api.loadPartData(this.part.id);
            this.partData = partDataResponse.data.dataHTML;

            this.$root.sharedStore.hideAlert();
            this.showSignInForm = false;

            setTimeout(() => {  this.$root.sharedStore.saveLastPartHeight(this.$refs.partData.clientHeight) }, 50);

            if(this.horizontalReading) {
                setTimeout(() => this.initHorizontalReading(), 100);
            }
        },

        initHorizontalReading() {
           let partDataContainer = this.$refs.partData;
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
            let partDataContainer = this.$refs.partData;
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
            let partDataContainer = this.$refs.partData;
            let scrollHeight = partDataContainer.scrollHeight;
            let scrollTop = partDataContainer.scrollTop;
            let height = partDataContainer.clientHeight;
            this.progress = Math.min(1, scrollTop / (scrollHeight - height - window.innerHeight));
        },

        showFooterSmart() {
            if(this.showPartList || this.showSettings) { return; }

            let delta = this.$root.sharedStore.touchStart && new Date().getTime() - this.$root.sharedStore.touchStart.getTime();
            if(delta && delta < 100) {
                setTimeout(() => { this.showFooter = true }, 10);
            } else {
                this.showFooter = true;
            }
        },

        toggleFooterTouch() {
            if(this.showPartList || this.showSettings) {
                this.showFooter = false;
                return;
            }

            let delta = this.$root.sharedStore.touchStart && new Date().getTime() - this.$root.sharedStore.touchStart.getTime();
            if(delta && delta < 100) {
                this.showFooter = !this.showFooter;
            }
        },
        changeSettings(newSettings) {
            let wasHorizontalReading = this.settings.readingDirection === 'horizontal';

            this.settings = Object.assign({}, this.settings, newSettings );
            this.$root.sharedStore.saveSettings(this.settings);
            this.horizontalReading = this.settings.readingDirection === 'horizontal';

            if(this.horizontalReading && !wasHorizontalReading) {
                setTimeout(() => this.initHorizontalReading(), 100);
            }
        }
    },
    components: {
        SignInForm, SettingsModal, SeriePartList
    }
}
