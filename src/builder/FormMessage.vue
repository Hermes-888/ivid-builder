<template>
    <div class="form-body">
        <div class="form-row">
            <label for="startat">Start Time:</label>
            <input type="text" id="startat" class="input-med"
                v-model="updatedData.start"
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
            <span class="small-text"> (Neither=clear : NOT Both) </span>
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
        <!-- element specific -->
        <div class="form-row">
          <label for="duration"
            title="Second displayed on screen">
            Duration:
          </label>
          <input type="text" id="duration" class="input-short"
            v-model="updatedData.duration"
            @input="$emit('itemChanged', updatedData)"
          >
          <input type="checkbox" id="remove"
            v-model="updatedData.removeMessage"
            @input="$emit('itemChanged', updatedData)"
          >
          <label for="remove" 
            title="False will leave the message on the screen">
            Remove Message
          </label>
        </div>
        <div class="form-row">
            <span>Message:</span>
        </div>
        <div class="form-row">
          <textarea id="messageText"
            v-model="updatedData.messageText"
            @input="$emit('itemChanged', updatedData)"
          >
          </textarea>
        </div>
        <color-picker id="txtClose"
          v-if="showTxtPalette"
          :color="updatedData.textColor"
          @changed="changeTxtColor"
          @close="showPalette('txtClose')"
        />
        <color-picker id="bkgClose"
          v-if="showBkgPalette"
          :color="updatedData.bkgColor"
          @changed="changeBkgColor"
          @close="showPalette('bkgClose')"
        />
        <div class="form-row">
          <div class="column-half">
            <label for="txtColor" title="Panel background color">
              Text Color:
            </label>
            <div class="color-swatch" id="txtColor"
              ref="txtcolor" title="Click to open a color picker, click again to close it"
              @click="showPalette('txtColor')"
            ></div>
          </div>
          <div class="column-half">
            <label for="bkgColor"
              title="Panel background color can have opacity. Click the color swatch to change the color">
              Background Color:
            </label>
            <div class="color-swatch" id="bkgColor"
              ref="bkgcolor" title="Click to open a color picker, click again to close it"
              @click="showPalette('bkgColor')"
            ></div>
          </div>
        </div>
    </div>
</template>

<script>
import ColorPicker from './ColorPicker.vue';

export default {
    name: "FormMessage",
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
              "start": 0,
              "type": "AnimatedMessage",
              "useBlur": false,
              "useOverlay": false,
              "animateIn": true,
              "animateOut": true,
              "animateTo": "35%",
              "pauseVideo": false,
              "resumePlayback": true,
              "removeMessage": true,
              "messageText": "",
              "duration": 1,
              "bkgColor": "#ffffffCC",
              "textColor": "#333333"
            }],// .index is added in FormScene
            showBkgPalette: false,
            showTxtPalette: false
        }
    },
    mounted () {
      this.updatedData = JSON.parse(JSON.stringify(this.formData));
      // add
      if (!this.updatedData.hasOwnProperty('bkgColor')) {
        this.updatedData.bkgColor = "rgba(255,255,255, 0.8)";
        this.updatedData.textColor = "#333333";
      }
      // set color swatchs
      this.$refs.bkgcolor.style.backgroundColor = this.updatedData.bkgColor;
      this.$refs.txtcolor.style.backgroundColor = this.updatedData.textColor;
      // console.log('Message:', this.updatedData.type, this.updatedData.index);
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
        let elem = e.toString().substr(0, 4);
        if (elem === 'bkgC') {
          this.showBkgPalette = !this.showBkgPalette;
          if (this.showBkgPalette) {
            this.$refs.bkgcolor.classList.add('swatch-glow');
          } else {
            this.$refs.bkgcolor.classList.remove('swatch-glow');
          }
        }
        if (elem === 'txtC') {
          this.showTxtPalette = !this.showTxtPalette;
          if (this.showTxtPalette) {
            this.$refs.txtcolor.classList.add('swatch-glow');
          } else {
            this.$refs.txtcolor.classList.remove('swatch-glow');
          }
        }
      },
      changeBkgColor: function (color) {
        this.updatedData.bkgColor = color.hex8;// .rgba is an object, reconstruct as string?
        this.$refs.bkgcolor.style.backgroundColor = color.hex8;
        this.$emit('itemChanged', this.updatedData);
      },
      changeTxtColor: function (color) {
        this.updatedData.textColor = color.hex8;
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
    .column-half {
      width: 49%;
      display: flex;
      justify-content: flex-start;
    }
    .small-text {
      font-size: 12px;
    }
    .input-short {
        width: 45px;
    }
    .input-med {
        width: 60px;
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
        width: 100%;
        height: 80px;
        resize: none;
        margin-bottom: 8px;
    }
    .bordered {
        border-top: 2px solid #888888;
        margin-top: 20px;
        padding: 15px 0;
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
</style>
