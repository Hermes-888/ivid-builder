<template>
  <div class="editor-modal">
    <div class="modal-elements" v-show="modalElements"></div>
    <div class="editor-panel" ref="editorPanel"
      v-bind:style="editorStyle"
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
      <div class="editor-body" ref="editorBody">
        <!-- Dynamic Content @watch currentData -->
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
import Vue from 'vue';

	export default {
		name: 'EditorModal',
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
          editorBody: null,
          mcInstance: null,
          modalElements: false,
          headerText: 'editor header',
          panelTop: 0
        }
    },
    mounted () {
      this.$nextTick(function() {
        var comp = this;
        // find editorBody
        this.editorBody = this.$refs.editorBody;

        this.$root.$on('repoImageSelected', function(filename) {
          console.log('instance:', comp.mcInstance.$options.name, 'EditorModal repo:', filename);

          if (comp.mcInstance.$options.name === 'FormIntroduction') {
            comp.currentData.image = filename;
            comp.mcInstance.updatedData.image = filename;
            document.querySelector('.introduction').style.backgroundImage = "url('" + filename + "')";
          }
          if (comp.mcInstance.$options.name === 'FormScene') {
            console.log('repoImageSelected Scene:', filename);
          }
        });

        // editor-panel is draggable, only if mouse is over editor-header
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
                // console.log(e.page.y, comp.panel);
              },
              // every dragmove event
              move(event) {
                if (event.page.y < comp.panelTop+30) {
                  var target = event.target;
                  // keep the dragged position in the data-x/data-y attributes
                  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

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
          });
      });
    },
    watch: {
      /**
       * set editorBody content when data is received
       */
      currentData: {
        immediate: true,
        handler(newstate, oldstate) {
          var comp = this;
          console.log('-- watch editor currentData:', this.currentData, Array.isArray(newstate));
          console.log('mcInstance:', comp.mcInstance, 'editorBody:', comp.editorBody, comp.$refs.editorBody);
          if (!newstate) { return; }

          if (!comp.editorBody) {
            comp.editorBody = document.querySelector('.editor-body');//comp.$refs.editorBody;
            console.log('FIND editorBody', comp.editorBody);
          }

          if (newstate.hasOwnProperty('titleText') && comp.editorBody) {
            this.headerText = 'Introduction Data';
            var mcClass = Vue.extend(FormIntroduction);
						this.mcInstance = new mcClass({
							propsData: {
								formData: comp.currentData
							}
						});
            this.mcInstance.$mount();

            this.modalElements = false;
            // this.editorBody.innerHTML = '';
            this.editorBody.appendChild(this.mcInstance.$el);

            this.mcInstance.$on('saveChanges', function(data) {
              console.log('Editor Intro saveChanges:', data);
              // comp.$emit('closeModal');
              comp.$emit('saveChanges', data);
            });
          }

          if (Array.isArray(newstate) && comp.editorBody) {
            this.headerText = 'Scene Data';
            // sceneData Array of scenes w/cueData
            var mcClass = Vue.extend(FormScene);
						this.mcInstance = new mcClass({
							propsData: {
								formData: comp.currentData
							}
						});
            console.log('Editor instance:', this.mcInstance);
            this.mcInstance.$mount();

            this.modalElements = true;
            // this.editorBody.innerHTML = '';
            this.editorBody.appendChild(this.mcInstance.$el);
            this.mcInstance.$on('saveChanges', function(data) {
              console.log('Editor Scene saveChanges:', data);//   do both hear this too?
              // comp.$emit('closeModal');
              comp.$emit('saveChanges', data);// inform Builder
            });
          }

          if (this.mcInstance) {
            this.mcInstance.formData = this.currentData;// didn't update
            // if (this.mcInstance.name === 'FormIntroduction') {
            //   document.querySelector('.modal-elements').style.display = 'none';
            // }
            // pass Form @click="$emit('toggleRepo')" up to Builder
            this.mcInstance.$on('toggleRepo', function() {
              comp.$emit('toggleRepo');// send state: true/false?
            });
          }
        }
      },
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
    top: 5vh;
		left: 33%;
		width: 33%;
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
		padding: 10px;
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
