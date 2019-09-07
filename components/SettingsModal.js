export default {
    template: `
    <div 
        class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
        :class="{'opacity-0': !open, 'pointer-events-none': !open}"
    >
       <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        
        <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
          
          <div class="modal-content py-4 text-left px-6">
            <div class="flex justify-between items-center pb-3">
              <p class="text-2xl font-bold">Settings</p>
              <div class="modal-close cursor-pointer z-50" @click="$emit('close')">
                <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
              </div>
            </div>
        
        
            <div class="text-left">
              <div class="mb-1"><strong>Theme</strong></div>
              
              <div class="flex items-center" v-for="(label, key) in appearances">
                <input 
                    :id="'settings-appearance-' + key" type="radio" name="settings-appearance" class="hidden"
                    :value="key" :checked="settings.appearance == key" @change="$emit('change', {appearance: key})"
                />
                <label :for="'settings-appearance-' + key" class="flex items-center cursor-pointer">
                    <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                    {{label}}
                </label>
              </div>
              
              <div class="mb-1 mt-4"><strong>Font</strong></div>
              
              <div class="flex flex-wrap">
                  <div class="flex items-center mr-2" v-for="(label, key) in fontSizes">
                    <input 
                        :id="'settings-font-size-' + key" type="radio" name="settings-font-size" class="hidden"
                        :value="key" :checked="settings.fontSize == key" @change="$emit('change', {fontSize: key})"
                    />
                    <label :for="'settings-font-size-' + key" class="flex items-center cursor-pointer">
                        <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                        {{label}}
                    </label>
                  </div>
              </div>
              
              <div class="mt-1 inline-block relative">
                  <select 
                    class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    v-model="settings.font"
                    @change="$emit('change', {font: $event.target.value})"
                  >
                    <option v-for="font in fontOptions">{{font}}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
              </div>
              
              <div class="mb-1 mt-4"><strong>Text alignment</strong></div>
              
              <div class="flex flex-wrap">
                  <div class="flex items-center mr-2" v-for="(label, key) in textAlignments">
                    <input 
                        :id="'settings-text-alignment-' + key" type="radio" name="settings-text-alignment" class="hidden"
                        :value="key" :checked="settings.textAlignment == key" @change="$emit('change', {textAlignment: key})"
                    />
                    <label :for="'settings-text-alignment-' + key" class="flex items-center cursor-pointer">
                        <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                        {{label}}
                    </label>
                  </div>
              </div>
                
              <div class="mb-1 mt-4"><strong>Reading direction</strong></div>
              
              <div class="flex flex-wrap">
                  <div class="flex items-center mr-2" v-for="(label, key) in readingDirections">
                    <input 
                        :id="'settings-reading-direction-' + key" type="radio" name="settings-reading-direction" class="hidden"
                        :value="key" :checked="settings.readingDirection == key" @change="$emit('change', {readingDirection: key})"
                    />
                    <label :for="'settings-reading-direction-' + key" class="flex items-center cursor-pointer">
                        <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                        {{label}}
                    </label>
                  </div>
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
    props: ['open', 'settings'],
    data() {
        return {
            appearances: {
                light: 'Light, high contrast',
                lightLowContrast: 'Light, low contrast',
                dark: 'Dark'
            },
            fontSizes: {
                extraSmall: 'Very small',
                small: 'Small',
                medium: 'Medium',
                large: 'Large',
                extraLarge: 'Very large'
            },
            readingDirections: {
                vertical: 'Vertical',
                horizontal: 'Horizontal'
            },
            textAlignments: {
                left: 'Left',
                justify: 'Justify'
            },
            fontOptions: [
                'Alegreya',
                'Alegreya Sans',
                'Spectral',
                'Crimson Text',
                'Lora',
                'Open Sans'
            ]
        }
    },
    methods: {
    }
}
