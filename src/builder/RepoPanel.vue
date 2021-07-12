<template>
  <div class="repo-panel">
    <div class="repo-header">
      Image Repository
      <div
        class="close-button"
        @click="$emit('closeRepo')"
      >
        <icon-close/>
      </div>
    </div>
    <div class="repo-description">
      <p>The cloud based image repository will hold all the uploaded images. You will be able to filter and select an
        image from the repository.</p>
    </div>

    <div class="repo-container">
      <div class="repo-drag-handle"></div>
      <div class="image-holder"
        v-for="(img, index) in repoImages"
        :key="index"
      >
        <img class="image-thumbs"
          :data-index="index"
          :src="img"
          :title="extractFilename(img)"
          @click="imageSelected"
        />
        <div class="repo-image-name"
          v-html="simplifyFilename(img)"
        ></div>
      </div>
    </div>
    <div class="upload-button">UPLOAD NEW IMAGE or VIDEO</div>
  </div>
</template>

<script>
import Interact from 'interactjs';

export default {
  /**
   * half screen drawer overlay of images to select
   * triggered by
   */
  name: "RepoPanel",
  components: {},
  props: {
    repoImages: {
      type: Array,
      default() {
        return []
      }
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
        },
        end: function (e) {
          // console.log(e.type, e.target.style.width);
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
  left: 0; /* transition in StoryBoard animates onto screen */
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
  max-width: 65%; /* drag wider handle? Interact resizeable? */
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
  border-bottom: 1px solid #666666;
}

.repo-container {
  /*display: flex;*/
  /*padding: 2%;*/
  margin-left: 4%;
}

.repo-drag-handle {
  position: absolute;
  right: 0;
  width: 15px;
  height: 80%;
}

.repo-drag-handle:hover {
  background-color: #dfdfdf;
}

.image-holder {
  float: left;
  width: 90px;
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
  left: 12%;
  height: 30px;
  padding: 10px;
  color: #024747;
  text-align: center;
  font-weight: 600;
  line-height: 30px;
  white-space: pre-wrap;
  border-radius: 12px;
  border: 3px solid #008000;
  background-color: #8fbc8f;
  cursor: pointer;
}

.upload-button:hover {
  border: 3px solid #012b01;
  background-color: #c2f1c2;
}
</style>
