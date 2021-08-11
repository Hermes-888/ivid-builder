<template>
  <div class="builder-toolbar">
    <div class="toolbar-header">
        <div class="image-buttons"
            v-show="sceneVisible"
        >
            <button role="button" class="icon-button"
                title="View image layers"
                @click="toggleLayers"
            >
                <icon-eye title="View image layers"/>
            </button>
            <button role="button" class="icon-button"
                    title="Upload an image. It will also be added to the repository."
                    @click="uploadImage"
            >
                <icon-upload-cloud title="Upload an image. It will also be added to the repository."/>
            </button>
            <button role="button" class="icon-button"
                    title="Download this image file."
                    @click="downloadImage"
            >
                <icon-file-download title="Download this image file."/>
            </button>
            <button role="button" class="icon-button"
                    title="Remove this image from row."
                    @click="removeImage"
            >
                <icon-delete title="Remove this image from row."/>
            </button>
            <!-- <div class="icon-button" title="unused icons">
              <icon-palette/>:<icon-collapse/>:<icon-expand/>
            </div> -->
        </div>
        <div class="file-buttons">
            <button role="button" class="icon-button"
                title="Save data to JSON file"
                @click="$emit('saveFile')"
            >
                <icon-save-file title="Save data to JSON file"/>
            </button>
            <button role="button" class="more-menu icon-button"
                    id="moreMenu"
                    title="Open a panel of tools for: New Column, Audio Files, Learning Extras, ..."
                    @click="moreMenuModal"
            >
                <icon-dots title="Open a panel of tools for: New Column, Audio Files, Learning Extras, ..."/>
            </button>
            <button role="button" class="icon-button"
                    title="Search for images in repository"
                    @click="$emit('toggleRepo')"
            >
                <icon-cloud-search title="Search for images in repository"/>
            </button>
            <button role="button" class="icon-button"
                title="Edit Data"
                @click="$emit('editCurrentData')"
            >
                <icon-file-edit title="Edit Data"/>
            </button>
        </div>
        <div class="player-buttons"
          v-show="sceneVisible"
        >
          <div class="toolbar-column">
            <div class="progress-time">
              Time: <span v-text="progress"></span>
            </div>
            <div>
              <input class="time-slider"
                type="range" step="0.001"
                min="0" 
                :max="duration"
                :value="progress"
                @input="updateVidtime"
              >
            </div>
          </div>
          <button role="button" class="icon-button"
            title="Back to Introduction"
            @click="$emit('restart')"
          >
            <icon-step-back title="Back to Introduction"/>
          </button>
          <button role="button" class="icon-button"
            title="Restart video"
            @click="vidPlayer.currentTime=0;actionLayer.innerHTML='';"
          >
              <icon-rewind title="Restart video"/>
          </button>
          <div class="toolbar-column">
            <button role="button" class="icon-button"
              v-show="vidPlayer && vidPlayer.paused"
              title="Play video"
              @click="$root.$emit('playing', true)"
            >
              <icon-play title="Play video"/>
            </button>
            <button role="button" class="icon-button"
              v-show="vidPlayer && !vidPlayer.paused"
              title="Pause video"
              @click="$root.$emit('playing', false)"
            >
              <icon-pause title="Pause video"/>
            </button>
          </div>
          <!-- <button role="button" class="icon-button"
            title="Toggle Captions"
          >
            <icon-captions title="Toggle Captions"/>
          </button> -->
          <!--IF ENABLED? <icon-captions class="icon-captions" title="Toggle Captions"/> -->
          <button role="button" class="icon-button"
            title="Add new interaction"
            @click="showAddModal=true"
          >
            <icon-plus title="Add new interaction"/>
          </button>
          <!--DEFINE ACTION? @click="actionLayer.style.display='none'" -->
          <button role="button" class="icon-button"
            title="Hide interactions"
            @click="$emit('refreshCues')"
          >
            <icon-hide-layers title="Hide interactions"/>
          </button>
        </div>
    </div>
    <add-new-modal
      v-show="showAddModal"
      :dialogStyle="{top:'10vh', left:'unset', right:'15%', zIndex:11}"
      @closeModal="showAddModal=!showAddModal"
      @addNew="addNewCue"
    />
  </div>
</template>

<script>
import AddNewModal from './AddNewModal.vue';

export default {
  /**
   * Toolbar displays icons to 
   * if sceneVisible, show video player controls
   */
  name: "BuilderToolbar",
  components: {
    AddNewModal
  },
  props: {
    sceneVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      vidPlayer: null,// video element
      actionLayer: null,// interactive elements
      progress: 0,// vidPlayer video currentTime
      duration: 0,
      showAddModal: false,// Add New Interaction
      layersVisible: false,// unused but maybe?
    }
  },
  watch: {
    sceneVisible: {
      immediate: true,
      handler(newstate) {
        if (newstate) {
          // console.log('-- watch editPanel sceneVisible:', newstate);
          // progressbar click access
          document.querySelector('.progress-holder').style.zIndex = 12;
          // remove interactions
          this.actionLayer = document.querySelector('.interaction-overlay');

          var comp = this;// scope for addEventListener
          if (!this.vidPlayer) {
            this.vidPlayer = document.querySelector('.video-element');
            this.vidPlayer.addEventListener('timeupdate', function () {
              comp.progress = parseFloat(comp.vidPlayer.currentTime.toFixed(3));
              comp.duration = parseFloat(comp.vidPlayer.duration.toFixed(3));
              //Math.round((comp.vidPlayer.currentTime / comp.vidPlayer.duration) * 100);
            });
          }
        }
      }
    },
  },
  methods: {
    updateVidtime: function(e) {
      if (e.target.value !== this.progress) {
        this.vidPlayer.currentTime = e.target.value;
        // console.log('updateVidtime:', e.target.value, this.progress, this.duration);
      }
    },
    moreMenuModal: function() {
      console.log('More Menu: open modal here?')
    },
    /**
     * open file browser and upload to Filepond
     * update imageData.url
     */
    uploadImage: function () {
      console.log('Upload:');
    },
    /**
     * download image file
     */
    downloadImage: function () {
      console.log('Download:');
    },
    /**
     * remove image data
     */
    removeImage: function () {
      console.log('Delete:');
    },
    /**
     * pass the new object upward to Builder
     */
    addNewCue: function(data) {
      console.log('toolbar addNew:', data);
      this.$emit('addNew', data);
    },
    /**
     * Onion Skin: (All layers?)
     * use image.location to size them. if this is the bottom layer, append ?
     */
    toggleLayers: function () {
      // if on then off
      this.layersVisible = !this.layersVisible;
      console.log('toggleLayers:', this.layersVisible);
    }
  }
}
</script>

<style scoped>
  .builder-toolbar {
    font-size: 16px;
    padding: 5px;
  }
  .toolbar-header {
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    font-weight: 600;
    color: #666666;
    padding: 3px;
  }

  .image-buttons {
    display: flex;
  }
  .file-buttons {
    display: flex;
  }
  .player-buttons {
    width: 50%;
    display: flex;
    justify-content: flex-end;
  }

  .toolbar-column {
    flex-direction: column;
  }
  .progress-time {
    width: 180px;
    font-size: 17px;
    margin-bottom: -9px;
  }
  .time-slider {
    width: 180px;
    height: 1px;
  }
  .icon-captions {
    margin: 0 5px;
    font-size: 26px;
    cursor: pointer;
  }
  .icon-button {
    margin: 0 5px;
    padding: 0 5px;
    cursor: pointer;
    font-size: 18px;
    color: #333333;
    border-radius: 2px;
    border: 1px solid  #000000;
    background-color: #efefef;
  }
  .icon-button:hover {
    background-color: #ccf1cc;
  }
</style>
