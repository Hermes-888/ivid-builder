<template>
    <div class="form-body">
        <div class="form-row">
            <input type="checkbox" id="blur"
                v-model="updatedData.useBlur"
                @change="$emit('itemChanged', updatedData.useBlur)"
            >
            <label for="blur" title="Blur the background during interaction">Use Blur</label>

            <span> -OR- </span>
            <input type="checkbox" id="overlay"
                v-model="updatedData.useOverlay"
                @change="$emit('itemChanged', updatedData.useOverlay)"
            >
            <label for="overlay" title="Overlay the background to obscure it">Use Overlay</label>
            <span class="small-text"> (Neither=clear : NOT Both) </span>
        </div>
        <div class="form-row">
            <input type="checkbox" id="pause"
                v-model="updatedData.pauseVideo"
                @change="$emit('itemChanged', updatedData.pauseVideo)"
            >
            <label for="pause" title="Pause the video during the interaction">Pause Video</label>

            <input type="checkbox" id="resume"
                v-model="updatedData.resumePlayback"
                @change="$emit('itemChanged', updatedData.resumePlayback)"
            >
            <label for="resume" title="Resume playing the video after the interaction">Resume Video</label>
        </div>
        <div class="form-row">
            <input type="checkbox" id="in"
                v-model="updatedData.animateIn"
                @change="$emit('itemChanged', updatedData.animateIn)"
            >
            <label for="in" class="wide-label">Animate In</label>

            <input type="checkbox" id="out"
                v-model="updatedData.animateOut"
                @change="$emit('itemChanged', updatedData.animateOut)"
            >
            <label for="out" class="wide-label">Animate Out</label>

            <label for="to">Animate To:</label>
            <input type="text" id="to" class="short-text-input"
                v-model="updatedData.animateTo"
                @change="$emit('itemChanged', updatedData.animateTo)"
            >
        </div>
    </div>
</template>

<script>
export default {
    /**
     * Animated Message
        "start": 3.12,
        "type": "AnimatedMessage",
        "useBlur": false,
        "useOverlay": false,
        "animateIn": true,
        "animateOut": false,
        "animateTo": "35%",
        "pauseVideo": false,
        "resumePlayback": true,
        "removeMessage": true,
        "messageText": "This is a message from",
        "duration": 4
     */
    name: "FormMessage",
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
                "type": "AnimatedMessage",
                "useBlur": false,
                "useOverlay": false,
                "animateIn": true,
                "animateOut": false,
                "animateTo": "35%",
                "pauseVideo": false,
                "resumePlayback": true,
                "removeMessage": true,
                "messageText": "",
                "duration": 1
            }],// don't mutate the prop
        }
    },
    mounted () {
        this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
            console.log('cueData:', this.updatedData.type, this.updatedData.index);
            //console.log('message:', this.updatedData);
        });
    },
    // methods: {}
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
    .short-text-input {
        width: 10%;
    }
    .wide-label {
        margin-right: 15px;
    }

    input, textarea {
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
        width: 87%;
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
