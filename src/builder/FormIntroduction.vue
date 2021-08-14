<template>
    <div class="form-body">
      <div class="form-container">
        <div class="form-row">
            <label for="titleText">Title:</label>
            <input id="titleText"
              v-show="updatedData.titleText"
              v-model="updatedData.titleText" placeholder="edit me"
              @input="changeScreen"
            >
        </div>
        <div class="form-row">
          <span>Introduction Text:</span>
        </div>
        <div class="form-row"
          v-if="updatedData.text"
        >
          <bubble-editor id="description" class="textarea-editor" 
            v-model="updatedData.text"
            @hasUpdates="changeScreen"
          />
            <!-- <textarea id="description"
                v-model="updatedData.text"
                @input="changeScreen"
            >
            </textarea> -->
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
                @click="showPalette('btnColor')"
            ></div>
            <!-- <input type="text" id="btnHex" class="input-hex-number"
              v-model="updatedData.buttonColor"
              @input="changeScreen"
            > -->
          </div>
          <div class="column-right">
            <label for="btnFillColor" title="Fill the play button">
              Button Fill Color
            </label>
            <div class="color-swatch" id="btnFillColor"
                ref="fillcolor" title="Click to open a color picker, click again to close it"
                @click="showPalette('fillColor')"
            ></div>
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
      <color-picker id="btnClose"
        v-if="showBtnPalette"
        :color="updatedData.buttonColor"
        @changed="changeBtnColor"
        @close="showPalette('btnClose')"
      />
      <color-picker id="fillClose"
        v-if="showFillPalette"
        :color="updatedData.fillColor"
        @changed="changeFillColor"
        @close="showPalette('fillClose')"
      />
    </div>
</template>

<script>
import ColorPicker from './ColorPicker.vue';
import BubbleEditor from "./BubbleEditor.vue";
// import Vue from 'vue';// for editorNode instance

export default {
    /**
     * Nice form styles
     * https://codepen.io/rickyeckhardt/pen/zYGwaKr
     * https://codepen.io/uzcho_/pen/bPZMez
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
     */
    name: "FormIntroduction",
    components: {ColorPicker, BubbleEditor},
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
            showFillPalette: false,
            updatedData: {
                titleText: '',
                text: '',
                audio: '',
                image: '',
                buttonColor: '',
                fillColor: ''
            },// don't mutate the prop
        }
    },
    // mounted () {
    //     create a deep copy of data to mutate
    //     this.$nextTick(function() {
    //         this.updatedData = JSON.parse(JSON.stringify(this.formData));
    //         this.$refs.btncolor.style.backgroundColor = this.updatedData.buttonColor;
    //         this.$refs.fillcolor.style.backgroundColor = this.updatedData.fillColor;
    //         console.log('FormIntroduction mounted updatedData:', this.updatedData);
    //     });
    // },
    watch: {
      formData: {
        immediate: true,
        handler(newstate, oldstate) {
          // ToDo: selecting a repoImage re-renders this component and overwrites any changes already made
          // store the changes in localStorage? and re-define them only if they exist in localStorage
          this.$nextTick(function() {
              this.updatedData = JSON.parse(JSON.stringify(newstate));
              this.$refs.btncolor.style.backgroundColor = this.updatedData.buttonColor;
              this.$refs.fillcolor.style.backgroundColor = this.updatedData.fillColor;
              // console.log('FormIntroduction updated:', this.updatedData);
          });
        }
      }
    },
    methods: {
        uploadFile: function(type) {
          console.log('upload', type);
          switch(type) {
            case 'audio':
              // updatedData.audio
              break;
            case 'image':
              // updatedData.image
              break;
          }
        },
        findFile: function(type) {
          console.log('find', type);
          switch(type) {
            case 'audio':
              // updatedData.audio
              // RepoPanel tabs: 0=Sounds, 1=Videos, 2=Images
              // {tab:#, state:true=open it}
              this.$emit('toggleRepo', {tab:0, state:true});
              break;
            case 'image':
              // updatedData.image
              this.$emit('toggleRepo', {tab:2, state:true});
              break;
          }
        },
        showPalette: function (e) {
          let elem = e.toString().substr(0, 4);
          if (elem === 'btnC') {
            this.showBtnPalette = !this.showBtnPalette;
            if (this.showBtnPalette) {
              this.$refs.btncolor.classList.add('swatch-glow');
            } else {
              this.$refs.btncolor.classList.remove('swatch-glow');
            }
          }
          if (elem === 'fill') {
            this.showFillPalette = !this.showFillPalette;
            if (this.showFillPalette) {
              this.$refs.fillcolor.classList.add('swatch-glow');
            } else {
              this.$refs.fillcolor.classList.remove('swatch-glow');
            }
          }
        },
        changeBtnColor: function (color) {
            this.updatedData.buttonColor = color.hex8;// .rgba is an object, reconstruct as string?
            this.$refs.btncolor.style.backgroundColor = color.hex8;
            document.querySelectorAll('circle')[0].style.stroke = color.hex8;
            document.querySelectorAll('polygon')[1].style.fill = color.hex8;
        },
        changeFillColor: function (color) {
            this.updatedData.fillColor = color.hex8;// .rgba is an object, reconstruct as string?
            this.$refs.fillcolor.style.backgroundColor = color.hex8;
            document.querySelectorAll('circle')[0].style.fill = color.hex8;
        },
        changeBkgImage: function (image) {
          document.querySelector('.introduction').style.backgroundImage = "url('" + this.updatedData.image + "')";
        },
        changeScreen: function(e, html) {
          // console.log(e, 'Intro changeScreen id:', e.target.id, 'input e:', e);
          let el, val;
          if (e.target) {
            el = e.target.id;
            val = e.target.value;
          } else {
            el = e;
            val = html;
          }

          switch (el) {
            case 'titleText':
              document.querySelector('.titlebar').innerHTML = val;
              break;
            case 'description':
              document.querySelector('.intro-text').childNodes[1].innerHTML = val;
              break;
            // case 'btnHex':
            //   var color = val;// UNUSED
            //   //https://www.npmjs.com/package/validate-color
            //   console.log('color:', color);
            //   this.updatedData.buttonColor = color;
            //   this.$refs.btncolor.style.backgroundColor = color;
            //   break;
          }
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
    .input-hex-number {
      width: 100px;
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
    .textarea-editor {
      width: 100%;
      max-width: 500px;
      /* height: 80px; */
      resize: none;
      /* contain: content; */
      /* overflow-y: scroll; */
    }
    input[type="checkbox"] {
      width: 90px;
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

    .picker-panel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background-color: rgba(0,0,0, 0.2);
    }
    .picker-panel .close-circle-outline-icon {
        margin: 5px 10px;
        float: right;
    }
    .picker-panel .close-circle-outline-icon .material-design-icon__svg {
        fill: #ffffff;
    }
    .btn-color-palette {
        position: absolute;
        top: 31%;
        left: 160px;
    }
    .btn-fill-palette {
        position: absolute;
        top: 31%;
        right: 58px;
    }
    .color-swatch {
        width: 30px;
        height: 20px;
        margin: 0 5px;
        cursor: pointer;
        border: 1px solid #000000;
    }
    .swatch-glow {
      box-shadow: 0px 0px 20px 5px rgb(78, 236, 210);
      /* in order: x offset, y offset, blur size, spread size, color */
      /* blur size and spread size are optional (they default to 0) */
    }
    .column-left {
      width: 60%;
      display: flex;
      justify-content: flex-start;
      /* border: 1px solid #333; */
    }
    .column-right {
      width: 40%;
      display: flex;
      justify-content: flex-end;
      /* border: 1px solid rgb(8, 106, 172); */
    }
</style>
