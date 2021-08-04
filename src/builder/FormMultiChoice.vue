<template>
    <div class="form-body">
      <div class="message" :class="propertiesClasses">
        <div class="message-header" @click="toggleProperties">
          Common Properties:     
        </div>
        <div class="message-body">
          <div class="message-content">
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
          </div>
        </div>
      </div>
        <!-- element specific -->
        <div class="message" :class="questionClasses">
          <div class="message-header" @click="toggleQuestion">
            Question Text:     
          </div>
          <div class="message-body">
            <div class="message-content">
              <textarea id="questionText"
                v-model="updatedData.questionText"
                @input="$emit('itemChanged', updatedData)"
              >
              </textarea>
              <div class="form-row">
                <button id="questionAudioUpload" role="button" class="icon-button"
                  title="Question audio file"
                >
                  <icon-upload-cloud title="Question audio file"/>
                </button>
                <label for="questionAudio" title="Question audio file">
                  Audio:
                </label>
                <input id="questionAudio" class="input-long"
                  v-model="updatedData.questionAudio"
                  @input="$emit('itemChanged', updatedData)"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="message" :class="instructClasses">
          <div class="message-header" @click="toggleInstruct">
            Instructions:  
          </div>
          <div class="message-body">
            <div class="message-content">
              <textarea id="questionInstructions"
                v-model="updatedData.questionInstructions"
                @input="$emit('itemChanged', updatedData)"
              >
              </textarea>
            </div>
          </div>
        </div>
        <div class="message" :class="answerClasses">
          <div class="message-header" @click="toggleAnswers">
            Answers: 
            <input type="checkbox" id="randomizeAnswers"
              style="margin-left: 20px;"
              v-model="updatedData.randomizeAnswers"
              @input="$emit('itemChanged', updatedData)"
            >
            <label for="randomizeAnswers" title="Randomize the answers">
              Randomize Answers
            </label>  
            <button role="button" class="icon-button"
              title="Add answer"
            >
              <icon-plus title="Add answer"/>
            </button>
            Add answer
          </div>
          <div class="message-body">
            <div class="message-content"
              v-for="(ans, index) in updatedData.answers"
              :key="index"
            >
              <div class="form-row">
                <label :for="'answerText'+index">Answer:</label>
                <input type="checkbox" :id="'correct'+index"
                  v-model="updatedData.answers[index].correct"
                  @input="$emit('itemChanged', updatedData)"
                >
                <label :for="'correct'+index"
                  title="Is the correct answer">
                  Correct
                </label>
              </div>
              <div class="form-row">
                <textarea :id="'answerText'+index" class="area-short"
                  v-model="updatedData.answers[index].answerText"
                  @input="$emit('itemChanged', updatedData)"
                >
                </textarea>
              </div>
              <div class="form-row">
                <button :id="'answerAudioUpload'+index" role="button" class="icon-button"
                  title="Answer audio file"
                >
                  <icon-upload-cloud title="Answer audio file"/>
                </button>
                <label :for="'answerAudio'+index" title="Answer audio file">
                  Audio:
                </label>
                <input :id="'answerAudio'+index" class="input-long"
                  v-model="updatedData.answers[index].answerAudio"
                  @input="$emit('itemChanged', updatedData)"
                >
              </div>
              <div class="form-row">
                <label :for="'feedbackText'+index">Feedback:</label>
              </div>
              <div class="form-row">
                <textarea :id="'feedbackText'+index"
                  v-model="updatedData.answers[index].feedbackText"
                  @input="$emit('itemChanged', updatedData)"
                >
                </textarea>
              </div>
              <div class="form-row">
                <button :id="'feedbackAudioUpload'+index" role="button" class="icon-button"
                  title="Feedback audio file"
                >
                  <icon-upload-cloud title="Feedback audio file"/>
                </button>
                <label :for="'feedbackAudio'+index" title="Feedback audio file">
                  Audio:
                </label>
                <input :id="'feedbackAudio'+index" class="input-long"
                  v-model="updatedData.answers[index].answerAudio"
                  @input="$emit('itemChanged', updatedData)"
                >
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    /**
     * MultiChoice
     */
    name: "FormMultiChoice",
    // components: {},
    props: {
        formData: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data () {
        return {
            updatedData: [{
              "start": 0,
              "type": "MultiChoice",
              "useBlur": false,
              "useOverlay": false,
              "animateIn": true,
              "animateOut": true,
              "animateTo": "35%",
              "pauseVideo": false,
              "resumePlayback": true,
              "questionText": "",
              "questionAudio": "",
              "questionInstructions": "",
              "hintButtonText": "Need a hint?",
              "hintButtonTextColor": "",
              "hintButtonBackgroundColor": "",
              "hintText": "",
              "hintAudio": "",
              "randomizeAnswers": true,
              "answers": [
                {
                  "id": 0,
                  "correct": true,
                  "answerText": "Correct Anwer",
                  "answerAudio": "",
                  "feedbackText": "Correct.",
                  "feedbackAudio": ""
                },
                {
                  "id": 1,
                  "correct": false,
                  "answerText": "Wrong Anwer",
                  "answerAudio": "",
                  "feedbackText": "Sorry, incorrect.",
                  "feedbackAudio": ""
                }
              ]
            }],// .index is added in FormScene
            isPropertiesOpen: true,// Properties: useBlur, ...
            isQuestionOpen: false,// Question
            isInstructOpen: false,// Instructions
            isAnswersOpen: false,// Answers
        }
    },
    mounted () {
        // this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
            console.log('MultiChoice:', this.updatedData, this.updatedData.type);//, this.updatedData.index);
        // });
    },
    computed: {
      propertiesClasses: function() {
        return {
          'is-closed': !this.isPropertiesOpen,
          'is-primary': this.isPropertiesOpen
        };
      },
      questionClasses: function() {
        return {
          'is-closed': !this.isQuestionOpen,
          'is-primary': this.isQuestionOpen
        };
      },
      instructClasses: function() {
        return {
          'is-closed': !this.isInstructOpen,
          'is-primary': this.isInstructOpen
        };
      },
      answerClasses: function() {
        return {
          'is-closed': !this.isAnswersOpen,
          'is-primary': this.isAnswersOpen
        };
      }
    },
    methods: {
      // @keypress="isNumber($event)"
      isNumber: function(evt) {
        const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
        if (!keysAllowed.includes(evt.key)) {
          evt.preventDefault();
        }
      },
      toggleProperties: function() {
        this.isPropertiesOpen = true;
        this.isQuestionOpen = false;//!this.isQuestionOpen;
        this.isInstructOpen = false;
        this.isAnswersOpen = false;//this.isQuestionOpen ? false : true;
      },
      toggleQuestion: function() {
        this.isQuestionOpen = true;//!this.isQuestionOpen;
        this.isPropertiesOpen = false;
        this.isInstructOpen = false;
        this.isAnswersOpen = false;//this.isQuestionOpen ? false : true;
      },
      toggleInstruct: function() {
        this.isInstructOpen = true;
        this.isPropertiesOpen = false;
        this.isQuestionOpen = false;//!this.isQuestionOpen;
        this.isAnswersOpen = false;//this.isQuestionOpen ? false : true;
      },
      toggleAnswers: function() {
        this.isAnswersOpen = true;//!this.isAnswersOpen;
        this.isPropertiesOpen = false;
        this.isInstructOpen = false;
        this.isQuestionOpen = false;//this.isAnswersOpen ? false : true;
      }
    }
}
</script>

<style scoped>
    .form-body {
        width: 100%;
    }
    .form-row {
        width: 100%;
        margin: 5px 0;
        clear: both;
    }
    .form-row-half {
        width: 49%;
        margin: 5px 0;
        float: left;
    }
    .small-text {
      font-size: 14px;
    }
    .input-short {
        width: 45px;
    }
    .input-med {
        width: 60px;
    }
    .input-long {
        width: 75%;
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
        border-bottom-width: 0px;
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
    }
    .area-short {
      height: 60px;
    }
    .bordered {
        border-top: 2px solid #888888;
        margin-top: 20px;
        padding: 15px 0;
    }
    .empty-button {
        width: 15px;
        margin: 0 10px;
        padding: 0 5px;
        float: right;
        border: 1px solid transparent;
    }
    .icon-button {
        margin: 0 5px 0 0;
        padding: 0 5px;
        cursor: pointer;
        /* float: right; */
        font-size: 16px;
        color: #333333;
        border-radius: 2px;
        border: 1px solid  #000000;
        background-color: #efefef;
    }
    .icon-button:hover {
        background-color: #ccf1cc;
    }
/* https://scotch.io/courses/getting-started-with-vuejs/vue-events-building-an-accordion */
    .message {
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .message-header {
      cursor: pointer;
    }
    .message-body   {
      padding: 0;
      max-height: 17em;
      overflow-y: auto;
      transition: 0.3s ease all;
    }
    .is-closed .message-body {
      max-height: 0;
    }
    /* .is-dark {
      background-color: rgba(150, 150, 150, 0.5);
    } */
    .message-content {
      padding: 5px 0;
      margin-bottom: 5px;
      border: 1px solid #333333;
    }
</style>
