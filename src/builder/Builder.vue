<template>
    <div class="builder">
        <transition name="show">
            <repo-panel name="cloud-repository"
                v-show="repoVisible"
                @closeRepo="repoVisible = !repoVisible"
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
          :currentData="currentData"
          @closeModal="closeEditorModal"
          @saveChanges="saveChanges"
          @toggleRepo="toggleRepoPanel"
        />
    </div>
</template>

<script>
/**
 * Main Builder layer holds RepoPanel 
 * 
 * manage introContent and sceneData
 * to refresh data, $emit('updateData', actualData)
 * sceneVisible determines Intro or Scene
 * 
 * allData to select IntroContent or SceneData[num].cueData[]
 * 
 * video player controls: pause, play, restart intro, markers, progressbar
 */
import RepoPanel from "./RepoPanel.vue";
import BuilderToolbar from "./BuilderToolbar.vue";
import EditorModal from "./EditorModal.vue";

export default {
    name: "Builder",
    components: {
        RepoPanel,
        BuilderToolbar,
        EditorModal
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
        progress: 0,// video currenttime
        //actualData = allData.introContent[language] || allData.sceneLanguage[language].sceneData
        actualData: null,// modified allData
        currentData: null,
        currentKey: 0// force update in EditorModal
      }
    },
    watch: {
      /**
       * set currentData to introContent, when allData is ready
       */
      allData: {
        immediate: true,
        handler(newstate, oldstate) {
          // console.log('-- watch Builder allData:', newstate, oldstate);
          if (newstate.hasOwnProperty('introContent')) {
            if (!this.sceneVisible) {
              this.currentData = this.allData.introContent[this.language];
              // console.log('-- watch Builder currentData:', this.currentData);
            }
          }
          // a mutable copy of allData to update
          this.actualData = JSON.parse(JSON.stringify(this.allData));
          //console.log('actualData:', this.actualData);
        }
      },
      /**
       * set currentData to sceneLanguage[language].sceneData
       * when the Scene becomes visible
       * doesn't fire for intro, set introContent at watch allData
       */
      sceneVisible: {
        immediate: true,
        handler(newstate) {
          if (newstate) {
            console.log('-- watch Builder sceneVisible:', newstate);
            if (this.allData.hasOwnProperty('sceneLanguage')) {
              this.currentData = this.allData.sceneLanguage[this.language].sceneData;
              console.log('sceneVisible currentData:', this.currentData);
            }
            // video player currenttime
            var comp = this;
            if (!this.vidPlayer) {
              this.vidPlayer = document.querySelector('.video-element');
              this.vidPlayer.addEventListener('timeupdate', function () {
                comp.progress = parseFloat(this.currentTime.toFixed(3));
              });
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
         * RepoPanel is a drawer on the left side to select images from a library
         * it animates in from left and only covers half the screen
         */
        toggleRepoPanel: function () {
          // send state?
          this.repoVisible = !this.repoVisible;
        },
        /**
         * selection from repo to specific row
         * @param filename String image url
         */
        repoImageSelected: function (filename) {
          console.log('repoImageSelected', filename);
          this.$root.$emit('repoImageSelected', filename);
        },
        editCurrentData: function() {
          this.showEditorModal = true;
          document.querySelector('.builder-toolbar').style.backgroundColor = '#00000033';
          if (this.interactionLayer) {
            this.interactionLayer.style.display = 'none';
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
              // update introContent[language]
              this.actualData.introContent[this.language] = data;
            }
            this.closeEditorModal();
            // send to App
            this.$emit('updateData', this.actualData);
            // console.log('saveChanges:', this.actualData);
        },
        /**
         * Add a new cue to sceneData.cueData
         * only when Scene is visible
         */
        addNewCue: function(data) {
          console.log('Builder Add new:', data, 'currentData:', this.currentData[this.sceneNum]);
          var len = this.currentData[this.sceneNum].cueData.length;
          if (data) {
            data.start = this.progress;
            data.index = len;
            if (data.type !== 'fakeType') {
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
            var data = JSON.stringify(this.allData);// allData=rawdata
            var blob = new Blob([data], {type: 'text/plain'});

            var a = document.createElement('a');
            a.download = "scenedata.json";
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
          } catch (e) {
            console.log('error:', e.toString());
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
        /* border-bottom: 1px solid red; */
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
