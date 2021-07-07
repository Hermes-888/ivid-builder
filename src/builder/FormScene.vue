<template>
    <div class="form-body">
        <div class="form-row">
            <button id="videoUpload" role="button" class="icon-button"
                title="Upload the main video file."
                @click="uploadImage"
            >
                <icon-upload-cloud title="Upload the main video file."/>
            </button>
            <label for="video">Video:</label>
            <input id="video" v-model="updatedData[0].videoBackground" placeholder="required">
        </div>
        <div class="form-row">
            <button id="captionUpload" role="button" class="icon-button"
                title="Upload an optional vtt captions file for this video."
                @click="uploadImage"
            >
                <icon-upload-cloud title="Upload an optional vtt captions file for this video."/>
            </button>
            <label for="captions">Captions:</label>
            <input id="captions" v-model="updatedData[0].captionsFile" placeholder="optional">
        </div>
        <div class="form-row">
            <label for="branches">Branches:</label>
            <input id="branches" class="short-input" type="number" inputmode="numeric"
                v-model="updatedData[0].branchCount" placeholder="Number of branches"
            >
            <label for="return">Return Time:</label>
            <input id="return" class="short-input" type="number" inputmode="decimal"
                v-model="updatedData[0].returnTime" placeholder="Time in seconds"
            >
        </div>
        <!-- cueData[] - use tabs to select which cue -->
        <div id="tabs" class="tabs-container">
            <span>Interactions:</span>
            <div class="tabs">
                <span
                    v-for="(cue, index) in updatedData[0].cueData"
                    :key="index"
                >
                    <a :class="[ activetab === index ? 'active' : '' ]"
                        @click="activetab=index"
                        v-text="(index+1)"
                    ></a>
                </span>

                <a class="add-button" title="Add new cue"
                    @click="addCue" 
                >+</a>
            </div>
            <div
                v-for="(cue, index) in updatedData[0].cueData"
                :key="'panel'+index"
            >
                <div  class="tab-content"
                    v-if="activetab === index"
                >
                    {{cue.type}}
                    <br>
                    {{JSON.stringify(cue)}}
                </div>
            </div>
        </div>
        <div class="form-row bordered">
            <button role="button" class="icon-button"
                title="Save changes"
                @click="$emit('updateChanges', updatedData)"
            >
                Save Changes <icon-save-file/>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    /**
     * Nice form styles
     * https://codepen.io/rickyeckhardt/pen/zYGwaKr
     * https://codepen.io/uzcho_/pen/bPZMez
     * https://vuejs.org/v2/guide/forms.html
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
     */
    name: "FormScene",
    // components: {},
    props: {
        formData: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data () {
        return {
            activetab: 0,// default
            updatedData: [{
                videoBackground: '',
                captionsFile: '',
                branchCount: '',
                returnTime: '',
                cueData: []
            }],// don't mutate the prop
            /* 
            "sceneData": [
				{
					"_comment": "data for English",
					"videoBackground": "",
					"captionsFile": "",
					"ccEnabled": false,
					"returnTime": 0,
					"branchCount": 0,
					"played": false,
                    "cueData": []
                }
            */
        }
    },
    mounted () {
        // create a deep copy of data to mutate
        this.$nextTick(function() {
            this.updatedData = JSON.parse(JSON.stringify(this.formData));
        });
    },
    methods: {
        uploadImage: function(event) {
            console.log('get id:', event);
            var id = event.target.id;
            if (!id) {
                //console.log('path:', event.path);
                id = event.path[3].id;
            }
            console.log('upload:', id);
        },
        addCue: function() {
            console.log('Add new Cue/tab');
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
    .bordered {
        border-top: 2px solid #888888;
        margin-top: 20px;
        padding: 15px 0;
    }
    label {
        margin-right: 20px;
    }
    input, textarea {
        width: 78%;
        float: right;
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
    .short-input {
        width: 25%;
        float: unset;
        margin-right: 40px;
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

    .add-button {
        /* background-color:aqua !important; */
        font-weight: 600;
    }

    /* tabs https://vuejsexamples.com/tabbed-content-with-vue-js/ */
    .tabs-container {  
        width: 100%;
        margin: 20px auto;
    }

    /* Style the tabs */
    .tabs {
        overflow: hidden;
        margin-left: 20px;
        margin-bottom: -2px;/* hide bottom border */
    }

    .tabs ul {
        list-style-type: none;
        margin-left: 20px;
    }

    .tabs a{
        float: left;
        cursor: pointer;
        padding: 5px 20px;
        transition: background-color 0.2s;
        border: 1px solid #888888;
        border-right: none;
        background-color: #f1f1f1;
        border-radius: 6px 6px 0 0;
        /* font-weight: bold; */
    }
    .tabs a:last-child { 
        border-right: 1px solid #888888;
    }

    /* Change background color of tabs on hover */
    .tabs a:hover {
        background-color: #aaa;
        color: #fff;
    }

    /* Styling for active tab */
    .tabs a.active {
        background-color: #fff;
        color: #333333;
        border-bottom: 2px solid #fff;
        cursor: default;
    }

    /* Style the tab content */
    .tab-content {
        padding: 5px;
        overflow-wrap: anywhere;
        border-top: 1px solid #888888;
        /* border-radius: 10px;
        box-shadow: 3px 3px 6px #e1e1e1 */
    }
</style>
