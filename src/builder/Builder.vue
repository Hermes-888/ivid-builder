<template>
    <div class="builder">
        <transition name="show">
            <repo-panel name="cloud-repository"
                v-show="repoVisible"
                :repo-images="repoImages"
                @closeRepo="repoVisible = !repoVisible"
                @imageSelected="repoImageSelected"
            />
        </transition>

        <builder-toolbar
          :sceneVisible="sceneVisible"
          @toggleRepo="toggleRepoPanel"
          @editCurrentData="editCurrentData"
          @saveFile="saveFile"
          @restart="$emit('restart')"
        />
        <editor-modal
          v-show="showModal"
          :currentData="currentData"
          @closeModal="showModal=false"
          @saveChanges="updateItemData"
        />
        <!-- <edit-panel ref="editPanel"
            :itemHeaders="itemHeaders"
            :itemData="itemData"
            :sceneVisible="sceneVisible"
            @toggleRepo="toggleRepoPanel"
            @updateItemData="updateItemData"
            @saveFile="saveFile"
        /> -->
    </div>
</template>

<script>
/**
 * Main Builder layer holds RepoPanel 
 * 
 * introContent and sceneData get edited here?
 * to refresh data, $emit('updateData', updatedData)
 * sceneVisible determines Intro or Scene
 * 
 * allData to select IntroContent or SceneData[num].cueData[]
 * 
 * video player controls: pause, play, restart intro, markers, progressbar
 */
import RepoPanel from "./RepoPanel.vue";
import BuilderToolbar from "./BuilderToolbar.vue";
import EditorModal from "./EditorModal.vue";
//import EditPanel from "./EditPanel.vue";// DragImagePanel & DragTextPanel

export default {
    name: "Builder",
    components: {
        RepoPanel,
        BuilderToolbar,
        EditorModal,
        //EditPanel
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
        showModal: false,// toggle
        selectedRowId: 0,// IntroContent or SceneData.cueData
        repoImages: ['images/Caroline_left_pointing.png', 'images/customer_mother_boy.png', 'images/cookies.png', 'images/garlic_sauce.png'],

        itemHeaders: ['ID', 'Cues', 'Screen Text', 'Text Action', 'Image Info', 'Action', 'Image'],
        // rawdata allData, introContent, sceneLanguage
        itemData: [
            {
                type: 'data',
                rowId: '01-02',
                fullText: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                screenText: {
                    text: '<div><b>Ingredients:</b><ul><li>Garlic</li><li>Olive Oil</li><li>Salt</li></ul></div>',
                    color: '',
                    location: {top: 85, left: 400}

                },
                textPresentation: '<p>Add the list of ingredients over the chalkboard.</p>',
                imageDescription: '<p>Animate the food sliding in from the <b>right side</b> of the screen.</p>',
                imagePresentation: '<div>Add Garlic Sauce</div>',
                imageData: {
                    url: 'images/garlic_sauce.png',
                    location: {'top': 300, 'left': 300, 'width': 247, 'height': 156}
                    // location: {'top': 335, 'left': 474, 'width': 247, 'height': 156}
                }
            }
        ],
        // = allData.introContent[language] || allData.sceneLanguage[language].sceneData
        actualData: null,// modified allData
        currentData: null
      }
    },
    // mounted () {
    //     this.$nextTick(function() {});
    // },
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
              // console.log('sceneVisible currentData:', this.currentData);
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
          this.repoVisible = (!this.repoVisible) ? true : false;
        },
        /**
         * selection from repo to specific row
         * this.$root.selectedRowId = the row[index]
         * @param filename String image url
         * 
         * ToDo: fix selectedRowId = index of introContent or sceneData.cueData
         */
        repoImageSelected: function (filename) {
          console.log('selectedRowId', this.selectedRowId);
          if (this.$root.selectedRowId) {
            console.log('selectedRowId', this.selectedRowId);
            //this.itemData[this.$root.selectedRowId].imageData.url = filename;
          } else {
            //this.itemData[0].imageData.url = filename;
          }
        },
        editCurrentData: function() {
          this.showModal = true;
          // console.log('editCurrentData', this.currentData);
        },
        /**
         * called from: Table / Panel, separate instances of itemData
         * update currentData, allData
         * text has changed
         * NOTE: table itemData gets changed
         *
         * @param data - Object currentData
         * @param cueIndex - Int which sceneData[index]
         */
        updateItemData: function (data, cueIndex) {
            console.log('Builder updateItemData:', data, cueIndex);
            // console.log('$refs:', this.$refs);
            // this.showModal = false;
            // ToDo: update actualData w/data and send it to App
            if (this.sceneVisible) {
              // update sceneLanguage[language].sceneData
              this.actualData.sceneLanguage[this.language].sceneData = data;
              // data is the whole sceneData[]
              // if (cueIndex) {
              //   // update sceneLanguage[language].sceneData[?Define Global?].cueData[cueIndex]
              // }
            } else {
              // update introContent[language]
              this.actualData.introContent[this.language] = data;
            }
            // send to App to refresh
            this.$emit('updateData', this.actualData);

            if (cueIndex) {
                // this.itemData[cueIndex] = data;
                // editPanel.options.propsData.itemData
                // rawdata
                console.log('cueIndex=',cueIndex);//, this.$refs.editPanel.itemData[cueIndex]);
                // this.$refs.editPanel.itemData[cueIndex] = data;
                // this.$refs.editPanel.$options.propsData.itemData[cueIndex] = data;

                // for App rawdata
                // this.$emit('updateData', this.actualData);
                // this.$forceUpdate();
            }
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
        width: 99vw;
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
