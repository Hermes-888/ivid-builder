<template>
    <div class="form-body">
      <div class="form-container">
        <div class="form-row">
            <button id="videoUpload" role="button" class="icon-button"
                title="Upload the main video file"
                @change="changeFormData(updatedData[sceneNum])"
                @click="uploadFile('video')"
            >
                <icon-upload-cloud title="Upload the main video file"/>
            </button>
            <label for="video">Video:</label>
            <input id="video"
              v-model="updatedData[sceneNum].videoBackground"
              placeholder="required"
              @change="changeFormData(updatedData[sceneNum])"
            >
        </div>
        <div class="form-row">
            <button id="captionUpload" role="button" class="icon-button"
                title="Upload an optional vtt captions file for this video"
                @change="changeFormData(updatedData[sceneNum])"
                @click="uploadFile('captions')"
            >
                <icon-upload-cloud title="Upload an optional vtt captions file for this video"/>
            </button>
            <label for="captions">Captions:</label>
            <input id="captions"
              v-model="updatedData[sceneNum].captionsFile"
              placeholder="optional"
              @change="changeFormData(updatedData[sceneNum])"
            >
        </div>
        <div class="form-row">
            <label for="branches">Branches:</label>
            <input id="branches" class="shorter-input" type="number" inputmode="numeric"
                v-model="updatedData[sceneNum].branchCount" placeholder="Number of branches"
                @change="changeFormData(updatedData[sceneNum])"
            >
            <button id="captionUpload" role="button" class="icon-button"
              title="Add new branch"
            >
                <icon-plus title="Add new branch"/>
            </button>
            <!-- v-for sceneData.length (scenes) add buttons to switch sceneNum -->
        </div>
        <div class="form-row"
          v-if="updatedData[sceneNum].branchCount > 0"
        >
          <label for="branchNum">Branch:</label>
          <span id="branchNum" v-text="sceneNum"></span>
          <label for="return">Return Time:</label>
          <input id="return" class="short-input" type="number" inputmode="decimal"
              v-model="updatedData[sceneNum].returnTime" placeholder="Time in seconds"
              @change="changeFormData(updatedData[sceneNum])"
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
              <span style="float: right;">
                <a class="jump-button" title="Jump to selected cue start time"
                    @click="changeVideoTime"
                >
                  <icon-marker title="Jump to selected cue start time"/>
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
                      @itemChanged="changeFormData"
                  />
                  <form-info-panel
                      v-if="cue.type === 'InfoPanel'"
                      :formData="cue"
                      @itemChanged="changeFormData"
                  />
                  <form-multi-choice
                    v-if="cue.type === 'MultipleChoice'"
                    :formData="cue"
                    @itemChanged="changeFormData"
                  />
                  <!--other cue specific comps-->
              </div>
          </div>
      </div>
      <div class="form-row bordered">
          <button role="button" class="icon-button"
              title="Search for images in repository"
              @click="$emit('toggleRepo')"
          >
              <icon-cloud-search title="Search for images in repository"/>
          </button>
          <button role="button" class="icon-button right"
              title="Save changes"
              @click="$emit('saveChanges', updatedData)"
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
import FormMultiChoice from './FormMultiChoice.vue';

// modalLayer screenElements
import AnimatedMessage from '../components/AnimatedMessage.vue';
import InfoPanel from '../components/InfoPanel.vue';
import MultiChoice from '../components/MultiChoice.vue';

import Vue from 'vue';

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
        FormMultiChoice
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
            }],// don't mutate the prop
            vidPlayer: null,
            // interactionLayer: null,// Player
            modalLayer: null,// elements container
            screenElements: [],// array of interactive elements
            element: null,// copy of the interactive element
            mcInstance: null,// element instance
            instances: []// test Are they being removed?
        }
    },
    watch: {
      formData: {
        immediate: false,// important
        handler(newstate, oldstate) {
          this.updatedData = JSON.parse(JSON.stringify(this.formData));
          this.updatedData[this.sceneNum].cueData.forEach(function(cue, index) {
            cue.index = index;// inject a pointer to switch tabs on cuechange
          });
          console.log('--- watch FormScene updatedData:', this.updatedData);
          // construct screenElements
          this.constructElements(this.updatedData[this.sceneNum].cueData, true);
        }
      },
      activetab: {
        immediate: true,
        handler(newstate, oldstate) {
          // console.log('activetab:', newstate, oldstate);
          // loop thru screenElements, only show element for activetab
          var comp = this;
          this.screenElements.forEach(function(el, index) {
            el.style.display = 'none';
            if (index === comp.activetab) {
              comp.screenElements[index].style.display = 'block';
              comp.element = comp.screenElements[index];
            }
          });
        }
      }        
    },
    mounted () {
        // create a deep copy of data to mutate
        this.$nextTick(function() {
          this.updatedData = JSON.parse(JSON.stringify(this.formData));
          this.updatedData[this.sceneNum].cueData.forEach(function(cue, index) {
            cue.index = index;// inject a pointer to switch tabs on cuechange
          });
          console.log('FormScene mounted updatedData:', this.updatedData);
          // watch immediate: false
          this.constructElements(this.updatedData[this.sceneNum].cueData, true);

          // interactions container. class="interaction-overlay"
          // this.modalLayer = document.querySelector('.modal-elements');
          // this.interactionLayer = document.querySelector('.interaction-overlay');
          // console.log('screen els:', this.interactionLayer);

          // video event listeners
          // toolbar sends play, pause, rewind stepBack to intro
          var comp = this;
          this.vidPlayer = document.querySelector('.video-element');

          this.vidPlayer.textTracks[0].addEventListener('cuechange', function(e) {
            //console.log('cuechange: target', e.target);// cues, activeCues
            if (e.target.activeCues.length > 0) {
              console.log('cuechange:', e.target.activeCues[0].id);
              // set activetab if cue is active
              comp.updatedData[comp.sceneNum].cueData.forEach(function(cue) {
                if (cue.type === e.target.activeCues[0].id) {
                  comp.activetab = cue.index;
                }
              });
              // interactive element is on screen
              // console.log('interactionLayer[0]:', comp.interactionLayer.children);
            }
          });
          this.vidPlayer.addEventListener('timeupdate', function () {
            comp.progress = parseFloat(this.currentTime.toFixed(3));
          });

          // this.vidPlayer.addEventListener('canplaythrough', function() {
          //   //find cueTrack
          //   var track = Array.from(comp.vidPlayer.textTracks).filter(function(track) {
          //     return track.label === 'cueTrack';
          //   });
          //   console.log(track, track[0].cues);// ,comp.vidPlayer.textTracks);
          // });
        });
    },
    methods: {
        changeVideoTime: function() {
          this.vidPlayer.currentTime = this.updatedData[this.sceneNum].cueData[this.activetab].start;
        },
        /**
         * Determine which upload button Audio or Image file by id
         * ToDo: needs to upload to public/audio or public/images ???
         * or full path to file
         */
        uploadFile: function(type) {
          console.log('upload', type);
          this.$emit('toggleRepo');// send state?
        },

        /**
         * Show dialog modal w/dropdown selector to choose a type
         * add selected type to cueData[]
         * @param data Object - selected cue type
         */
        addNewCue: function(data) {
          var comp = this;
          var len = this.updatedData[this.sceneNum].cueData.length;
          if (data) {
            data.start = this.progress;
            data.index = len;
            // add to updatedData and inform EditorModal
            if (data.type !== 'fakeType') {
              this.updatedData[this.sceneNum].cueData.push(data);
              // sort data by start time and reset cue.index
              this.updatedData[this.sceneNum].cueData.sort(function (a, b) {
                return a.start - b.start;
              });
              this.updatedData[this.sceneNum].cueData.forEach(function(cue, index) {
                if (cue.index === len) {
                  comp.activetab = index;
                }
                cue.index = index;// reset pointer to switch tabs on cuechange
              });
              this.$emit('saveChanges', this.updatedData);
              // rebuild to sort screenElements
              this.constructElements(this.updatedData[this.sceneNum].cueData);
              //this.constructElements([data], false);// construct array of one, don't clearAll
            }
          }
          console.log('Add new Interaction:', len, data);
        },

        /**
         * update sceneData or cueData from itemChanged
         * @param val Object - will contain .index if cueData
         */
        changeFormData: function(val) {
          // console.log('changeFormData:', val);
          // ToDo: parseFloat each val.property here
          // for (var item in val) {
          //   console.log(item, val[item]);
          //   // var value = val[item];// .includes is not a function
          //   // if (value.includes('%')) { console.log('---%'); }
          //   if (parseFloat(val[item])) {
          //     val[item] = parseFloat(val[item]);
          //     console.log('--- float:', val[item]);
          //   }
          // }
          if (val.hasOwnProperty('index')) {
            //console.log('cueData:', val.index, val.type, val);
            this.updatedData[this.sceneNum].cueData[val.index] = val;
            if (!this.element) { return; }

            // apply data to current element
            switch (val.type) {
              case 'AnimatedMessage':
                // ToDo: add bkg color & font color, size?
                this.element.style.top = val.animateTo;
                this.element.children[0].innerText = val.messageText;
                break;
              case 'InfoPanel':
                this.element.style.top = val.animateTo;
                this.element.children[0].style.backgroundColor = val.panelBkgColor;
                this.element.children[0].style.width = val.panelWidth;
                this.element.querySelector('.info-title').style.color = val.titleColor;
                this.element.querySelector('.info-title').children[0].innerHTML = val.infoTitle;
                this.element.querySelector('.info-text').innerHTML = val.infoText;
                this.element.querySelector('.info-button').children[0].innerText = val.buttonText;
                break;
              case 'MultipleChoice':
                console.log('changeForm switch:', val.type, val);
                // ToDo: finish updating this.element
                break;
            }
          } else {
            //console.log('scene:', val);
            this.updatedData[this.sceneNum] = val;
          }
        },
        constructElements: function(cues, clearAll=true) {
          // instance each element to edit
          this.modalLayer = document.querySelector('.modal-elements');// ref=modalElements
          // console.log('construct:', this.modalLayer, clearAll, cues);
          
          if (clearAll) {
            this.screenElements = [];// reset
            this.instances = [];
            this.modalLayer.innerHTML = '';
          }
          
          var comp = this;
          var count = 0;// test
          // var cues = this.updatedData[this.sceneNum].cueData;
          cues.forEach(function(cue) {
            var mcClass = null;

            switch (cue.type) {
              case 'AnimatedMessage':
                mcClass = Vue.extend(AnimatedMessage);
                // ToDo: add width, bkg color, font color, font-size?
                break;
              case 'InfoPanel':
                mcClass = Vue.extend(InfoPanel);
                break;
              case 'MultipleChoice':
                mcClass = Vue.extend(MultiChoice);
                break;
            }

            if (mcClass) {
              var mcInstance = new mcClass({
                propsData: {
                  mcData: cue
                }
              });
              mcInstance.$mount();
              // add element to an array to hide/show when activetab changes
              // show instanced elements when editing else show screen elements
              mcInstance.$el.style.top = cue.animateTo;
              mcInstance.$el.style.display = (cue.index === 0 || !clearAll) ? 'block' : 'none';
              mcInstance.$el.setAttribute('data-index', cue.index);
              mcInstance.$el.setAttribute('data-type', cue.type);
              // comp.screenElements.push(mcInstance.$el);
              comp.modalLayer.appendChild(mcInstance.$el);
              comp.screenElements.push(comp.modalLayer.children[count]);
              comp.instances.push(mcInstance);// save the instance
              count ++;
            }
          });
          // console.log('editor-modal:', document.querySelector('.editor-modal'));
        }
    }
}
</script>

<style scoped>
    .form-body {
        width: 100%;
    }
    .form-container {
      padding: 5px;
      border-radius: 8px;
      border: 1px solid #888888;
      background-color: #ffffff;
    }
    .form-row {
        display: flex;
        width: 100%;
        margin: 5px 0;
        clear: both;
    }
    .bordered {
        display: inline-block;
        border-top: 2px solid #888888;
        margin-top: 10px;
        padding-top: 10px;
    }
    .right {
      float: right;
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
        width: 70px;
        float: unset;
    }
    .shorter-input {
        width: 40px;
        float: unset;
    }
    #branchNum {
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
    .jump-button {
      font-size: 24px;
      padding: 0 5px !important;
      border: none !important;
      background-color: transparent !important;
    }
    .jump-button:hover {
      color: #71b371 !important;
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
        padding: 2px 8px;
        overflow-wrap: anywhere;
        border: 1px solid #888888;
        background-color: #ffffff;
        border-radius: 8px;
    }
</style>
