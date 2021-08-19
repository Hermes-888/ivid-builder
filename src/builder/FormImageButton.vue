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
          <label for="imagePath" title="Image for button.">Image:</label>
          <input id="imagePath" class="input-long"
            v-model="updatedData.imagePath"
            @change="changeBkgImage"
          >
        </div>
        <div class="form-row">
          <!-- location -->
          <div class="loc-prop"
            v-for="(value, propName) in updatedData.location"
            :key="propName"
          >
            <span v-text="propName"></span>
            <span>: </span>
            <span v-text="value"></span>
            <span> | </span>
          </div>
        </div>
        <!-- <div class="form-row">
          <div class="column-half">
            <label for="bkgColor"
              title="Image background color can have opacity. Click the color swatch to change the color">
              Background Color:
            </label>
            <div class="color-swatch" id="bkgColor"
              ref="bkgcolor" title="Click to open a color picker, click again to close it"
              @click="showPalette('bkgColor')"
            ></div>
          </div>
        </div>
        <color-picker id="bkgClose"
          v-if="showBkgPalette"
          :color="updatedData.backgroundColor"
          @changed="changeBkgColor"
          @close="showPalette('bkgClose')"
        /> -->
    </div>
</template>

<script>
// import ColorPicker from './ColorPicker.vue';
import Interact from 'interactjs';

export default {
    name: "FormImageButton",
    // components: {ColorPicker},
    props: {
        formData: {
            type: Object,
            default() {
                return {}
            }
        },
        repoImage: {
          type: String,
          default: ''
        }
    },
    data () {
        return {
            updatedData: [{
              "start": 0,
              "type": "ImageButton",
              "useOverlay": false,
              "animateIn": false,
              "animateOut": false,
              "pauseVideo": true,
              "resumePlayback": true,
              "branchTo": 0,
              "imagePath": "",
              "location": {
                "top": 0,
                "left": 0,
                "width": 223,
                "height": 154
              }
            }],// .index is added in FormScene
            element: null,
            showBkgPalette: false
        }
    },
    mounted () {
      this.updatedData = JSON.parse(JSON.stringify(this.formData));
      console.log('ImageButton:', this.updatedData.type, this.updatedData.index);

      // const comp = this;
      // this.$root.$on('repoImageSelected', function(filename) {
      //   console.log('repoImageSelected ImageButton:', filename);
      //   if (comp.element) {
      //     comp.updatedData.imagePath = filename;
      //     comp.element.classList.remove('bordered');
      //     comp.element.innerHTML = '';
      //     comp.element.style.backgroundImage = "url('" + filename + "')";
      //   }
      // });

      this.$nextTick(function() {
        // console.log('target:', document.querySelectorAll('[data-type="ImageButton"]'));
        // find the dom element constructed in FormScene
        // drag and resize to set location
        this.element = document.querySelector('.modal-elements').querySelector('[data-type="ImageButton"]');
        // console.log('IBtn:', this.element);
        const comp = this;
        Interact('[data-type="ImageButton"]').draggable({
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
              console.log('ImageButton drag end:', event);
              // set location? use builder/DrageImagePanel?
              let index = parseInt(event.target.getAttribute('data-index'));
              let bounds = event.target.getBoundingClientRect();
              comp.updatedData.location.left = bounds.x;
              comp.updatedData.location.top = bounds.y;// - toolbar?
              comp.updatedData.location.width = bounds.width;
              comp.updatedData.location.height = bounds.height;
              console.log('updatedData:', index, bounds, comp.updatedData);
            }
          }
        })
        // .styleCursor(false)
        .resizable({
          edges: {top: true, left: true, bottom: true, right: true},
          listeners: {
            move(event) {
              event.preventDefault();
              event.stopPropagation();

              Object.assign(event.target.style, {
                width: `${event.rect.width}px`
              });
            },
            end(event) {
              // set location.width/height? use builder/DrageImagePanel?
              let index = parseInt(event.target.getAttribute('data-index'));
              let bounds = event.target.getBoundingClientRect();
              comp.updatedData.location.left = bounds.x;
              comp.updatedData.location.top = bounds.y;// - toolbar?
              comp.updatedData.location.width = bounds.width;
              comp.updatedData.location.height = bounds.height;
              console.log('updatedData:', index, bounds, comp.updatedData);
            }
          }
        });
      });
    },
    watch: {
      repoImage: {
        immediate: true,
        handler(newstate, oldstate) {
          console.log('-- watch reopImage', newstate);
          if (newstate !== oldstate) {
            this.updatedData.imagePath = newstate;
          }
        }
      }
    },
    methods: {
      // @keypress="isNumber($event)"
      isNumber (evt) {
        const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
        if (!keysAllowed.includes(evt.key)) {
          evt.preventDefault();
        }
      },
      uploadFile: function(type) {
        // console.log('upload', type);
        switch(type) {
          // case 'audio':
          //   // updatedData.audio
          //   break;
          case 'image':
            // updatedData.image
            break;
        }
      },
      findFile: function(type) {
        // console.log('find', type);
        switch(type) {
          // case 'audio':
          //   // RepoPanel tabs: 0=Sounds, 1=Videos, 2=Images
          //   // {tab:#, state:true=open it}
          //   this.$emit('toggleRepo', {tab:0, state:true});
          //   break;
          case 'image':
            // updatedData.imagePath
            this.$emit('toggleRepo', {tab:2, state:true});
            break;
        }
      },
      changeBkgImage: function (image) {
        console.log('changeBkgImage:', image);
        this.updatedData.imagePath = image;
        this.element.style.backgroundImage = "url('" + this.updatedData.imagePath + "')";
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
      },
      changeBkgColor: function (color) {
        this.updatedData.backgroundColor = color.hex8;// .rgba is an object, reconstruct as string?
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
      width: 65%;
    }
    .loc-prop {
      margin: 0 10px 0 5px;
      /* margin-right: 10px; */
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
