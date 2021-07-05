<template>
  <div class="image-modal"
    @click="closeModal"
  >
    <div class="preview-instrutions">
      Click Anywhere <br>to Close
    </div>
    <div class="preview-full-img">
      <img :src="imagePath" alt="image"/>
    </div>
  </div>
</template>

<script>
export default {
  /**
   * overlay with image
   */
  name: "ImageModal",
  components: {},
  props: {
    imagePath: {
      type: String,
      default: ''
    }
  },
  methods: {
    closeModal: function () {
      this.$emit('closeModal');
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
  width: 99vw;
  height: 98vh;
  background-color: rgba(0, 0, 0, 0.8);;
  cursor: pointer;
}

.preview-instrutions {
  position: absolute;
  top: 5%;
  right: 5%;
  color: #888888;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.preview-full-image {
  height: 95vh;
  margin: 1%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}

/* alt view */
.preview-full-img {
  margin: 1%;
}
</style>
