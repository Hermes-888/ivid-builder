<template>
  <div class="dialog-modal">
    <div class="dialog-panel"
      v-bind:style="dialogStyle"
    >
      <div class="dialog-header">
        <span class="dialog-title"
            v-html="dialogHeader"
        ></span>
        <span class="close-btn"
          title="Cancel and close modal"
          @click="$emit('closeModal')"
        >X</span>
      </div>
      <div class="dialog-body">
        <span v-html="dialogBody"></span>
      </div>
      <div class="dialog-footer">
        <div class="dialog-footer-buttons">
          <button role="button" class="icon-button"
            title="Save changes"
            @click="$emit('saveChanges')"
          >
            Save Changes <icon-save-file/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * dialog header and body can contain HTML
 */
	export default {
		name: 'DialogModal',
		props: {
			dialogHeader	: {
				type: String,
				default: ''
			},
			dialogBody: {
				type: String,
				default: ''
			},
			dialogStyle: {
				type: Object,
				default() {}
			},
      // currentData for modal content
      currentData: {
        type: Object,
				default() {}
      }
		},
    // watch currentData, construct form from keys?
    data () {
        return {
          dialogBodyContent: ''// construct form
        }
    },
    //mounted () {},
    methods: {}
	}
</script>

<style scoped>
  .dialog-modal {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
  }
	.dialog-panel {
		position: absolute;
    top: 15vh;
		left: 25%;
		width: 50%;
		color: #000000;
		text-align: left;
		padding: 10px;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: #ffffff;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
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
		width: 20px;
		float: right;
		text-align: center;
		font-size: smaller;
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
