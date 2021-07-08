<template>
  <div class="dialog-modal">
    <div class="dialog-panel"
      v-bind:style="dialogStyle"
    >
      <div class="dialog-header">
        <span class="dialog-title"
            v-text="dialogHeader"
        ></span>
        <span class="close-btn"
          title="Cancel and close modal"
          @click="$emit('closeModal')"
        >X</span>
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
 * dialog header and body can contain HTML
 * construct form from keys? or instance forms for each type of content
 */
import FormIntroduction from './FormIntroduction.vue';
import FormScene from './FormScene.vue';
import Vue from 'vue';

	export default {
		name: 'DialogModal',
		props: {
			dialogHeader	: {
				type: String,
				default: ''
			},
			// dialogBody: {
			// 	type: String,
			// 	default: ''
			// },
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
          mcInstance: null
        }
    },
    // mounted () {
    //   this.$nextTick(function() {});
    // },
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
              console.log('Modal saveChanges:', data);
              comp.$emit('closeModal');
              comp.$emit('saveChanges', data);
            });
          }

          if (Array.isArray(newstate) && this.$refs.dialogBody) {
            // sceneData or cueData
            // this.$refs.dialogBody.innerHTML = '';
            // this.$refs.dialogBody.innerText = JSON.stringify(this.currentData);
            // Array of scenes w/cueData
            var mcClass = Vue.extend(FormScene);
            // addInstance(mcClass);// ???
						this.mcInstance = new mcClass({
							propsData: {
								formData: this.currentData
							}
						});
            this.mcInstance.$mount();

            this.$refs.dialogBody.innerHTML = '';
            this.$refs.dialogBody.appendChild(this.mcInstance.$el);
            this.mcInstance.$on('updateChanges', function(data) {
              console.log('Modal saveChanges:', data);
              comp.$emit('closeModal');
              comp.$emit('saveChanges', data);
            });
            // cueData[] - tabs to select which cue?
          }
        }
      },
    },
    methods: {}
	}
</script>

<style scoped>
  .dialog-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
  }
	.dialog-panel {
		position: absolute;
    top: 15vh;
		left: 25%;
		width: 50%;
    padding: 10px;
		font-size: 18px;
		color: #000000;
		text-align: left;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: #ffffff;
		/* user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none; */
	}
	.dialog-header {
		font-weight: 600;
		padding: 5px;
		border-bottom: 2px solid #888888;
	}
	.dialog-title {
		width: 85%;
	}
	.close-btn {
    cursor: pointer;
		width: 18px;
		float: right;
		text-align: center;
		font-size: 16px;
		border-radius: 50%;
		border: 1px solid #333333;
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
