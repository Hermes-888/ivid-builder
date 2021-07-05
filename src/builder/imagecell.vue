<template>
  <div class="image-cell">
    <div v-if="imageData.url">
      <img class="image-display"
        :src="imageData.url"
        @click="previewImage"
      />
    </div>

    <div class="image-buttons">
      <button role="button" class="icon-button"
        title="Search images in repository"
        @click="$emit('toggleRepo')"
      >
        <icon-cloud-search title="Search images in repository"/>
      </button>
      <button role="button" class="icon-button"
        title="Upload an image."
        @click="uploadImage"
      >
        <icon-upload-cloud title="Upload an image."/>
      </button>
      <button role="button" class="icon-button"
        title="Remove this image from row."
        v-if="imageData.url"
        @click="removeImage"
      >
        <icon-delete title="Remove this image from row."/>
      </button>
      <button role="button" class="icon-button"
        title="Download this image file."
        v-if="imageData.url"
        @click="downloadImage"
      >
        <icon-file-download title="Download this image file."/>
      </button>
    </div>
  </div>
</template>

<script>
/**
 * display image thumbnail
 * buttons: Upload/Replace Image, Remove Image, Download Image file
 *
 * imageData: {
        url: 'path to image file',
        location: {'top': 0, 'left': 0, 'width': 360, 'height': 180}
    }
 */

export default {
  name: 'imagecell',
  props: {
    imageData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    /**
     * open file browser and upload to image repository
     */
    uploadImage: function () {
      console.log('Upload clicked:', this.imageData);
    },

    /**
     * remove from table and update data
     */
    removeImage: function () {
      if (this.imageData.url) {
        console.log('Remove image from data');
        this.imageData.url = '';
        // emit event to update data
      }
    },

    /**
     * download image file
     */
    downloadImage: function () {
      console.log('Download: ', this.imageData.url);
    },

    /**
     * Preview image in a modal
     * emit image url to StoryTable
     */
    previewImage: function () {
      this.$emit('openModal', this.imageData.url);
    }
  }
}
</script>

<style scoped>
.image-cell {
  position: relative;
  min-width: 320px;
  min-height: 20px;
  box-sizing: border-box;
  text-align: center;
}

.image-buttons {
  display: flex;
  position: absolute;
  bottom: 2%;
  width: 100%;
}

.image-buttons button {
  margin: 0 auto;
}

.image-display {
  max-width: 320px;
  max-height: 180px;
}

.icon-button {
  margin: 0 auto;
  padding: 0 8px;
  cursor: pointer;
  font-size: 18px;
  color: #333333;
  border-radius: 2px;
  border: 1px solid #000000;
  background-color: #efefef;
}
</style>
