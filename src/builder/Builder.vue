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
        />
        <!-- <edit-panel ref="editPanel"
            :itemHeaders="itemHeaders"
            :itemData="itemData"
            :sceneVisible="sceneVisible"
            @toggleRepo="toggleRepoPanel"
            @updateItemData="updateItemData"
            @saveFile="saveFile"
        /> -->
        <dialog-modal
          v-show="showModal"
          :dialogHeader="'Dialog Modal Header'"
          :dialogBody="JSON.stringify(currentData)"
          :currentData="currentData"
          @closeModal="showModal=false"
          @saveChanges="updateItemData"
        />
    </div>
</template>

<script>
/**
 * Main Builder layer holds RepoPanel 
 * 
 * introContent and sceneData get edited here?
 * to refresh ivideo, $emit('updateData', updatedData)
 * sceneVisible determines Intro or Scene
 * 
 * allData to select IntroContent or SceneData[num].cueData[]
 * icon is on EditPanel header
 */
import RepoPanel from "./RepoPanel.vue";
import BuilderToolbar from "./BuilderToolbar.vue";
import DialogModal from "./DialogModal.vue";
//import EditPanel from "./EditPanel.vue";

export default {
    name: "Builder",
    components: {
        RepoPanel,
        BuilderToolbar,
        DialogModal,
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
        //tableView: false,// view itemData as Table or Panel
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
        currentData: null
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
              console.log('-- watch Builder currentData:', this.currentData);
            }
          }
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
            // console.log('-- watch Builder sceneVisible:', newstate);
            this.currentData = this.allData.sceneLanguage[this.language].sceneData;
            console.log('sceneVisible currentData:', this.currentData);
            //this.$nextTick(function () {});
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
          console.log('editCurrentData', this.currentData);
        },
        /**
         * called from: Table / Panel, separate instances of itemData
         * update currentData, allData
         * text has changed
         * NOTE: table itemData gets changed
         *
         * @param item - Object itemData[row]
         * @param rowIndex - Int which row
         */
        updateItemData: function (item, rowIndex) {
            console.log('Builder updateItemData:', item, rowIndex);
            this.showModal = false;
            if (rowIndex) {
                // this.itemData[rowIndex] = item;
                console.log('$refs:', this.$refs);

                // editPanel.options.propsData.itemData
                // rawdata
                console.log('editPanel');//, this.$refs.editPanel.itemData[rowIndex]);
                // this.$refs.editPanel.itemData[rowIndex] = item;
                // this.$refs.editPanel.$options.propsData.itemData[rowIndex] = item;
                // still doesnt trigger the watch in panel
                // this.$refs.panelView.$forceUpdate();// nope

                // for App rawdata
                this.$emit('updateData', allData);
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
