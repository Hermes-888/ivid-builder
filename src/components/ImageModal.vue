<template>
  <div class="image-modal"
    @click="$emit('closeModal')"
  >
    <div class="preview-instructions">
      Click Anywhere to Close
    </div>
    <div class="preview-full-img">
      <!-- <img id="preview-image" alt="image"
           :src="imagePath"
      /> -->
      <div class="preview-image"
        :style="{'background-image':'url('+imagePath+')'}"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * overlay with image
   */
  name: "ImageModal",
  props: {
    imagePath: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.image-modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 99vh;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.preview-instructions {
  position: absolute;
  bottom: 15%;
  width: 100%;
  text-align: center;
  color: #888888;
  font-size: 26px;
  font-weight: 600;
  text-align: center;
}

.preview-full-img {
  margin: 5% auto;
  width: 80%;
}
.preview-image {
  width: 80vw;
  height: 80vh;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}
</style>
