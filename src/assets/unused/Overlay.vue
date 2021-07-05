<template>
    <div
        class="overlay"
        v-bind:style="{backgroundColor: overlayColor}"
    />
</template>

<script>
    export default {
        name: 'Overlay',
        props: {
            overlayColor: String,
            default() {
                return 'rgba(0, 0, 0, 0.5)';
            }
        }
    }
</script>

<style scoped>
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        /* z-index: 99; */
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
