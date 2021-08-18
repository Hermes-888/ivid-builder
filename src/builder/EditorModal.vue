<template>
  <div class="editor-modal">
    <div class="modal-elements"
      ref="modalElements"
      v-show="sceneVisible"
    >
    </div>
    <div class="editor-panel" ref="editorPanel"
      :style="editorStyle"
    >
      <div class="editor-header">
        <span class="editor-title"
            v-text="headerText"
        ></span>
        <span class="close-button"
          @click="$emit('closeModal')"
        >
          <icon-close/>
        </span>
      </div>
      <div class="editor-body">
        <form-introduction
          v-if="!sceneVisible && currentData"
          :formData="currentData"
          :key="currentKey"
          @saveChanges="saveChanges"
          @toggleRepo="toggleRepoPanel"
        />
        <form-scene
          v-if="sceneVisible && currentData"
          :formData="currentData"
          :key="currentKey"
          @saveChanges="saveChanges"
          @toggleRepo="toggleRepoPanel"
        />
      </div>
      <!-- <div class="editor-footer">
        <div class="editor-footer-buttons">
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
 * instance Forms for Introduction and Scene data
 * FormScene adds tabs for each interaction Form
 * editor-panel is draggable
 */
import FormIntroduction from './FormIntroduction.vue';
import FormScene from './FormScene.vue';

import Interact from 'interactjs';
// import Vue from 'vue';

	export default {
		name: 'EditorModal',
    components: {
      FormIntroduction,
      FormScene
    },
		props: {
			editorStyle: {
				type: Object,
				default() {
          return {}
        }
			},
      currentData: {
        type: [Object, Array]
      }
		},
    data () {
        return {
          currentKey: 0,// update data
          sceneVisible: false,// toggle Intro or Scene
          headerText: 'editor header',
          panelTop: 0,
          canDrag: false
        }
    },
    mounted () {
      this.$nextTick(function() {
        var comp = this;

        // ToDo: add listener to Forms that need use the repository
        // this.$root.$on('repoImageSelected', function(filename) {
        //   if (comp.sceneVisible) {
        //     console.log('repoImageSelected Scene:', filename);
        //   } else {
        //     console.log('repoImageSelected Intro:', filename);
        //     comp.currentData.image = filename;
        //     // document.querySelector('.introduction').style.backgroundImage = "url('" + filename + "')";
        //     // comp.currentKey += 1;// rerender children w/new data
        //   }
        // });

        // editor-panel is draggable, only if mouse is over editor-header
        // https://interactjs.io/
        Interact('.editor-panel')
          .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            modifiers: [
              Interact.modifiers.restrictRect({
                restriction: 'parent'
              })
            ],

            listeners: {
              start(e) {
                comp.panelTop = comp.$refs.editorPanel.getBoundingClientRect().y;
                // interact('#specificElement').draggable(false);
                comp.canDrag = (e.page.y < comp.panelTop+35) ? true : false;
              },
              // every dragmove event
              move(event) {
                if (comp.canDrag) {
                  var target = event.target;
                  // keep the dragged position in the data-x/data-y attributes
                  var x = (parseInt(target.getAttribute('data-x')) || 0) + event.dx;
                  var y = (parseInt(target.getAttribute('data-y')) || 0) + event.dy;

                  // translate the element
                  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                  // update the posiion attributes
                  target.setAttribute('data-x', x);
                  target.setAttribute('data-y', y);
                  comp.panelTop = comp.$refs.editorPanel.getBoundingClientRect().y;
                }
              },
              // call this function on every dragend event
              // end (event) {
              //   console.log('drag end');
              // }
            }
          })
          // .styleCursor(false)
          .resizable({
            edges: {top: false, left: true, bottom: false, right: true},
            listeners: {
              move(event) {
                event.preventDefault();
                event.stopPropagation();

                Object.assign(event.target.style, {
                  width: `${event.rect.width}px`
                });
              }
            }
          });
      });
    },
    watch: {
      /**
       * When data changes,
       * set modal headerText
       * sceneVisible switchs between FormScene & FormIntroduction
       */
      currentData: {
        immediate: true,
        handler(newstate, oldstate) {
          // console.log('-- watch editor currentData:', this.currentData, Array.isArray(newstate));
          if (!newstate) { return; }

          this.sceneVisible = Array.isArray(newstate);
          this.headerText = this.sceneVisible ? 'Edit Scene Data' : 'Edit Introduction Data';
          // adjust icons
          document.querySelector('.toolbar-header').style.justifyContent = this.sceneVisible ? 'space-around' : 'flex-start';
        }
      },
    },
    methods: {
      toggleRepoPanel(tab) {
        // upward to Builder
        this.$emit('toggleRepo', tab);
      },
      saveChanges: function(data) {
        console.log('saveChanges:', data);
        // this.$emit('closeModal');
        this.$emit('saveChanges', data);
      }
    }
	}
</script>

<style scoped>
  .editor-modal {
    position: absolute;
    top: 35px;
    left: 0;
    width: 100vw;
    height: 96vh;
    /* background-color: rgba(0, 0, 0, 0.4); */
  }
	.editor-panel {
		position: absolute;
    z-index: 10;
    top: 0;
		left: 0;
		min-width: 450px;
    max-width: 50%;
    padding: 0;
		font-size: 18px;
		color: #000000;
		text-align: left;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: rgba(255, 255, 255, 0.6);
	}
	.editor-header {
		font-weight: 600;
    margin-left: 10px;
		padding: 5px;
    cursor: move;
		border-bottom: 2px solid #888888;
	}
	.editor-title {
		width: 85%;
	}
	.close-button {
    cursor: pointer;
		float: right;
		font-size: 27px;
    margin-top: -5px;
	}
	.editor-body {
		padding: 5px;
	}
  .editor-footer {
    width: 100%;
    padding-top: 10px;
    border-top: 2px solid #888888;
  }
  .editor-footer-buttons {
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
