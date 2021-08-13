<template>
  <div class="color-picker" @click.self="$emit('close')">
    <icon-close @click="$emit('close')"/>
    <Sketch class="color-palette"
      @input="changeValue"
      :value="color"
    />
  </div>
</template>

<script>
/**
 * Color Picker
 * https://github.com/xiaokaike/vue-color
 * 
 * import ColorPicker from './ColorPicker.vue';
 * components: {ColorPicker},
  <color-picker id="txtClose"
    v-if="showTxtPalette"
    :color="updatedData.textColor"
    @changed="changeTxtColor"
    @close="showPalette('txtClose')"
  />
 */
import {Sketch} from 'vue-color';

export default {
    name: "ColorPicker",
    components: {Sketch},
    props: {
      color: {
        type: String,
        default: '#000000',
      }
    },
    // data () {
    //   return {
    //     colors: {
    //       hex: '#000000',
    //       hex8: '#000000FF',
    //       rgba: {r: 0, g: 0, b: 0, a: 1},
    //       a: 1// alpha
    //     },
    //   }
    // },
    methods: {
      changeValue: function(color) {
        // console.log('picker color:', color);
        this.$emit('changed', color);
      }
    }
}
</script>

<style scoped>
  .color-picker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .color-picker .close-circle-outline-icon {
    margin: 0 5px;
    float: right;
    font-size: 27px;
  }
  .color-picker .close-circle-outline-icon .material-design-icon__svg {
    fill: #000000;
  }
  .color-palette {
    position: absolute;
    left: 28%;
    top: 23%;
  }
</style>
