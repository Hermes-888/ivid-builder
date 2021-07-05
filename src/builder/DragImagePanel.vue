<template>
  <div class="drag-image"
    :style="{
      transform: 'translate('+imgLocation.left+'px,'+imgLocation.top+'px)'
    }"
  >
    <div class="drag-panel-header">
      {{ panelType }}
    </div>
    <div v-if="imageData.url">
      <img class="image-item resize-image" alt="img"
        :src="imageData.url"
        :style="{
          width: imgLocation.width+'px',
          height: imgLocation.height+'px'
        }"
      />
      <div class="stats-panel">
        <div>top: {{ imgLocation.top }}, left: {{ imgLocation.left }}, width: {{ imgLocation.width }}, height: {{ imgLocation.height }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Interact from 'interactjs';

export default {
  /**
   * https://interactjs.io/docs/installation
   * Draggable Resizable panel instance for
   * Image or ScreenText
   * Color Picker:
   * https://github.com/xiaokaike/vue-color
   */
  name: "DragImagePanel",
  props: {
    panelType: {
      type: String,
      default: ''
    },
    imageData: {
      type: Object,
      default() {
        return {}
        /* url: 'images/sampleImg.jpg',
           location: {'top': 0, 'left': 0, 'width': 360, 'height': 180} */
      }
    }
  },
  data() {
    return {
      type: 'img',
      imgLocation: {top: 0, left: 0, width: 0, height: 0},
    }
  },
  mounted() {
    /**
     * Set initial position and size for image
     * transform: translate(19px, 27px);
     * set global imgLocation
     */
    console.log('mounted: type:', this.$attrs.id, this.type, 'panelType:', this.panelType);
    console.log('Drag Image Panel _uid:', this._uid, '$attrs:', this.$attrs);// id:"img"
    // console.log('column-right:', document.querySelector('.panel-column-right').getClientRects());

    // if (this.$attrs.id === 'img') {
    // console.log('look for',document.querySelector('.image-item'));
    document.querySelector('#img').style.transform = 'translate(' + this.imageData.location.left + 'px,' + this.imageData.location.top + 'px)';
    Object.assign(this.imgLocation, this.imageData.location);
    // console.log('img location:', this.imgLocation);
    // }

    this.initInteract();
  },
  watch: {
    // drag-panel transform, img width, height are bound to imgLocation
    imageData: function (newData, oldData) {
      // console.log('img data changed:', newData.location.left, newData.location.top, newData.location.width, newData.location.height);

      // document.querySelector('#img').style.transform = 'translate('+newData.location.left+'px,' + newData.location.top+'px)';
      Object.assign(this.imgLocation, newData.location);
      // console.log('column-right:', document.querySelector('.panel-column-right').getClientRects());
      // Interact.modifiers.restrictRect(document.querySelector('.panel-column-right').getClientRects());
    }
  },
  methods: {
    /**
     * InteractJs .draggable, .resizable
     */
    initInteract: function () {
      const comp = this;
      Interact('.drag-image').draggable({
        modifiers: [
          Interact.modifiers.restrictRect({
            // restriction: document.querySelector('.panel-column-right')
            restriction: 'parent'
          })
        ],
        listeners: {
          // start: function(event) {
          // console.log(event.type, event.x0, event.y0, event.dx, event.dy, event);//, event.target);
          // console.log('clientRects:', document.querySelector('#img').getClientRects());
          // console.log('column-right:', document.querySelector('.panel-column-right').getClientRects());
          // },
          move: function (event) {
            event.preventDefault();
            event.stopPropagation();

            comp.imgLocation.left += event.dx;
            comp.imgLocation.top += event.dy;
            // event.target.style.transform = `translate(${comp.imgLocation.left}px, ${comp.imgLocation.top}px)`;
          },
          end: function (e) {
            comp.$emit('updateLocation', comp.imgLocation, comp.type);
          }
        }
      });
      // Note: only the image is resizable
      Interact('.resize-image').resizable({
        edges: {top: true, left: true, bottom: true, right: true},
        modifiers: [
          Interact.modifiers.restrictSize({
            min: {width: 100, height: 100},
            max: {width: 800, height: 450},
          })
        ],
        listeners: {
          move: function (event) {
            event.preventDefault();
            event.stopPropagation();

            // Object.assign(event.target.style, {
            //   width: `${event.rect.width}px`,
            //   height: `${event.rect.height}px`,// transform: `translate(${x}px, ${y}px)`
            // });
            comp.imgLocation.width = parseInt(event.rect.width - 2);
            comp.imgLocation.height = parseInt(event.rect.height);// - 26);
          },
          end: function (e) {
            // console.log('resize end:', e.rect);
            comp.$emit('updateLocation', comp.imgLocation, comp.type);
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.drag-image {
  position: absolute;
  min-width: 90px;
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

.image-item {
  box-sizing: border-box;
  /*max-width: 98%;*/
  /*max-height: 98%;*/
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
