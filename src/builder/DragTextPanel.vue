<template>
  <div class="drag-text"
    :style="{
      transform: 'translate('+txtLocation.left+'px,'+txtLocation.top+'px)'
    }"
  >
    <Sketch id="text-color-palette"
      v-if="showPalette"
      @input="changeTextColor"
      :value="colors"
    />
    <div class="drag-panel-header">
      {{ panelType }}
      <span class="palette-icon"
        title="Toggle color picker."
        v-if="screenText.text"
        @click="openTextColor"
      >
        <icon-palette title="Toggle color picker."/>
      </span>
    </div>
    <div v-if="screenText.text">
      <div class="screen-text"
        v-html="screenText.text"
      ></div>
      <div class="stats-panel">
        <div>top: {{ txtLocation.top }}, left: {{ txtLocation.left }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Interact from 'interactjs';
import {Sketch} from 'vue-color';
// TODO: import BubbleEditor from '@/components/BubbleEditor.vue';

export default {
  /**
   * https://interactjs.io/docs/installation
   * Draggable panel instance for ScreenText
   * Color Picker:
   * https://github.com/xiaokaike/vue-color
   * Rich Text Editor
   * https://tiptap.dev/menu-bubble
   */
  name: "DragTextPanel",
  components: {Sketch},
  props: {
    panelType: {
      type: String,
      default: ''
    },
    screenText: {
      type: Object,
      default() {
        return {}
        /* text: '',
           location: {top: 0, left: 0},
           color: '' */
      }
    }
  },
  data() {
    return {
      type: 'txt',
      txtLocation: {top: 0, left: 0},
      showPalette: false,// color picker
      colors: {
        hex: '#000000',// default
        rgba: {r: 0, g: 0, b: 0, a: 1},
        a: 1// alpha
      }
    }
  },
  mounted() {
    /**
     * Set initial position and size for screenText
     * transform: translate(19px, 27px);
     * Set global txtLocation
     */// this.$nextTick(function () {});
    console.log('mounted: type:', this.$attrs.id, this.type, 'panelType:', this.panelType);
    console.log('Drag Text Panel _uid:', this._uid, '$attrs:', this.$attrs);// id:"txt"
    // console.log('column-right:', document.querySelector('.panel-column-right').getClientRects());

    document.querySelector('#txt').style.transform = 'translate(' + this.screenText.location.left + 'px,' + this.screenText.location.top + 'px)';
    Object.assign(this.txtLocation, this.screenText.location);
    // console.log('txt location:', this.txtLocation);

    this.initInteract();
  },
  watch: {
    // drag-panel transform bound to txtLocation
    screenText: function (newData, oldData) {
      // console.log('txt data changed:', newData.location.left, newData.location.top, newData.location.width, newData.location.height);
      // document.querySelector('#txt').style.transform = 'translate('+newData.location.left+'px,' + newData.location.top+'px)';
      Object.assign(this.txtLocation, newData.location);
    }
  },
  methods: {
    /**
     * Color Picker
     * https://github.com/xiaokaike/vue-color
     */
    openTextColor: function () {
      this.showPalette = !this.showPalette;
    },
    changeTextColor: function (color) {
      // this.showPalette = false;// sliders in picker
      // console.log('changeTextColor:', color);
      // faked: only one is in a div
      document.querySelector('div.screen-text').style.color = color.hex;
    },
    /**
     * InteractJs
     */
    initInteract: function () {
      const comp = this;
      Interact('.drag-text').draggable({
        modifiers: [
          Interact.modifiers.restrictRect({
            restriction: 'parent'
          })
        ],
        listeners: {
          // start: function(event) {
          // console.log(event.type, event.target.id);//, event.x0, event.y0, event.dx, event.dy);
          // console.log('clientRects:', document.querySelector('#txt').getClientRects());
          // console.log('column-right:', document.querySelector('.panel-column-right').getClientRects());
          // },
          move: function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (!comp.showPalette) {
              comp.txtLocation.left += event.dx;
              comp.txtLocation.top += event.dy;
              // event.target.style.transform = `translate(${comp.txtLocation.left}px, ${comp.txtLocation.top}px)`;
            }
          },
          end: function (e) {
            comp.$emit('updateLocation', comp.txtLocation, comp.type);
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.drag-text {
  position: absolute;
  min-width: 125px;
  border-radius: 10px;
  border: 1px solid #d3d3d3;
  -ms-touch-action: none;
  touch-action: none;
}

.drag-panel-header {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #666666;
  padding: 3px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #d3d3d3;
}

.screen-text {
  padding: 5px;
}

#text-color-palette {
  position: absolute;
  left: 130px;
}

.palette-icon {
  font-size: 14px;
  cursor: pointer;
  color: #333333;
}

.stats-panel {
  position: absolute;
  bottom: -20px;
  width: 98%;
  padding: 2%;
  font-size: 12px;
  font-weight: 600;
}
</style>
