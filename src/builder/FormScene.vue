<template>
    <div class="form-body">
      <div class="form-container">
        <div class="form-row">
            <button id="videoUpload" role="button" class="icon-button"
                title="Upload the main video file"
                @change="changeEl(updatedData[sceneNum])"
                @click="uploadFile"
            >
                <icon-upload-cloud title="Upload the main video file"/>
            </button>
            <label for="video">Video:</label>
            <input id="video"
              v-model="updatedData[sceneNum].videoBackground"
              placeholder="required"
              @change="changeEl(updatedData[sceneNum])"
            >
        </div>
        <div class="form-row">
            <button id="captionUpload" role="button" class="icon-button"
                title="Upload an optional vtt captions file for this video."
                @change="changeEl(updatedData[sceneNum])"
                @click="uploadFile"
            >
                <icon-upload-cloud title="Upload an optional vtt captions file for this video"/>
            </button>
            <label for="captions">Captions:</label>
            <input id="captions"
              v-model="updatedData[sceneNum].captionsFile"
              placeholder="optional"
              @change="changeEl(updatedData[sceneNum])"
            >
        </div>
        <div class="form-row">
            <label for="branches">Branches:</label>
            <input id="branches" class="short-input" type="number" inputmode="numeric"
                v-model="updatedData[sceneNum].branchCount" placeholder="Number of branches"
                @change="changeEl(updatedData[sceneNum])"
            >
            <label for="return">Return Time:</label>
            <input id="return" class="short-input" type="number" inputmode="decimal"
                v-model="updatedData[sceneNum].returnTime" placeholder="Time in seconds"
                @change="changeEl(updatedData[sceneNum])"
            >
        </div>
      </div>
      <!-- cueData[] - use tabs to select which cue -->
      <div id="tabs" class="tabs-container">
          <span>Interactions:</span>
          <div class="tabs">
              <span
                  v-for="(cue, index) in updatedData[sceneNum].cueData"
                  :key="index"
              >
                  <a :class="[activetab === index ? 'active' : '']"
                      @click="activetab=index"
                      v-text="(index+1)"
                  ></a>
              </span>

              <span>
                <a class="add-button" title="Add new interaction"
                    @click="showAddModal=true" 
                >
                  <icon-plus title="Add new interaction"/>
                </a>
              </span>
          </div>
          <div
              v-for="(cue, index) in updatedData[sceneNum].cueData"
              :key="'panel'+index"
              :data-index="index"
          >
              <div class="tab-content"
                  :data-index="index"
                  v-if="activetab === index"
              >
                  <div class="form-row">
                    Type: {{cue.type}}
                  </div>
                  <!--<div class="form-row"><br> {{JSON.stringify(cue)}} </div>-->
                  <form-message
                      v-if="cue.type === 'AnimatedMessage'"
                      :formData="cue"
                      @itemChanged="changeEl"
                  />
                  <form-info-panel
                      v-if="cue.type === 'InfoPanel'"
                      :formData="cue"
                      @itemChanged="changeEl"
                  />
                  <!--other cue specific comps-->
              </div>
          </div>
      </div>
      <div class="form-row bordered">
          <button role="button" class="icon-button"
              title="Save changes"
              @click="$emit('updateChanges', updatedData)"
          >
              Save Scene Changes <icon-save-file/>
          </button>
      </div>
      <add-new-modal
        v-show="showAddModal"
        @closeModal="showAddModal=!showAddModal"
        @addNew="addNewCue"
      />
    </div>
</template>

<script>
import AddNewModal from './AddNewModal.vue';
import FormMessage from './FormMessage.vue';
import FormInfoPanel from './FormInfoPanel.vue';
// ToDo: instance needed components?

export default {
    /**
     * Nice form styles
     * https://codepen.io/rickyeckhardt/pen/zYGwaKr
     * https://codepen.io/uzcho_/pen/bPZMez
     * https://vuejs.org/v2/guide/forms.html
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
     * 
        "sceneData": [{
            "_comment": "data for English",
            "videoBackground": "",
            "captionsFile": "",
            "ccEnabled": false,
            "returnTime": 0,
            "branchCount": 0,
            "played": false,
            "cueData": []
        }]
     */
    name: "FormScene",
    components: {
        AddNewModal,
        FormMessage,
        FormInfoPanel,
    },
    props: {
        formData: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data () {
        return {
            activetab: 0,// first cueData
            sceneNum: 0,// main, branches are sceneData[1,2,3]
            showAddModal: false,
            progress: 0,// video currenttime
            updatedData: [{
                videoBackground: '',// required
                captionsFile: '',// optional
                branchCount: 0,
                returnTime: 0,
                cueData: []// array of interaction objects
            }]// don't mutate the prop
        }
    },
    mounted () {
        // create a deep copy of data to mutate
        this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
            this.updatedData[this.sceneNum].cueData.forEach(function(cue, index) {
              cue.index = index;// pointer?
            });

            // interations container. class="interaction-overlay"
            this.screenEls = document.querySelector('.interaction-overlay');

            // video event listener
            // toolbar sends play, pause, rewind stepBack to intro
            var comp = this;
            // console.log('updatedData:', comp.updatedData);
            var vidPlayer = document.querySelector('.video-element');
            // console.log(vid.textTracks.length, vid.textTracks);
            vidPlayer.textTracks[0].addEventListener('cuechange', function(e) {
              if (e.target.activeCues.length > 0) {
                console.log('cuechange:', e.target.activeCues[0].id);
                // set activetab
                comp.updatedData[comp.sceneNum].cueData.forEach(function(cue) {
                  if (cue.type === e.target.activeCues[0].id) {
                    comp.activetab = cue.index;
                  }
                });

                // interactive element is on screen
                console.log('screenEls[0]:', comp.screenEls.children);
              }
            });
            vidPlayer.addEventListener('timeupdate', function () {
              comp.progress = this.currentTime.toFixed(3);
            });
        });
    },
    methods: {
        /**
         * Determine which upload button Audio or Image file by id
         * ToDo: needs to upload to public/audio or public/images ???
         * or full path to file
         */
        uploadFile: function(event) {
            // console.log('get id:', event);
            var id = event.target.id;
            if (!id) {
                event.path.forEach(function(el) {
                  if (el.id && el.id !== 'app') {
                    id = el.id;
                  }
                });
            }
            console.log('upload:', id);// which button
        },

        /**
         * Show dialog modal w/dropdown selector to choose a type
         * add selected type to cueData[]
         * @param data Object - selected type
         */
        addNewCue: function(data) {
          var len = this.updatedData[this.sceneNum].cueData.length;
          if (data) {
            data.start = this.progress;
            data.index = len;
          }
          console.log('Add new Interaction:', data);
          // this.updatedData[this.sceneNum].cueData.push(data);
            // show small dialog modal w/dropdown selector to choose a type
            // add selected type (data) to cueData[]
        },

        /**
         * update sceneData or cueData
         * @param val - Object will contain .index if cueData
         */
        changeEl: function(val) {
          if (val.index !== undefined) {
            //console.log('cueData:', val.index, val);
            this.updatedData[this.sceneNum].cueData[val.index] = val;
          } else {
            //console.log('scene:', val);
            this.updatedData[this.sceneNum] = val;
          }
            
        }
    }
}
</script>

<style scoped>
    .form-body {
        width: 100%;
    }
    .form-container {
      padding: 5px 3px;
      border-radius: 8px;
      border: 1px solid #888888;
      background-color: #ffffff;
    }
    .form-row {
        width: 100%;
        margin: 5px 0;
        clear: both;
    }
    .bordered {
        border-top: 2px solid #888888;
        margin-top: 10px;
        padding: 15px 0;
    }
    input, textarea {
        width: 74%;
        float: right;
        font-size: 16px;
        box-sizing: border-box;
        outline: none;
        border-color: #333333;
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 1px;
        border-left-width: 0;
    }
    input:focus-visible, textarea:focus-visible {
        outline: none;
        border-color: #718871;
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 3px;
        border-left-width: 0;
    }
    textarea {
        width: 87%;
        height: 80px;
        resize: none;
        margin-bottom: 8px;
    }
    .short-input {
        width: 10%;
        float: unset;
        margin-right: 40px;
    }
    .short-text-input {
        width: 10%;
        float: unset;
        margin-right: 20px;
    }
    .empty-button {
        width: 15px;
        margin: 0 10px;
        padding: 0 5px;
        float: right;
        border: 1px solid transparent;
    }
    .icon-button {
        margin: 0 5px;
        padding: 0 5px;
        cursor: pointer;
        float: right;
        font-size: 16px;
        color: #333333;
        border-radius: 2px;
        border: 1px solid  #000000;
        background-color: #efefef;
    }
    .icon-button:hover {
        background-color: #ccf1cc;
    }

    .add-button {
        padding: 2px 5px !important;
        margin-top: 4px;
    }

    /* tabs https://vuejsexamples.com/tabbed-content-with-vue-js/ */
    .tabs-container {  
        width: 100%;
        margin: 10px auto;
    }

    /* Style the tabs */
    .tabs {
        overflow: hidden;
        margin-left: 20px;
        margin-bottom: -2px;/* hide bottom border */
    }

    .tabs ul {
        list-style-type: none;
        margin-left: 20px;
    }

    .tabs a {
        float: left;
        cursor: pointer;
        padding: 5px 15px;
        transition: background-color 0.2s;
        border: 1px solid #888888;
        border-right: none;
        background-color: #f1f1f1;
        border-radius: 6px 6px 0 0;
        /* font-weight: bold; */
    }
    .tabs a:last-child { 
        border-right: 1px solid #888888;
    }

    /* Change background color of tabs on hover */
    .tabs a:hover {
        background-color: #aaa;
        color: #fff;
    }

    /* Styling for active tab */
    .tabs a.active {
        background-color: #fff;
        color: #333333;
        border-bottom: 2px solid #fff;
        cursor: default;
    }

    /* Style the tab content */
    .tab-content {
        padding: 5px;
        overflow-wrap: anywhere;
        border: 1px solid #888888;
        background-color: #ffffff;
        border-radius: 8px;
    }
</style>
