<template>
    <div class="builder">
        <transition name="show">
          <repo-panel name="cloud-repository"
            v-show="repoVisible"
            @closeRepo="repoVisible = !repoVisible"
            @audioSelected="repoAudioSelected"
            @videoSelected="repoVideoSelected"
            @imageSelected="repoImageSelected"
          />
        </transition>

        <builder-toolbar
          :sceneVisible="sceneVisible"
          @toggleRepo="toggleRepoPanel"
          @editCurrentData="editCurrentData"
          @saveFile="saveFile"
          @restart="$emit('updateData',actualData);$emit('restart');"
          @addNew="addNewCue"
          @refreshCues="refreshCues"
        />
        <editor-modal
          v-show="showEditorModal"
          :key="currentKey"
          :editorStyle="editorStyle"
          :currentData="currentData"
          @closeModal="closeEditorModal"
          @saveChanges="saveChanges"
          @toggleRepo="toggleRepoPanel"
        />
        <data-panel
          v-if="actualData"
          :key="currentKey+1"
          :allData="actualData"
        />
    </div>
</template>

<script>
/**
 * Main Builder layer holds RepoPanel 
 * 
 * ToDo: dropdown selector for Scene types?
 *  Think about adding FormIntroduction and FormScene here. instead of EditorModal?
 *  It may be more manageable. Could determine which FormSene type to display?
 * Get more granular for adding interaction types?
 * 
 * manage introLanguage and sceneData
 * to refresh data, $emit('updateData', actualData)
 * sceneVisible determines Intro or Scene
 * 
 * allData to select introLanguage or SceneData[num].cueData[]
 * 
 * video player controls: pause, play, restart intro, markers, progressbar
 */
import RepoPanel from "./RepoPanel.vue";
import BuilderToolbar from "./BuilderToolbar.vue";
import EditorModal from "./EditorModal.vue";
// import rawdata from '../../public/slidedata.json';
import DataPanel from "./DataPanel.vue";

export default {
    name: "Builder",
    components: {
        RepoPanel,
        BuilderToolbar,
        EditorModal,
        DataPanel
    },
    props: {
        sceneVisible: {
            type: Boolean,
            default: true
        },
        language: {
            type: Number,
			      default: 0
        },
        // ToDo: Builder can save data to json file?
        allData: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data () {
      return {
        // language = data[index]
        repoVisible: false,// toggle RepoPanel
        showEditorModal: false,// toggle
        sceneNum: 0,// main scene, branches[1,2,3]
        vidPlayer: null,// Player elements
        interactionLayer: null,
        editorStyle: {},// set intro or scene
        //actualData = allData.introLanguage[language] || allData.sceneLanguage[language].sceneData
        actualData: null,// modified allData
        currentData: null,
        selectedKey: null,// file key,value
        currentKey: 0// force update in EditorModal
      }
    },
    mounted() {
      console.log('Builder mounted rawdata:', this.allData);
      const comp = this;
      this.$root.$on('addArrayItem', this.addArrayItem);
      this.$root.$on('changeColor', this.changeColor);
      this.$root.$on('findFile', this.findFile);
      this.$root.$on('repoImageSelected', function(filename) {
        console.log('-repoImageSelected', comp.selectedKey, filename);
        // set the currentData.selectedKey = filename
      });
      // this.$nextTick(function () {
      //   // allData is still not available
      //   console.log('Builder mounted allData:', this.allData);
      // });
    },
    watch: {
      /**
       * set currentData to introLanguage, when allData is ready
       */
      allData: {
        immediate: true,
        handler(newstate, oldstate) {
          // console.log('-- watch Builder allData:', newstate, oldstate);
          if (newstate.hasOwnProperty('introLanguage')) {
            if (!this.sceneVisible) {
              this.currentData = this.allData.introLanguage[this.language];
              console.log('-- watch Builder currentData:', this.currentData);

              this.$nextTick(function() {
                this.editorStyle = {
                  transform: 'translate(730px, 170px)',
                  width: '580px'
                };
                document.querySelector('.editor-panel').setAttribute('data-x', 730);
                document.querySelector('.editor-panel').setAttribute('data-y', 170);
              });
            }

            // create a mutable copy of allData to update
            this.actualData = JSON.parse(JSON.stringify(this.allData));
            //console.log('actualData:', this.actualData);
          }
        }
      },
      /**
       * set currentData to sceneLanguage[language].sceneData
       * when the Scene becomes visible
       * doesn't fire for intro, set introLanguage at watch allData
       */
      sceneVisible: {
        immediate: true,
        handler(newstate) {
          if (newstate) {
            console.log('-- watch Builder sceneVisible:', newstate);
            if (this.allData.hasOwnProperty('sceneLanguage')) {
              this.currentData = this.allData.sceneLanguage[this.language].sceneData;

              let cueData = this.currentData[0].cueData;
              //let tf = delete this.currentData[0].cueData;
              // console.log('-- tf:', tf);// true
              console.log('-- cueData:', cueData);// separated
              console.log('-- sceneVisible currentData:', this.currentData);

              this.$nextTick(function() {
                this.editorStyle = {
                  transform: 'translate(680px, 40px)',
                  width: '650px'
                };
                document.querySelector('.editor-panel').setAttribute('data-x', 680);
                document.querySelector('.editor-panel').setAttribute('data-y', 40);
              });
            }
            // video player currenttime
            if (!this.vidPlayer) {
              this.vidPlayer = document.querySelector('.video-element');
              // var comp = this;
              // this.vidPlayer.addEventListener('timeupdate', function () {
              //   comp.progress = parseFloat(this.currentTime.toFixed(3));
              // });
            }
            if (!this.interactionLayer) {
              this.interactionLayer = document.querySelector('.interaction-overlay');
            }
          }
        }
      },
    },
    methods: {
      /**
       * I will be able to use this app to create new slides.
       * Keep a folder of template slide types to use.
       * 
       * Expand Builder abilities to edit activities too.
       * 
       * ToDo: this needs a way to change/select the language and refresh the data upon selection.
       * 
       * Add a File Manager to upload assets, open/save/saveAs the data in public/slidedata.json
       * 
       * Add a panel to view, add & manage _comments of a data object?
       * 
       * Add tip-tap to other form fields (currently only in FormIntroduction)
       * Message and InfoPanel, all text elements?, should have font-size & color options
       * 
       * Add slicksort list component
       * https://github.com/Jexordexan/vue-slicksort
       * 
       * Finish ImageButton component. Should ImageButton have an optional sound that plays when clicked?
       * Should ImageButton be an array of multiple buttons?
       * 
       * Add border-color, border-size, border-radius -- to all elements?
       * Add animateFrom, To  w/vertical slider? to Scoreboard & FormScoreboard. 
       * https://vuejsexamples.com/a-highly-customized-slider-component-with-vue/
       * 
       * Might be able to use round-slider for Oven Temperature controls
       * https://vuejsexamples.com/a-highly-customizable-round-slider-for-vue-js-with-more-flexibility/
       * replaces assets/knob idea.
       * 
       * For the editor only. think about saving to and watching localStorage. It may refresh better?
       * OR rebuilding the video cues. 
       * 
       * Possibly load slidedata.json into builder instead of sending a prop from App.
       * Save would still pass the data to the App updateData(_data) method.
       * App would refresh by rebuilding the Scene cueData
       * 
       * Save File currently downloads slidedata.json. 
       * Add Instructions to copy to public|dist folder and refresh page?
       * 
       * saveChanges(), App updateData: function(_data)
       * Rethink using currentKey, it seems to add a second video to memory?
       * or it loses the reference to the video?
       * jump to marker doesn't work after adding a new component
       */


        /**
         * RepoPanel is a drawer on the left side to select images from a library
         * it animates in from left and is resizable
         * 
         * RepoPanel tabs: 0=Sounds, 1=Videos, 2=Images
         * @param repoState Object - {tab:#, state:true = open it}
         */
        toggleRepoPanel: function (repoState) {
          if (repoState) {
            this.repoVisible = repoState.state;
            this.$root.$emit('changeTab', repoState.tab);
          } else {
            this.repoVisible = !this.repoVisible;
          }
        },
        findFile: function(key, asset) {
          // console.log('findFile:', key, asset);// key
          // open the repository panel
          let assetTypes = ['audio','video','image','vtt'];
          let repoState = {
            tab: assetTypes.indexOf(asset), 
            state: true
          }
          this.toggleRepoPanel(repoState);
          this.selectedKey = key;
          console.log('findFile repoState:', key, asset, repoState);
        },
        /**
         * audio, video or image selection from repository
         * add $root.$on('repoAudioSelected' listener to the components needing repository access
         * @param filename String audio file url
         */
        repoAudioSelected: function (filename) {
          this.$root.$emit('repoAudioSelected', filename);
        },
        repoVideoSelected: function (filename) {
          this.$root.$emit('repoVideoSelected', filename);
        },
        repoImageSelected: function (filename) {
          // this.$root.$emit('repoImageSelected', filename);
          let comp = this;
          let objEntries;
          console.log('currentData:', this.currentData);

          if (this.sceneVisible) {
            objEntries = Object.entries(this.currentData[0]);// sceneData array[0]
          } else {
            objEntries = Object.entries(this.currentData);// Introduction object
          }
          console.log(objEntries);

          let val = objEntries.find(([key, value]) => {
            return key === comp.selectedKey;
          });
          console.log(val, comp.selectedKey);
          if (val) { val[1] = filename; }

          if (this.sceneVisible) {
            this.currentData[0] = Object.fromEntries(objEntries);
            this.actualData.sceneLanguage[this.language].sceneData = this.currentData;
          } else {
            this.currentData = Object.fromEntries(objEntries);
            this.actualData.introLanguage[this.language] = this.currentData;
          }
          console.log('currentData:', this.currentData);
          this.currentKey += 1;// force re-render
        },
        editCurrentData: function() {
          this.showEditorModal = !this.showEditorModal;
          if (this.showEditorModal) {
            document.querySelector('.builder-toolbar').style.backgroundColor = '#00000033';
            if (this.interactionLayer) {
              this.interactionLayer.style.display = 'none';
            }
          } else {
            document.querySelector('.builder-toolbar').style.backgroundColor = 'transparent';
            if (this.interactionLayer) {
              this.interactionLayer.style.display = 'block';
            }
          }
          // console.log('editCurrentData', this.currentData);
        },
        closeEditorModal: function() {
          this.showEditorModal = false;
          document.querySelector('.builder-toolbar').style.backgroundColor = 'transparent';
          if (this.interactionLayer) {
            this.interactionLayer.style.display = 'block';
          }
        },
        /**
         * called from: EditorModal
         * update currentData, allData, actualData.sceneLanguage[this.language].sceneData
         *
         * @param data - Object currentData
         */
        saveChanges: function (data) {
            console.log('Builder saveChanges:', data);
            if (this.sceneVisible) {
              this.currentData[this.sceneNum] = data;
              this.actualData.sceneLanguage[this.language].sceneData = data;
            } else {
              // update introLanguage[language]
              this.actualData.introLanguage[this.language] = data;
            }
            // this.closeEditorModal();
            // send to App
            this.$emit('updateData', this.actualData);
            // console.log('saveChanges:', this.actualData);
        },
        changeColor: function(picker) {
          console.log('changeColor:', picker.name, picker.color.hex8);
          // update the color-swatch
          document.body.querySelector(".color-swatch[id='"+picker.name+"']").style.backgroundColor = picker.color.hex8;
          switch(picker.name) {
            // Introduction
            case 'buttonColor':
              this.currentData.buttonColor = picker.color.hex8;
              // update this.allData ???
              document.querySelectorAll('circle')[0].style.stroke = picker.color.hex8;
              document.querySelectorAll('polygon')[1].style.fill = picker.color.hex8;
              break;
            case 'fillColor':
              this.currentData.fillColor = picker.color.hex8;
              document.querySelectorAll('circle')[0].style.fill = picker.color.hex8;
              break;
            // Scene
            // textColor, titleColor, panelBkgColor, backgroundColor, 
            // hintButtonTextColor, hintButtonBackgroundColor, 
            // unique names!
          }
          // console.log('changeColor:', this.currentData);
        },
        addArrayItem: function(type) {
          console.log('addArrayItem:', type);
          // slidedata.sceneLanguage[language].sceneData[currentScene]
          // console.log('currentData', this.currentData[0]);
          switch(type) {
            case 'captions':
              // instance of a global?
              let caption = {
                language: '',
                label: '',
                file: ''
              };
              this.currentData[0].captions.push(caption);
              this.currentKey += 1;// rerender
              console.log('currentData', this.currentData[0].captions);// slidedata
              // up again?
              break;
            case 'cueData':
              break;
          }
        },
        /**
         * Add a new cue to sceneData.cueData
         * only when Scene is visible
         */
        addNewCue: function(data) {
          console.log('Builder Add new:', data, 'currentData:', this.currentData[this.sceneNum]);
          if (!this.currentData) {
            this.currentData = this.allData.sceneLanguage[this.language].sceneData;
          }
          if (!this.vidPlayer) {
              this.vidPlayer = document.querySelector('.video-element');
          }
          if (data && data.type !== 'fakeType') {
            data.start = parseFloat(this.vidPlayer.currentTime.toFixed(3));
            // data.index = this.currentData[this.sceneNum].cueData.length; // reset later
            this.currentData[this.sceneNum].cueData.push(data);
            // sort cueData or call FormScene addNewCue(data)?
            this.currentData[this.sceneNum].cueData.sort(function (a, b) {
              return a.start - b.start;
            });
            this.currentData[this.sceneNum].cueData.forEach(function(cue, index) {
              cue.index = index;// reset pointer to switch tabs on cuechange
            });
            this.actualData.sceneLanguage[this.language].sceneData = this.currentData;
            // send to App
            this.$emit('updateData', this.actualData);
            // https://michaelnthiessen.com/force-re-render/
            this.currentKey += 1;// force update to trigger '-- watch editor currentData
            console.log('Builder Add new:', data, 
                        'currentData:', this.currentData, 
                        'actualData:', this.actualData
            );
          }
          // show Editor panel
          this.showEditorModal = true;
        },
        refreshCues: function() {
          // send signal to EditorModal to reconstruct modal-elements
          this.currentKey += 1;// trigger refresh?
        },
        /**
         * download JSON data to save the file
         * https://stackoverflow.com/questions/48611671/vue-js-write-json-object-to-local-file
         * https://github.com/eligrey/FileSaver.js
         */
        saveFile: function() {
          try {
            var isBlobSupported = !!new Blob;
            //console.log('Blob supported:', isBlobSupported);// true
            if (isBlobSupported) {
              var data = JSON.stringify(this.allData);// allData=rawdata
              var blob = new Blob([data], {type: 'text/plain'});

              var a = document.createElement('a');
              a.download = "slidedata.json";
              a.href = window.URL.createObjectURL(blob);
              a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
              //console.log('saveFile:', data);
              //console.log('saveFile:', blob);
              // window.localStorage.setItem('rawdata', data);
              // console.log(JSON.parse(window.localStorage.getItem('rawdata')));
              try {
                a.dispatchEvent(new MouseEvent('click'));
              } catch (e) {
                var evt = document.createEvent('MouseEvents');
                evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
                a.dispatchEvent(evt);
              }
            } else {
              console.error('cannot save file. Blob is not supported in this browser.');
            }
          } catch (e) {
            console.error('error:', e.toString());
          }
        }
    }
}
</script>

<style scoped>
    .builder {
        position: absolute;
        top: 0;
        width: 100vw;
    }

    /* repoPanel transition */
    .show-leave-active,
    .show-enter-active {
        transition: all .6s ease-in-out;
    }

    .show-enter {
        left: -500px;
        opacity: 0.5;
    }

    .show-enter-to {
        transform: translate(0, 0);
        /* opacity: 1; */
    }

    .show-leave-to {
        transform: translate(-100%, 0);
        opacity: 0.5;
    }
</style>
