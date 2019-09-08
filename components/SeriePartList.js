export default {
    template: `
    <div 
        class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
        :class="{'opacity-0': !open, 'pointer-events-none': !open}"
    >
       <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        
        <div class="modal-container bg-white w-11/12 md:max-w-3xl max-h-screen mx-auto rounded shadow-lg z-50 overflow-y-auto">
          
          <div class="modal-content py-4 text-left px-6">
            <div class="flex justify-between items-center pb-3">
              <p class="text-2xl font-bold">Part list</p>
              <div class="modal-close cursor-pointer z-50" @click="$emit('close')">
                <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
              </div>
            </div>
            
            <div v-for="volume in volumes" class="mt-2">
                <h2 class="font-bold text-lg">{{volume.title}}</h2>
                
                <div v-for="part in volume.parts" class="flex items-center">
                    <div class="mr-4">{{extractPartName(part.title, volume.title)}}</div>
                    
                    <div class="mr-1 bg-yellow-500 rounded px-2 py-1 mr-2 font-semibold text-xs" v-show="isReading(part)">Reading</div>
                    <div class="mr-1 bg-green-500 rounded px-2 py-1 mr-2 font-semibold text-xs" v-show="hasRead(part)">Read</div>
                    <div class="mr-1 bg-blue-700 rounded px-2 py-1 mr-2 font-semibold text-white text-xs" v-show="part.preview">Preview</div>
                    <div class="mr-1 bg-red-500 rounded px-2 py-1 mr-2 font-semibold text-white text-xs" v-show="part.expired">Expired</div>
                    
                    <div @click="markAsRead(part)" v-show="!hasRead(part) && signedIn" class="cursor-pointer text-xs bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-1 px-2 border border-blue-300 hover:border-blue-500 rounded mr-2">
                        Mark as read
                    </div>
                    <div @click="markAsUnread(part)" v-show="hasRead(part) && signedIn" class="cursor-pointer text-xs bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-1 px-2 border border-blue-300 hover:border-blue-500 rounded mr-2">
                        Mark as unread
                    </div>
                    <router-link :to="linkToPart(part)" v-show="!part.expired || part.preview" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold text-xs hover:text-gray-800 py-2 px-3 border border-blue-300 hover:border-blue-500 rounded mr-2">
                        Go to part
                    </router-link>
                </div>
            </div>
            
            <div class="flex justify-start pt-4">
              <button 
                class="bg-blue-700 hover:bg-transparent text-white hover:text-gray-700 font-semibold hover:text-gray-800 py-2 px-3 border border-blue-300 hover:border-blue-500 rounded outline-none"
                @click="$emit('close')"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
  `,
    props: ['open', 'volumes'],
    data() {
        return {};
    },
    methods: {
        extractPartName(partName, volumeName) {
            let index = partName.indexOf(volumeName);
            if(index < 0) { return partName; }

            return partName.slice(index + volumeName.length + 1);
        },
        signedIn() {
            return this.$root.isUserAuthValid;
        },
        linkToPart(part) {
            return '/series/' + part.serieId + '/part/' + part.id;
        },
        isReading(part) {
            return this.$root.readingList.readParts[part.id] && this.$root.readingList.readParts[part.id].completion > 0.1
                && this.$root.readingList.readParts[part.id].completion < 0.9;
        },
        hasRead(part) {
            return this.$root.readingList.readParts[part.id] && this.$root.readingList.readParts[part.id].completion > 0.9;
        },
        markAsRead(part) {
            this.$root.api.updatePartCompletionStatus(this.$root.sharedStore.user.userId, part.id, 1);
            this.$root.readingList.updateCompletion(part, 1);
        },
        markAsUnread(part) {
            this.$root.api.updatePartCompletionStatus(this.$root.sharedStore.user.userId, part.id, 0);
            this.$root.readingList.updateCompletion(part, 0);
        }
    }
}
