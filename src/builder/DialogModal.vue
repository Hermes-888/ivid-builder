<template>
  <div class="dialog-modal" id="droptarget">
    <div class="dialog-panel" ref="dialogPanel"
      v-bind:style="dialogStyle"
    >
      <div class="dialog-header" ref="draggable"
        draggable="true"
      >
        <span class="dialog-title"
            v-text="dialogHeader"
        ></span>
        <!-- <span class="close-btn"
          title="Cancel and close modal"
          @click="$emit('closeModal')"
        >X</span> -->
        <div
          class="close-button"
          @click="$emit('closeModal')"
        >
          <icon-close/>
        </div>
      </div>
      <div class="dialog-body" ref="dialogBody">
        <!-- <span v-text="dialogBodyContent"></span> -->
      </div>
      <!-- <div class="dialog-footer">
        <div class="dialog-footer-buttons">
          <button role="button" class="icon-button"
            title="Save changes"
            @click="$emit('saveChanges',updatedData)"
          >
            Save Changes <icon-save-file/>
          </button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
/**
 * dialog header can drag dialog-panel
 * instance forms for Introduction and Scene data
 * FormScene adds tabs for each interaction
 */
import FormIntroduction from './FormIntroduction.vue';
import FormScene from './FormScene.vue';
import Vue from 'vue';

// ToDo: use interact to drag dialog-panel
//import Interact from 

	export default {
		name: 'DialogModal',
		props: {
			dialogHeader	: {
				type: String,
				default: ''
			},
			dialogStyle: {
				type: Object,
				default() {
          return {}
        }
			},
      currentData: {
        type: [Object, Array]
      }
		},
    // watch currentData, construct form from keys?
    data () {
        return {
          dialogBodyContent: 'change me',// construct form
          updatedData: 'new object to return',
          mcInstance: null,
          panel: null,// dialog-panel
          isDragging: false,
        }
    },
    mounted () {
      this.$nextTick(function() {
        // dialog header can drag dialog-panel
        // use Interact instead
        var comp = this;
        this.panel = this.$refs.dialogPanel;
        // console.log('panel:', this.panel.style);
        // Interact('.dialog-header')
        //   .draggable({
        //     // enable inertial throwing
        //     inertia: true,
        //     // keep the element within the area of it's parent
        //     modifiers: [
        //       interact.modifiers.restrictRect({
        //         restriction: 'parent',
        //         //endOnly: true
        //       })
        //     ],
        //     // enable autoScroll
        //     autoScroll: false,

        //     listeners: {
        //       // call this function on every dragmove event
        //       move(event) {
        //         var target = event.target
        //         // keep the dragged position in the data-x/data-y attributes
        //         var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        //         var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        //         // translate the element
        //         target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

        //         // update the posiion attributes
        //         target.setAttribute('data-x', x)
        //         target.setAttribute('data-y', y)
        //       },

        //       // call this function on every dragend event
        //       end (event) {
        //         console.log('drag end');
        //       }
        //     }
        //   });
      });
    },
    watch: {
      /**
       * set dialogBody content when data is ready
       */
      currentData: {
        immediate: true,
        handler(newstate, oldstate) {
          var comp = this;
          console.log('-- watch Dialog currentData:', this.currentData);
          if (!newstate) { return; }

          if (newstate.hasOwnProperty('titleText') && this.$refs.dialogBody) {
            var mcClass = Vue.extend(FormIntroduction);
						this.mcInstance = new mcClass({
							propsData: {
								formData: this.currentData
							}
						});
            this.mcInstance.$mount();

            this.$refs.dialogBody.innerHTML = '';
            this.$refs.dialogBody.appendChild(this.mcInstance.$el);
            this.mcInstance.$on('updateChanges', function(data) {
              console.log('Modal Intro saveChanges:', data);
              comp.$emit('closeModal');
              comp.$emit('saveChanges', data);
            });
          }

          if (Array.isArray(newstate) && this.$refs.dialogBody) {
            // sceneData Array of scenes w/cueData
            var mcClass = Vue.extend(FormScene);
						this.mcInstance = new mcClass({
							propsData: {
								formData: this.currentData
							}
						});
            this.mcInstance.$mount();

            this.$refs.dialogBody.innerHTML = '';
            this.$refs.dialogBody.appendChild(this.mcInstance.$el);
            this.mcInstance.$on('updateChanges', function(data) {
              console.log('Modal Scene saveChanges:', data);
              comp.$emit('closeModal');
              comp.$emit('saveChanges', data);
            });
          }
        }
      },
    },
    // methods: { }
	}
</script>

<style scoped>
  .dialog-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
  }
	.dialog-panel {
		position: absolute;
    top: 5vh;
		left: 1%;
		width: 33%;
    padding: 0;
		font-size: 18px;
		color: #000000;
		text-align: left;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: rgba(255, 255, 255, 0.6);
		/* user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none; */
	}
	.dialog-header {
		font-weight: 600;
		padding: 5px;
    cursor: move;
		border-bottom: 2px solid #888888;
	}
	.dialog-title {
		width: 85%;
	}
	.close-button {
    cursor: pointer;
		float: right;
		font-size: 27px;
    margin-top: -5px;
	}
	.dialog-body {
		padding: 10px;
	}
  .dialog-footer {
    width: 100%;
    padding-top: 10px;
    border-top: 2px solid #888888;
  }
  .dialog-footer-buttons {
    float: right;
  }

  .icon-button {
    margin: 0 auto;
    padding: 0 8px;
    cursor: pointer;
    font-size: 18px;
    color: #333333;
    border-radius: 2px;
    border: 1px solid  #000000;
    background-color: #efefef;
  }
  .icon-button:hover {
    background-color: #ccf1cc;
  }
</style>
