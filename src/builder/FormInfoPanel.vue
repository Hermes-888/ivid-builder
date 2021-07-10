<template>
    <div class="form-body">
        <!-- <div class="form-row-half">
            <label for="startat">Start Time:</label>
            <input type="text" id="startat" class="short-text-input"
                v-model="updatedData.start"
                @change="$emit('itemChanged', updatedData.start)"
            >
        </div> -->
        <Sketch class="bkg-color-palette"
            v-if="showBkgPalette"
            @input="changeBkgColor"
            :value="updatedData.panelBkgColor"
        />
        <div class="form-row">
          <div class="column-left">
            <label for="panelWidth">Panel width:</label>
            <input type="text" id="panelWidth" class="short-text-input"
                v-model="updatedData.panelWidth"
                @change="$emit('itemChanged', updatedData.panelWidth)"
            >
          </div>
          <div class="column-right">
            <label for="panelBkgColor" title="Panel background color can have opacity. Click the color swatch to change the color">
                Panel Color:
            </label>
            <!-- <input type="color" id="panelBkgColor" class="short-text-input"
                v-model="updatedData.panelBkgColor"
                @change="$emit('itemChanged', updatedData.panelBkgColor)"
            > -->
            <div class="color-swatch" id="panelBkgColor"
                ref="bkgcolor" title="Click to open a color picker, click again to close it"
                @click="showBkgPalette = !showBkgPalette"
            ></div>
            <!-- <span class="palette-icon"
                title="Toggle color picker."
                @click="showPalette = !showPalette"
            >
                <icon-palette title="Toggle color picker."/>
            </span> -->
          </div>
        </div>
        <Sketch class="txt-color-palette"
            v-if="showTxtPalette"
            @input="changeTxtColor"
            :value="updatedData.titleColor"
        />
        <div class="form-row">
          <div class="column-left col-wide">
            <label for="infoTitle">Title:</label>
            <input type="text" id="infoTitle" class="long-text-input"
                v-model="updatedData.infoTitle"
                @change="$emit('itemChanged', updatedData.infoTitle)"
            >
          </div>
          <div class="column-right">
            <label for="titleColor" title="Panel background color">Text color:</label>
            <!-- <input type="color" id="titleColor" class="short-text-input"
                v-model="updatedData.titleColor"
                @change="$emit('itemChanged', updatedData.titleColor)"
            > -->
            <div class="color-swatch" id="titleColor"
                ref="txtcolor" title="Click to open a color picker, click again to close it"
                @click="showTxtPalette = !showTxtPalette"
            ></div>
          </div>
        </div>
        <div class="form-row">
            <!-- <label for="infoText">Message:</label> -->
            <!-- <input type="text" id="infoText" class="long-text-input"
                v-model="updatedData.infoText"
                @change="$emit('itemChanged', updatedData.infoText)"
            > -->
            <span>Information:</span>
        </div>
        <div class="form-row">
            <textarea id="infoText"
                v-model="updatedData.infoText"
            >
            </textarea>
        </div>
        <div class="form-row">
            <label for="infoText">Button text:</label>
            <input type="text" id="infoText" class="short-text-input"
                v-model="updatedData.buttonText"
                @change="$emit('itemChanged', updatedData.buttonText)"
            >
        </div>
    </div>
</template>

<script>
// A better color picker w/rgba
// ToDo: add an overlay when the palette is visible, to click for close?
import {Sketch} from 'vue-color';

export default {
    /**
        "start": 8.8,
        "type": "InfoPanel",
        "useBlur": true,
        "useOverlay": false,
        "animateIn": true,
        "animateOut": true,
        "animateTo": "25%",
        "pauseVideo": true,
        "resumePlayback": true,
        "panelWidth": "40%",
        "panelBkgColor": "rgba(3,117,163, 0.6)",
        "infoTitle": "This is an info panel Title",
        "titleColor": "#ffffff",
        "infoText": "This is the information to display. This is the information to display. This is the information to display.",
        "buttonText": "I Agree"
     */
    name: "FormInfoPanel",
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
            showBkgPalette: false,
            showTxtPalette: false,
            // colors: {
            //     hex: '#000000',// default
            //     rgba: {r: 0, g: 0, b: 0, a: 1},
            //     a: 1// alpha
            // },
            updatedData: [{
                "panelWidth": '',
                "panelBkgColor": '',
                "infoTitle": '',
                "titleColor": '',
                "infoText": '',
                "buttonText": ''
            }],// don't mutate the prop
        }
    },
    mounted () {
        this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
            // set color swatchs
            this.$refs.bkgcolor.style.backgroundColor = this.updatedData.panelBkgColor;
            this.$refs.txtcolor.style.backgroundColor = this.updatedData.titleColor;
        });
    },
    methods: {
        /**
         * Color Picker
         * https://github.com/xiaokaike/vue-color
         */
        changeBkgColor: function (color) {
            // this.showPalette = false;// nope, sliders in picker
            //console.log('changeBkgColor:', color);
            this.updatedData.panelBkgColor = color.hex8;// .rgba is an object, reconstruct as string?
            this.$emit('itemChanged', this.updatedData.panelBkgColor);
            this.$refs.bkgcolor.style.backgroundColor = color.hex8;
        },
        changeTxtColor: function (color) {
            this.updatedData.panelBkgColor = color.hex8;// .rgba is an object, reconstruct as string?
            this.$emit('itemChanged', this.updatedData.textColor);
            this.$refs.txtcolor.style.backgroundColor = color.hex8;
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
        clear: both;
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
    .short-text-input {
        width: 20%;
        margin-right: 20px;
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
        width: 87%;
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

    .bkg-color-palette {
        position: absolute;
        top: 26%;
        right: 9%;
    }
    .txt-color-palette {
        position: absolute;
        top: 31%;
        right: 9%;
    }
    .color-swatch {
        width: 30px;
        height: 20px;
        cursor: pointer;
        border: 1px solid #333333;
    }
    .palette-icon {
        font-size: 14px;
        cursor: pointer;
        color: #333333;
    }
</style>
