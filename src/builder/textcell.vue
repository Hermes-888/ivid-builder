<template>
    <div class="text-cell">
        <div id='editable'>{{textData}}</div>
    </div>
</template>

<script>
    // BalloonEditor
    //     .create(document.querySelector('#editable'))
    //     .catch(error => {
    //         console.log(error);
    //     });
export default {
    /**
     * Text Area w/html options
     */
    name: "textcell",
    components: {},
    props: {
        textData: {
            type: String,
            default: 'text cell'
        }
    },
    // data () {
    //     return {
    //         BalloonEditor: null// error Not Defined
    //     }
    // },
    mounted () {
        BalloonEditor
            .create(document.querySelector('#editable'))
            .catch(error => {
                console.log(error);
            });
    },
    methods: {}
}
</script>

<style scoped>
    .text-cell {
        width: 12%;
        margin-left: 10px;
        font-size: 16px;
        font-weight: 500;
        color:#000000;
        background-color: #ffffff;
        border: 1px solid #333333;
    }
</style>
