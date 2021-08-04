<template>
  <div class="repo-panel">
    <div class="repo-header">
      Image Repository
      <div
        class="close-button"
        title="Close repository"
        @click="$emit('closeRepo')"
      >
        <icon-close title="Close repository"/>
      </div>
    </div>
    <div class="repo-description">
      <p>The cloud based image repository will hold all the uploaded images. You will be able to filter and select an
        image from the repository.</p>
    </div>

    <div class="repo-container">
      <div id="tabs" class="tabs-container">
          <div class="tabs">
              <span
                  v-for="(tab, index) in repoAssets"
                  :key="index"
              >
                  <a :class="[activetab === index ? 'active' : '']"
                      @click="activetab=index"
                      v-text="tab"
                  ></a>
              </span>
          </div>
          <div class="tab-content"
              :data-index="0"
              v-if="activetab === 0"
          >
              <div class="image-holder"
                v-for="(aud, num) in repoSounds"
                :key="num"
              >
                <play-audio-button :audioPath="repoSounds[num]"/>
                <div class="repo-image-name"
                  v-html="simplifyFilename(aud)"
                ></div>
              </div>
          </div>
          <div class="tab-content"
              :data-index="1"
              v-if="activetab === 1"
          >
            <div class="image-holder"
                v-for="(vid, num) in repoVideos"
                :key="num"
              >
                <div class="repo-image-name"
                  v-html="simplifyFilename(vid)"
                ></div>
              </div>
          </div>
          <div class="tab-content"
              :data-index="2"
              v-if="activetab === 2"
          >
              <div class="image-holder"
                v-for="(img, num) in repoImages"
                :key="num"
              >
                <img class="image-thumbs"
                  :data-index="num"
                  :src="img"
                  :title="extractFilename(img)"
                  @click="imageSelected"
                />
                <div class="repo-image-name"
                  v-html="simplifyFilename(img)"
                ></div>
              </div>
          </div>
      </div>
      <!-- <div class="repo-drag-handle"></div> -->
    </div>
    <div class="upload-button">
      <button role="button" class="icon-button"
          title="Open a file on this device"
      >
          <icon-open title="Open a file on this device"/>
      </button>
      <span>UPLOAD NEW </span>
      <span v-text="repoAssets[activetab]"></span>
    </div>
  </div>
</template>

<script>
import Interact from 'interactjs';
import PlayAudioButton from '../components/PlayAudioButton.vue';

export default {
  /**
   * half screen drawer overlay
   * Tabs for Audio, Video & Images to select
   */
  name: "RepoPanel",
  components: {
    PlayAudioButton
  },
  data() {
    return {
      // ToDo: read a folder? external data
      activetab: 2,
      repoAssets: ['Sounds','Videos','Images'],
      repoSounds: [
        'audio/foundit.mp3', 
        'audio/hint.mp3', 
        'audio/nope.mp3', 
        'audio/what_next.mp3', 
        'audio/feedback.mp3'
      ],
      repoVideos: ['fake/Scene_1.mp4', 'fake/Branch_A.mp4', 'fake/Branch_B.mp4'],
      repoImages: [
        'images/allergen_platter_lt.png',
        'images/bakery_background.jpg',
        'images/garlic_sauce.png',
        'images/Caroline_left_pointing.png',
        'images/customer_mother_boy.png',
        'images/cookies.png'
      ]
    }
  },
  mounted() {
    /**
     * Repo Panel can resize the width
     */
    const comp = this;
    Interact('.repo-panel').resizable({
      edges: {top: false, left: false, bottom: false, right: true},
      listeners: {
        move: function (event) {
          event.preventDefault();
          event.stopPropagation();

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`
          });
        }
      }
    });
  },
  methods: {
    imageSelected(event) {
      // index = repoImages[index] = filename
      let index = event.target.getAttribute('data-index');
      if (index) {
        this.$emit('imageSelected', this.repoImages[index]);
      }
    },
    simplifyFilename: function (a) {
      let name = a.split('/');
      let n2 = name[1].split('.');
      return n2[0].replace(/_/g, ' ');
    },
    extractFilename: function (a) {
      let name = a.split('/');
      return name[1];
    }
  }
}
</script>

<style scoped>
.repo-panel {
  position: absolute;
  top: 8px;
  left: 0;
  width: 27vw;
  height: 95vh;
  z-index: 10;
  user-select: none;
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
  border: 3px solid #333333;
  background-color: #efefef;
  box-sizing: border-box;
  -ms-touch-action: none;
  touch-action: none;
  min-width: 25%;
  max-width: 65%;
}

.repo-header {
  width: 97%;
  padding: 1% 0;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
}

.close-button {
  cursor: pointer;
  float: right;
  font-size: 27px;
  margin-top: -4px;
}

.repo-description {
  padding: 0 5%;
  font-size: smaller;
}

.repo-container {
  margin-left: 2%;
}

.repo-drag-handle {
  position: absolute;
  right: 0;
  width: 15px;
  height: 70%;
}

.repo-drag-handle:hover {
  background-color: #dfdfdf;
}

.image-holder {
  width: 100px;
  height: fit-content;
  margin: 1%;
  padding: 3px;
  border-radius: 8px;
  border: 2px solid #000000;
  background-color: #ffffff;
}

.image-thumbs {
  cursor: pointer;
  width: 100%;
}

.repo-image-name {
  text-align: center;
  font-size: smaller;
  /*user-select: text;*/
}

.upload-button {
  position: absolute;
  bottom: 1%;
  left: 2%;
  width: 92%;
  padding: 5px;
  font-size: 16px;
  color: #333;
  text-align: center;
  font-weight: 600;
  line-height: 30px;
  white-space: pre-wrap;
  border-radius: 12px;
  border: 3px solid #888888;
  background-color: #f1f1f1;
  cursor: pointer;
}
.upload-button:hover {
  color: #fff;
  background-color: #aaa;
}

.icon-button {
  float: left;
  margin: 0 5px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 22px;
  color: #333333;
  border-radius: 6px;
  border: 1px solid  #000000;
  background-color: #efefef;
}
.icon-button:hover {
  background-color: #ccf1cc;
}

/* tabs https://vuejsexamples.com/tabbed-content-with-vue-js/ */
.tabs-container {  
    width: 100%;
    /* margin: 10px auto; */
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
    font-weight: bold;
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
    display: flex;
    flex-wrap: wrap;
    width: 96%;
    max-height: 500px;
    overflow-y: auto;
    padding: 2px;
    border: 1px solid #888888;
    background-color: #ffffff;
    border-radius: 8px;
}
</style>
