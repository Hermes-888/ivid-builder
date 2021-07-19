<template>
    <div class="form-body">
      <div class="form-container">
        <div class="form-row">
            <label for="titleText">Title:</label>
            <input id="titleText"
              v-show="updatedData.titleText"
              v-model="updatedData.titleText" placeholder="edit me"
            >
        </div>
        <div class="form-row">
          <span>Introduction Text:</span>
        </div>
        <div class="form-row">
            <textarea id="description"
                v-model="updatedData.text"
            >
            </textarea>
        </div>
        <div class="form-row">
            <button id="audioUpload" role="button" class="icon-button"
                title="Upload an audio file."
                @click="uploadFile('audio')"
            >
                <icon-upload-cloud title="Upload an audio file."/>
            </button>
            <button role="button" class="icon-button"
                title="Search for image"
                @click="findFile('audio')"
            >
                <icon-file-search/>
            </button>
            <label for="audio" title="Audio file for introduction text.">Audio:</label>
            <input id="audio" class="input-short"
              v-model="updatedData.audio" placeholder="optional"
            >
        </div>
        <div class="form-row">
            <button id="imageUpload" role="button" class="icon-button"
                title="Upload an image. It will also be added to the repository."
                @click="uploadFile('image')"
            >
                <icon-upload-cloud title="Upload an image. It will also be added to the repository."/>
            </button>
            <button role="button" class="icon-button"
                title="Search for image"
                @click="findFile('image')"
            >
                <icon-file-search/>
            </button>
            <label for="image" title="Background image for introduction screen.">Image:</label>
            <input id="image" class="input-short"
              v-model="updatedData.image" placeholder="optional"
              @change="changeBkgImage"
            >
        </div>
        <div class="form-row">
          <div class="column-left">
            <label for="btnColor">Button Color:</label>
            <div class="color-swatch" id="btnColor"
                ref="btncolor" title="Click to open a color picker, click again to close it"
                :style="{'backgroundColor':updatedData.buttonColor}"
                @click="showBtnPalette = !showBtnPalette"
            ></div>
            <input type="text" id="btnHex" class="input-short-short"
              v-model="updatedData.buttonColor"
            >
          </div>
        </div>
      </div>
      <div class="form-row bordered">
          <button role="button" class="icon-button right"
              title="Save changes"
              @click="$emit('saveChanges', updatedData)"
          >
              Save Intro Changes <icon-save-file/>
          </button>
      </div>
      <Sketch class="btn-color-palette"
        v-if="showBtnPalette"
        @input="changeBtnColor"
        :value="updatedData.buttonColor ? updatedData.buttonColor : '#ff0000'"
      />
    </div>
</template>

<script>
//
import {Sketch} from 'vue-color';

export default {
    /**
     * Nice form styles
     * https://codepen.io/rickyeckhardt/pen/zYGwaKr
     * https://codepen.io/uzcho_/pen/bPZMez
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
     */
    name: "FormIntroduction",
    components: {Sketch},
    props: {
        formData: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data () {
        return {
            showBtnPalette: false,
            screenClasses: ['introduction', 'intro-text', 'start-button', 'svg.circle', 'svg.polygon'],
            updatedData: {
                titleText: '',
                text: '',
                audio: '',
                image: '',
                buttonColor: '#333333'// add?
            },// don't mutate the prop
        }
    },
    mounted () {
        // create a deep copy of data to mutate
        this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
            this.updatedData.buttonColor = '#333333';// add?
        });
    },
    methods: {
        uploadFile: function(type) {
            console.log('upload', type);
        },
        findFile: function(type) {
            console.log('find', type);
            
            switch(type) {
              case 'audio':
                // updatedData.audio
                break;
              case 'image':
                // updatedData.image
                this.$emit('toggleRepo');// send state?
                break;
            }
        },
        changeBtnColor: function (color) {
            this.updatedData.buttonColor = color.hex8;// .rgba is an object, reconstruct as string?
            this.$refs.btncolor.style.backgroundColor = color.hex8;
            document.querySelectorAll('circle')[0].style.stroke = color.hex8;
            document.querySelectorAll('polygon')[1].style.fill = color.hex8;
        },
        changeBkgImage: function (image) {
          console.log('changeBkgImage:', this.updatedData.image);
          document.querySelector('.introduction').style.backgroundImage = "url('" + this.updatedData.image + "')";
        }
    }
}
</script>

<style scoped>
    .form-body {
        width: 100%;
    }
    .form-container {
      border-radius: 8px;
      padding: 5px;
      background-color: #ffffff;
    }
    .form-row {
        display: flex;
        width: 100%;
        margin: 5px 0;
        clear: both;
    }
    .right {
      float: right;
    }
    .bordered {
        display: inline-block;
        border-top: 2px solid #888888;
        margin-top: 10px;
        padding-top: 10px;
    }
    .input-short {
      width: 70%;
    }
    .input-short-short {
      width: 30%;
    }
    input, textarea {
        width: 90%;
        font-family: sans-serif;
        font-size: 16px;
        box-sizing: border-box;
        outline: none;
        border-color: #333333;
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 1px;
        border-left-width: 0;
    }
    input:focus-visible, textarea:focus-visible {
        outline: none;
        border-color: #718871;
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 3px;
        border-left-width: 0;
    }
    textarea {
        width: 100%;
        height: 80px;
        resize: none;
        margin-bottom: 8px;
    }
    .empty-button {
        width: 15px;
        margin: 0 10px;
        padding: 0 5px;
        float: right;
        border: 1px solid transparent;
    }
    .icon-button {
        margin: 0 5px;
        padding: 0 5px;
        cursor: pointer;
        font-size: 16px;
        color: #333333;
        border-radius: 2px;
        border: 1px solid  #000000;
        background-color: #efefef;
    }
    .icon-button:hover {
        background-color: #ccf1cc;
    }

    .btn-color-palette {
        position: absolute;
        top: 31%;
        left: 160px;
    }
    .color-swatch {
        width: 30px;
        height: 20px;
        margin: 0 5px;
        cursor: pointer;
        border: 1px solid #000000;
    }
    .column-left {
      width: 66%;
      display: flex;
      /* border: 1px solid #333; */
    }
    .column-right {
      width: 33%;
      display: flex;
      justify-content: flex-end;
      /* border: 1px solid rgb(8, 106, 172); */
    }
</style>
