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
          <div class="row"
            v-show="!selected"
          >
            <p>Select an interaction type, it will be added at the current time.</p>
          </div>
          
        </div>
      </div>
      <div class="addnew-footer">
        <div class="addnew-footer-buttons"
          v-show="selected"
        >
          <div class="row">
            <span>Selected: </span>
            <span v-text="selected"></span>
          </div>
          <button role="button" class="icon-button"
            title="Click to add new element"
            @click="$emit('addNew',selectedObj); $emit('closeModal'); selected='';"
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

	export default {
		name: 'AddNewModal',
		props: {
			dialogStyle: {
				type: Object,
				default() {
          return {}
        }
			}
		},
    data () {
        return {
          headerText: 'Add New Interaction',
          selected: '',// type
          types: ['Title Screen', 'Animated Message', 'Information Panel', 'Multiple Choice Question', 'Multiple Answer Question', 'Image Button', 'Drag Image to Dropzone'],
          // $emit addNew w/ object for each type
          selectedObj: {"type":"fakeType"}
        }
    },
    methods: {
      typeSelected: function(type) {
        console.log('typeSelected:', type);
        this.selectedObj = {"type":"fakeType"};
        // set selectedObj data
        switch (type) {
          case 'Animated Message':
            this.selectedObj = {
							"start": 0,
							"type": "AnimatedMessage",
							"useBlur": false,
							"useOverlay": false,
							"animateIn": true,
							"animateOut": true,
							"animateTo": "35%",
							"pauseVideo": false,
							"resumePlayback": true,
							"removeMessage": true,
							"messageText": "Your Message",
							"duration": 1.5,
							"backgroundColor": "#ffffffCC",
							"textColor": "#333333",
							"panelWidth": "33%"
						};
            break;
          case 'Information Panel':
            this.selectedObj = {
							"start": 0,
							"type": "InfoPanel",
							"useBlur": true,
							"useOverlay": false,
							"animateIn": true,
							"animateOut": true,
							"animateTo": "25%",
							"pauseVideo": true,
							"resumePlayback": true,
							"panelWidth": "40%",
							"panelBkgColor": "rgba(0,0,0, 0.2)",
							"infoTitle": "Title",
							"titleColor": "#ffffff",
							"infoText": "Your information to display.",
							"buttonText": "Continue"
						};
            break;
          case 'Multiple Choice Question':
            this.selectedObj = {
							"start": 0,
							"type": "MultipleChoice",
							"useBlur": true,
							"useOverlay": false,
							"animateIn": true,
							"animateOut": true,
							"animateTo": "25%",
							"pauseVideo": true,
							"resumePlayback": true,
							"questionText": "Question",
							"questionAudio": "",
							"questionInstructions": "Choose an answer.",
							"backgroundColor": "#ffffffB8",
							"hintButtonText": "Hint?",
							"hintButtonTextColor": "",
							"hintButtonBackgroundColor": "",
							"hintText": "Hint text",
							"hintAudio": "",
							"randomizeAnswers": false,
							"answers": [
								{
									"id": 0,
									"correct": true,
									"answerText": "Correct Answer",
									"answerAudio": "",
									"feedbackText": "Correct feedback",
									"feedbackAudio": ""
								},
								{
									"id": 1,
									"correct": false,
									"answerText": "Wrong Answer",
									"answerAudio": "",
									"feedbackText": "Wrong feedback",
									"feedbackAudio": ""
								}
							]
						};
            break;
          case 'Image Button':
            this.selectedObj = {
              "start": 0,
              "type": "ImageButton",
              "useBlur": true,
              "useOverlay": false,
              "animateIn": false,
              "animateOut": false,
              "pauseVideo": true,
              "resumePlayback": true,
              "branchTo": null,
              "imagePath": "",// "images/cookies.png"
              "location": {
                "top": 0,
                "left": 0,
                "width": 223,
                "height": 154
              }
            };
            // ToDo: TitleScreen, MultiAnswer, DragImage
        }
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
  .addnew-footer {
    padding: 10px 0;
    border-top: 2px solid #888888;
  }

  .icon-button {
    margin: 5px auto;
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
