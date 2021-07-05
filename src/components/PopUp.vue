<template>
    <span class="popup-container">
        <span class="word"
            ref="popupWord"
            v-html="wordText"
            v-on:click="showDefinition"
            v-on:mouseenter="showDefinition"
            v-on:mouseleave="hideDefinition"
        />
        <!-- the tooltip definition -->
        <div class="popup"
            ref="popupDiv"
            v-show="isOpen"
            v-on:click="hideDefinition"
        >
            <strong>Definition of </strong>
            <div class="definition">
                <span
                    v-html="definitionText"
                />
            </div>
        </div>
    </span>
</template>

<script>
export default {
    props: {
        wordText: {
            type: String,
            default: ''
        },
        definitionText: {
            type: String,
            default: ''
        },
        definitionAudio: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isOpen: true,
            popupDiv: null,
            popupWidth: 1,
            popupHeight: 1,
            halfWidth: 0.5,
            //popupRect: null
        }
    },
    mounted() {
        /**
         * TODO: this could have an audio player too
         *
         * Start visible to obtain width, height then hide
         * wait for nextTick to capture the dynamically placed PopUp
         */
        this.$nextTick(function () {
            this.popupDiv = this.$refs.popupDiv;
            this.popupWidth = this.$refs.popupDiv.offsetWidth;// + 'px';
            this.popupHeight = this.$refs.popupDiv.offsetHeight;// + 'px';
            this.halfWidth = this.popupWidth/2;
            //this.popupRect = this.$refs.popupDiv.getBoundingClientRect();
            //console.log(this.$refs.popupDiv.clientHeight, this.$refs.popupDiv.offsetHeight);
            //console.log('rect:', this.popupRect);
            console.log('pW,pH:', this.popupWidth, this.popupHeight);

            this.$nextTick(function () {
                this.isOpen = false;
            });
        });
    },
    methods: {
        /**
         * hover/tap on word to open popup
         * if mobile, click popup to hide it
         */
        showDefinition: function(e) {
            this.isOpen = true;
            // set popup position to stay within the window edges
            var posx = (e.pageX - this.halfWidth < 0)
                    ? 10
                    : (e.pageX + this.halfWidth + 20 < window.innerWidth)
                            ? e.pageX - this.halfWidth
                            : window.innerWidth - this.popupWidth - 20;
            var posy = e.pageY + this.popupHeight + 10 < window.innerHeight ? e.pageY + 10 : e.pageY - this.popupHeight - 10;
            this.popupDiv.style.left = posx + 'px';
            this.popupDiv.style.top = posy + 'px';
            this.isOpen = true;
        },
        hideDefinition: function() {
            this.isOpen = false;
        }
    }
}
</script>

<style scoped>
    .popup {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        width: 24%;
        height: auto;
        padding: 5px;
        text-align: center;
        background-color: #f0f0f0;
        border-radius: 15px;
        border: 3px solid #024902;
    }
    .word {
        color: #3014e9;
        font-weight:700;
        cursor: pointer;
    }
    .word:hover {
        color: #024902;
    }
    .definition {
        color: #333333;
        padding: 10px;
        text-align: left;
        border-radius: 12px;
        border: 1px solid darkgray;
        background-color: #ffffff;
    }
</style>
