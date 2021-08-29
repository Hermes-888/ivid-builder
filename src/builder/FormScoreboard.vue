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
    </div>
    <!-- element specific -->
    <div class="form-row">
      <label for="from">Animate From</label>
      <input type="text" id="from" class="input-short"
        v-model="updatedData.animateFrom"
        @input="$emit('itemChanged', updatedData)"
      >
      <label for="to" style="margin-left:10px;">| Animate To:</label>
      <input type="text" id="to" class="input-short"
        v-model="updatedData.animateTo"
        @input="$emit('itemChanged', updatedData)"
      >
    </div>
    <div class="form-row">
      <label for="scoreText" title="Image for button.">Text:</label>
      <input id="scoreText" class="input-long"
        v-model="updatedData.text"
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
    <color-picker
      v-if="showBkgPalette"
      :color="updatedData.panelBkgColor"
      @changed="changeBkgColor"
      @close="showPalette('panelClose')"
    />
  </div>
</template>

<script>
import ColorPicker from './ColorPicker.vue';
import Interact from 'interactjs';

export default {
  name: "FormScoreboard",
  components: {ColorPicker},
  props: {
    formData: {
      type: Object,
      default() {
        return {
          start: 0,
          type: "Scoreboard",
          useBlur: false,
          useOverlay: false,
          animateIn: false,// comp internal?
          animateOut: false,
          animateTo: "10%",
          animateFrom: "-10%",
          pauseVideo: false,
          resumePlayback: true,
          removeMessage: true,// if clicked
          panelWidth: '25%',
          panelBkgColor: '#ffffffCC',
          text: 'Found Score:',
          score: 0,
          possible: 0
        }
      }
    }
  },
  data () {
    return {
      updatedData: [{
        start: 0,
        type: "Scoreboard",
        useBlur: false,
        useOverlay: false,
        animateIn: false,// comp internal?
        animateOut: false,
        animateTo: "10%",
        animateFrom: "-10%",
        pauseVideo: false,
        resumePlayback: true,
        removeMessage: true,// if clicked
        panelWidth: '25%',
        panelBkgColor: '#ffffffCC',
        text: 'Found Score:',
        score: 0,
        possible: 0
      }],// .index is added in FormScene
      showBkgPalette: false,// text color?
      element: null
    }
  },
  mounted () {
    this.updatedData = JSON.parse(JSON.stringify(this.formData));
    console.log('Scoreboard:', this.updatedData.type, this.updatedData.index);

    this.$nextTick(function() {
      this.element = document.querySelector('.modal-elements').querySelector('.score-group');
      // console.log('element:', this.element);
      const comp = this;
      Interact(comp.element).draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        modifiers: [
          Interact.modifiers.restrictRect({
            // restriction: 'parent'
            restriction: document.querySelector('.editor-modal')
          })
        ],

        listeners: {
          start(e) {
            // interact('#specificElement').draggable(false);
          },
          // every dragmove event
          move(event) {
            var target = event.target;
            // keep the dragged position in the data-x/data-y attributes
            var x = (parseInt(target.getAttribute('data-x')) || 0) + event.dx;
            var y = (parseInt(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
          // call this function on every dragend event
          end(event) {
            console.log('Scoreboard drag end:', event);
            // set animateTo top px & left px
            let bounds = event.target.getBoundingClientRect();
            // comp.updatedData.position.left = Math.round(bounds.left) + 'px';
            comp.updatedData.animateTo = Math.round(bounds.top) + 'px';
            console.log('updatedData:', bounds, comp.updatedData);
            // comp.$emit('itemChanged', comp.updatedData);
          }
        }
      });
    });
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
      // if (elem === 'titleC') {
      //   this.showTxtPalette = !this.showTxtPalette;
      //   if (this.showTxtPalette) {
      //     this.$refs.txtcolor.classList.add('swatch-glow');
      //   } else {
      //     this.$refs.txtcolor.classList.remove('swatch-glow');
      //   }
      // }
    },
    changeBkgColor: function (color) {
        this.updatedData.panelBkgColor = color.hex8;// .rgba is an object, reconstruct as string?
        this.$refs.bkgcolor.style.backgroundColor = color.hex8;
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
  .column-left {
    width: 66%;
    display: flex;
    /* border: 1px solid #333; */
  }
  .column-right {
    width: 33%;
    display: flex;
    justify-content: flex-end;
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
  .input-long {
    width: 75%;
  }
  .loc-prop {
    margin: 0 10px 0 5px;
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
    margin: 0 5px;
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
