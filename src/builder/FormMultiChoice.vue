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
        <!-- <div class="form-row">
            <label for="duration">Duration:</label>
            <input type="text" id="duration" class="input-short"
                v-model="updatedData.duration"
                @input="$emit('itemChanged', updatedData)"
            >
            <input type="checkbox" id="pause"
                v-model="updatedData.removeMessage"
                @input="$emit('itemChanged', updatedData)"
            >
            <label for="pause" 
              title="False will leave the message on the screen">
              Remove Message
            </label>
        </div>
        <div class="form-row">
            <span>Message:</span>
        </div>
        <div class="form-row">
            <textarea id="messageText"
                v-model="updatedData.messageText"
                @input="$emit('itemChanged', updatedData)"
            >
            </textarea>
        </div> -->
    </div>
</template>

<script>
export default {
    /**
     * MultiChoice
        "start": 3.12,
        "type": "AnimatedMessage",
        "useBlur": false,
        "useOverlay": false,
        "animateIn": true,
        "animateOut": false,
        "animateTo": "35%",
        "pauseVideo": false,
        "resumePlayback": true,
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
            }],// .index is added in FormScene
        }
    },
    mounted () {
        this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
            console.log('Message:', this.updatedData.type, this.updatedData.index);
        });
    },
    methods: {
      // @keypress="isNumber($event)"
      isNumber (evt) {
        const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
        if (!keysAllowed.includes(evt.key)) {
          evt.preventDefault();
        }
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
    .long-text-input {
        width: 78%;
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
    .empty-button {
        width: 15px;
        margin: 0 10px;
        padding: 0 5px;
        float: right;
        border: 1px solid transparent;
    }
    .icon-button {
        margin: 0 10px;
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
</style>
