<template>
    <div class="form-body">
        <div class="form-row">
            <div class="empty-button"></div>
            <label for="titleText">Title:</label>
            <input id="titleText" v-show="updatedData.titleText"
                v-model="updatedData.titleText" placeholder="edit me"
            >
        </div>
        <div class="form-row">
            <label for="description">Text:</label>
            <textarea id="description"
                v-model="updatedData.text"
            >
            </textarea>
        </div>
        <div class="form-row">
            <button id="audioUpload" role="button" class="icon-button"
                title="Upload an audio file."
                @click="uploadImage"
            >
                <icon-upload-cloud title="Upload an audio file."/>
            </button>
            <label for="audio">Audio:</label>
            <input id="audio" v-model="updatedData.audio" placeholder="optional">
        </div>
        <div class="form-row">
            <button id="imageUpload" role="button" class="icon-button"
                title="Upload an image. It will also be added to the repository."
                @click="uploadImage"
            >
                <icon-upload-cloud title="Upload an image. It will also be added to the repository."/>
            </button>
            <label for="image">Image:</label>
            <input id="image" v-model="updatedData.image" placeholder="optional">
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
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
     */
    name: "FormIntroduction",
    props: {
        formData: {
            type: Object,
            default() {
                return {
                    titleText: '',
                    text: '',
                    audio: '',
                    image: ''
                }
            }
        }
    },
    data () {
        return {
            updatedData: {
                titleText: '',
                text: '',
                audio: '',
                image: ''
            },// don't mutate the prop
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
    /* label {
        margin-right: 20px;
    } */
    input, textarea {
        width: 80%;
        float: right;
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
        width: 87%;
        height: 80px;
        resize: none;
        margin-bottom: 8px;
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
