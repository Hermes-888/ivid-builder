<template>
    <div class="form-body">
        <!-- <div class="form-row-half">
            <label for="startat">Start Time:</label>
            <input type="text" id="startat" class="short-text-input"
                v-model="updatedData.start"
                @change="$emit('itemChanged', updatedData.start)"
            >
        </div> -->
        <div class="form-row-half">
            <label for="duration">Duration:</label>
            <input type="text" id="duration" class="short-text-input"
                v-model="updatedData.duration"
                @change="$emit('itemChanged', updatedData.duration)"
            >
            <input type="checkbox" id="pause"
                v-model="updatedData.removeMessage"
                @change="$emit('itemChanged', updatedData.removeMessage)"
            >
            <label for="pause" title="False will leave the message on the screen">Remove Message</label>
        </div>
        <div class="form-row">
            <label for="message">Message:</label>
            <input type="text" id="message" class="long-text-input"
                v-model="updatedData.messageText"
                @change="$emit('itemChanged', updatedData.messageText)"
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
                "removeMessage": true,
                "messageText": "",
                "duration": 1
            }],// don't mutate the prop
        }
    },
    mounted () {
        this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
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
    .short-text-input {
        width: 10%;
        margin-right: 20px;
    }
    .long-text-input {
        width: 78%;
    }
    label {
        margin-right: 5px;
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
