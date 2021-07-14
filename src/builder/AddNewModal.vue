<template>
  <div class="addnew-modal">
    <div class="addnew-panel"
      v-bind:style="dialogStyle"
    >
      <div class="addnew-header">
        <span class="addnew-title"
            v-text="headerText"
        ></span>
        <span class="close-button"
          @click="$emit('closeModal')"
        >
          <icon-close/>
        </span>
      </div>
      <div class="addnew-body" ref="addnewBody">
        <!-- Add new interaction type, emit obj upward -->
        <div class="addnew-instructions">
          <div class="row">
            <select v-model="selected"
              @change="typeSelected(selected)"
            >
              <option disabled value="">Select an interaction type</option>
              <option 
                v-for="(type, index) in types"
                :key="index"
                :value="type"
              >
                <span v-text="type"></span>
              </option>
            </select>
          </div>
          <div class="row">
            <p>Select an interaction type, it will be added at the current time. {time}</p>
          </div>
          <div class="row">
            <span class="smaller">Selected: {{ selected }}</span>
          </div>
        </div>
      </div>
      <div class="addnew-footer">
        <div class="addnew-footer-buttons">
          <button role="button" class="icon-button"
            title="Click to add new element"
            @click="$emit('addNew', selectedObj); $emit('closeModal')"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * dropdown of interaction types
 * emit selectedObj upward, then add start:currenttime, index
 */

// import Interact from 'interactjs';
// import Vue from 'vue';

	export default {
		name: 'AddNewModal',
		props: {
			dialogStyle: {
				type: Object,
				default() {
          return {}
        }
			},
      // currentData: {
      //   type: [Object, Array]
      // }
		},
    data () {
        return {
          addnewBodyContent: 'change me',// construct form
          updatedData: 'new object to return',
          mcInstance: null,
          headerText: 'Add New Interaction',
          selected: '',// type
          types: ['Title Screen', 'Animated Message', 'Multiple Choice Question', 'Multiple Answer Question', 'Image Button', 'Custom'],
          // object for each type
          selectedObj: {"type":"fake type"}
        }
    },
    // mounted () {
    //   this.$nextTick(function() {});
    // },
    methods: {
      typeSelected: function(type) {
        console.log('typeSelected:', type);
        // set object data
      }
    }
	}
</script>

<style scoped>
  .addnew-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
	.addnew-panel {
		position: absolute;
    top: 3vh;
		left: 5%;
		width: 20%;
    padding: 0;
		font-size: 16px;
		color: #000000;
		text-align: center;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: rgba(255, 255, 255, 1);
	}
	.addnew-header {
		font-weight: 600;
		padding: 8px 5px;
		border-bottom: 2px solid #888888;
	}
	.addnew-title {
		width: 85%;
	}
	.close-button {
    cursor: pointer;
		float: right;
		font-size: 27px;
    margin-top: -5px;
	}
	.addnew-body {
		padding: 10px;
	}
  /* .addnew-instructions {
    border: 1px solid #333333;
  } */
  .row {
    width: 100%;
    padding-bottom: 10px;
  }
  .row, select {
    font-size: 16px;
  }
  .smaller {
    padding: 8px;
    border: 1px solid #333333;
  }
  .addnew-footer {
    padding-bottom: 10px;
    /* border-top: 2px solid #888888; */
  }
  /* .addnew-footer-buttons {
    float: right;
  } */

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
