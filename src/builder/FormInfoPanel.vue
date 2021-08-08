<template>
    <div class="form-body">
        <div class="form-row-half">
            <label for="startat">Start Time:</label>
            <input type="text" id="startat" class="input-med"
                v-model.number="updatedData.start"
                @keypress="isNumber($event)"
                @input="$emit('itemChanged', updatedData)"
            >
        </div>
        <div class="form-row">
            <input type="checkbox" id="blur"
                v-model="updatedData.useBlur"
                @input="$emit('itemChanged', updatedData)"
            >
            <label for="blur" title="Blur the background during interaction">Use Blur</label>

            <span> -OR- </span>
            <input type="checkbox" id="overlay"
                v-model="updatedData.useOverlay"
                @input="$emit('itemChanged', updatedData)"
            >
            <label for="overlay" title="Overlay the background to obscure it">Use Overlay</label>
            <span class="small-text"> (Neither=clear : NOT Both)</span>
        </div>
        <div class="form-row">
            <input type="checkbox" id="pause"
                v-model="updatedData.pauseVideo"
                @input="$emit('itemChanged', updatedData)"
            >
            <label for="pause" title="Pause the video during the interaction">Pause Video</label>

            <input type="checkbox" id="resume"
                v-model="updatedData.resumePlayback"
                @input="$emit('itemChanged', updatedData)"
            >
            <label for="resume" title="Resume playing the video after the interaction">Resume Video</label>
        </div>
        <div class="form-row">
            <input type="checkbox" id="in"
                v-model="updatedData.animateIn"
                @input="$emit('itemChanged', updatedData)"
            >
            <label for="in" class="wide-label">Animate In |</label>

            <input type="checkbox" id="out"
                v-model="updatedData.animateOut"
                @input="$emit('itemChanged', updatedData)"
            >
            <label for="out" class="wide-label">Animate Out</label>

            <label for="to">| Animate To:</label>
            <input type="text" id="to" class="input-short"
                v-model="updatedData.animateTo"
                @input="$emit('itemChanged', updatedData)"
            >
        </div>
        <div class="form-row">
          <div class="column-left">
            <label for="panelWidth">Panel width:</label>
            <input type="text" id="panelWidth" class="input-short"
                v-model="updatedData.panelWidth"
                @input="$emit('itemChanged', updatedData)"
            >
          </div>
          <div class="column-right">
            <label for="panelBkgColor" title="Panel background color can have opacity. Click the color swatch to change the color">
                Panel Color:
            </label>
            <div class="color-swatch" id="panelBkgColor"
                ref="bkgcolor" title="Click to open a color picker, click again to close it"
                @click="showPalette('panelColor')"
            ></div>
          </div>
        </div>
        <div class="form-row">
          <div class="column-left">
            <label for="infoTitle">Title:</label>
            <input type="text" id="infoTitle" class="long-text-input"
                v-model="updatedData.infoTitle"
                @input="$emit('itemChanged', updatedData)"
            >
          </div>
          <div class="column-right">
            <label for="titleColor" title="Panel background color">Text color:</label>
            <div class="color-swatch" id="titleColor"
                ref="txtcolor" title="Click to open a color picker, click again to close it"
                @click="showPalette('titleColor')"
            ></div>
          </div>
        </div>
        <div class="form-row">
            <span>Information:</span>
        </div>
        <div class="form-row">
            <textarea id="infoText"
                v-model="updatedData.infoText"
                @input="$emit('itemChanged', updatedData)"
            >
            </textarea>
        </div>
        <div class="form-row">
            <label for="buttonText">Button text:</label>
            <input type="text" id="buttonText" class="input-short"
                v-model="updatedData.buttonText"
                @input="$emit('itemChanged', updatedData)"
            >
        </div>
        <color-picker
          v-if="showBkgPalette"
          :color="updatedData.panelBkgColor"
          @changed="changeBkgColor"
          @close="showPalette('panelClose')"
        />
        <color-picker
          v-if="showTxtPalette"
          :color="updatedData.titleColor"
          @changed="changeTxtColor"
          @close="showPalette('titleClose')"
        />
    </div>
</template>

<script>
// A better color picker w/rgba
import ColorPicker from './ColorPicker.vue';

export default {
    name: "FormInfoPanel",
    components: {ColorPicker},
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
            updatedData: [{
              "start": 8.8,
              "type": "InfoPanel",
              "useBlur": true,
              "useOverlay": false,
              "animateIn": true,
              "animateOut": true,
              "animateTo": "",
              "pauseVideo": true,
              "resumePlayback": true,
              "panelWidth": "",
              "panelBkgColor": "",
              "infoTitle": "",
              "titleColor": "",
              "infoText": "",
              "buttonText": ""
            }],// don't mutate the prop
            showBkgPalette: false,
            showTxtPalette: false
        }
    },
    mounted () {
      this.updatedData = JSON.parse(JSON.stringify(this.formData));
      // set color swatchs
      this.$refs.bkgcolor.style.backgroundColor = this.updatedData.panelBkgColor;
      this.$refs.txtcolor.style.backgroundColor = this.updatedData.titleColor;
      // console.log('InfoPanel:', this.updatedData.type, this.updatedData.index);
    },
    methods: {
      // @keypress="isNumber($event)"
      isNumber (evt) {
          const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
          if (!keysAllowed.includes(evt.key)) {
            evt.preventDefault();
          }
        },
        /**
         * Color Picker
         * https://github.com/xiaokaike/vue-color
         */
        showPalette: function (e) {
          let elem = e.toString().substr(0, 6);
          if (elem === 'panelC') {
            this.showBkgPalette = !this.showBkgPalette;
            if (this.showBkgPalette) {
              this.$refs.bkgcolor.classList.add('swatch-glow');
            } else {
              this.$refs.bkgcolor.classList.remove('swatch-glow');
            }
          }
          if (elem === 'titleC') {
            this.showTxtPalette = !this.showTxtPalette;
            if (this.showTxtPalette) {
              this.$refs.txtcolor.classList.add('swatch-glow');
            } else {
              this.$refs.txtcolor.classList.remove('swatch-glow');
            }
          }
        },
        changeBkgColor: function (color) {
            this.updatedData.panelBkgColor = color.hex8;// .rgba is an object, reconstruct as string?
            this.$refs.bkgcolor.style.backgroundColor = color.hex8;
            this.$emit('itemChanged', this.updatedData);
        },
        changeTxtColor: function (color) {
            this.updatedData.titleColor = color.hex8;
            this.$refs.txtcolor.style.backgroundColor = color.hex8;
            this.$emit('itemChanged', this.updatedData);
        }
    }
}
</script>

<style scoped>
    .form-body {
        width: 100%;
    }
    .form-row {
        display: flex;
        width: 100%;
        margin: 5px 0;
    }
    .form-row-half {
        width: 49%;
        margin: 5px 0;
        float: left;
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
    .small-text {
      font-size: 12px;
    }
    #buttonText {
      width: 66%;
    }
    .input-med {
      width: 60px
    }
    .input-short {
        width: 50px;
    }
    .long-text-input {
        width: 82%;
    }
    label {
        margin-right: 5px;
    }

    input, textarea {
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
        width: 99%;
        height: 80px;
        resize: none;
        margin-bottom: 8px;
    }
    .bordered {
        border-top: 2px solid #888888;
        margin-top: 20px;
        padding: 15px 0;
    }
    .empty-button {
        width: 15px;
        margin: 0 10px;
        padding: 0 5px;
        float: right;
        border: 1px solid transparent;
    }
    .icon-button {
        margin: 0 10px;
        padding: 0 5px;
        cursor: pointer;
        float: right;
        font-size: 16px;
        color: #333333;
        border-radius: 2px;
        border: 1px solid  #000000;
        background-color: #efefef;
    }
    .icon-button:hover {
        background-color: #ccf1cc;
    }

    .color-swatch {
        width: 30px;
        height: 20px;
        cursor: pointer;
        border: 1px solid #333333;
    }
    .swatch-glow {
      box-shadow: 0px 0px 20px 5px rgb(2, 64, 32);
      /* in order: x offset, y offset, blur size, spread size, color */
      /* blur size and spread size are optional (they default to 0) */
    }
    .palette-icon {
        font-size: 14px;
        cursor: pointer;
        color: #333333;
    }
</style>
