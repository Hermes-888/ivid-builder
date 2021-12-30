<template>
  <div class="object-view__container">
    <div class="object-view__items">
      <div
        v-for="(item, i) in displayData"
        :key="`${item.type}-${i}`"
        class="object-view"
      >
        <div class="object-view__key">
          <!-- <button
            v-if="item.type === 'object' || item.type === 'array'"
            type="button"
            class="json-editor__btn json-editor__btn_icon"
            aria-controls="trigger"
            :aria-expanded="!item.collapsed ? 'true' : 'false'"
            @click="item.collapsed = !item.collapsed"
          >
            <slot name="icon-collapse">
              <span
                class="btn-icon btn-icon_collapse"
                :title="item.collapsed ? 'Expand' : 'Collapse'"
                >
                ^
              </span>
            </slot>
            <i v-if="item.type === 'object'">{{ `{ ${item.value.length} }` }}</i>
            <i v-if="item.type === 'array'">{{ `[ ${item.value.length} ]` }}</i>
          </button> -->
          <div
            v-if="item.key !== null"
            v-text="item.key"
            :class="item.type === 'array' ? 'array-label key-label' : 'key-label'"
            :title="item.type === 'array' ? 'Array of objects' : ''"
          >
          </div>
          <button
            class="btn btn-sm btn-primary key-button"
            v-if="item.type === 'array'"
            @click="$root.$emit('addArrayItem', item.key)"
          >
            + Add Item
          </button>
          <!-- add button if image, video, audio type = file -->
          <!-- <button
            v-if="item.type === 'file'" 
            role="button" class="icon-button"
            title="Search for image"
            @click="$root.$emit('findFile', item.key)"
          >
            <icon-file-search/>
          </button> -->
        </div>
        <div v-show="!item.collapsed" class="object-view__value">
          <item-view
            v-if="item.type === 'object' || item.type === 'array'"
            v-model="item.value"
            :item-type="item.type"
            :parsed-data="item.value"
            :class="item.type === 'array' ? 'array-container' : 'object-container'"
          >
          </item-view>
          <template v-else>
            <span v-if="item.type === 'null'" class="value_null">null</span>
            <textarea
              v-if="item.type === 'string' && item.value.length >= 40"
              v-model.trim="item.value"
              class="value_text_area form-control"
            />
            <input type="text"
              v-if="item.type === 'string' && item.value.length < 40"
              v-model.trim="item.value"
              class="value_text form-control"
            />
            <input type="number"
              v-if="item.type === 'number'"
              v-model.number="item.value"
              step="1"
              class="value_number form-control"
            />
            <!-- file search button -->
            <div v-if="item.type === 'file'"
              class="value_text input-group"
            >
              <button class="btn btn-primary" type="button" 
                title="File search"
                :id="item.key"
                @click="$root.$emit('findFile', item.key, item.asset)"
              >
                <icon-file-search title="File search" />
              </button>
              <input type="text" 
                class="form-control"
                v-model.trim="item.value"
              >
            </div>
            <!-- <select
              v-if="item.type === 'boolean'"
              v-model="item.value"
              class="json-editor__select value_select form-select"
            >
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select> -->
            <!-- range slider -->
            <!-- radio group -->
            <!-- cueData:[] tabs -->
            <input type="checkbox"
              v-if="item.type === 'boolean'"
              v-model="item.value"
              class="value_checkbox"
            />
            <!-- color picker -->
            <div
              v-if="item.type === 'color'"
              :id="item.key"
              :style="{backgroundColor:item.value}"
              class="color-swatch" 
              title="Click to open a color picker, click again to close it"
              @click="item.visible = !item.visible"
            >
            </div>
          </template>
        </div>
          <color-picker
            v-if="item.type === 'color' && item.visible"
            :name="item.key"
            :color="item.value"
            @changed="changeColor"
            @close="item.visible = !item.visible"
          />
      </div>
    </div>

    <!--ItemForm ADDS A KEY,VALUE TO THE OBJECT -->
    <!-- <item-form
      v-if="itemForm"
      :required-key="itemType !== 'array'"
      @add-new-item="createItem"
      @cancel-new-item="toggleForm"
    ></item-form> -->

    <!-- <button
      v-if="!itemForm"
      type="button"
      class="json-editor__btn json-editor__btn_icon"
      @click="toggleForm"
    >
      <slot name="icon-add">
        <span class="btn-icon btn-icon_add" title="Add">+</span>
      </slot>
    </button> -->
  </div>
</template>

<script>
// import ItemForm from './item-form.vue';
import ColorPicker from './ColorPicker.vue';

// https://getbootstrap.com/docs/5.1/forms/form-control/
/**
 * $emit events on $root
 * listen for events $on Builder
 */

export default {
  name: 'ItemView',
  components: {
    // ItemForm,
    ColorPicker
  },
  inject: ['typesList'],
  props: {
    itemType: {
      type: String,
      required: true,
    },
    parsedData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      displayData: this.parsedData ? this.parsedData : [],
      showItemForm: false,
    };
  },
  watch: {
    parsedData: {
      handler() {
        this.displayData = this.parsedData;
      },
    },
  },
  methods: {
    changeColor: function (picker) {
      console.log('changeColor:', picker.name, picker.color.hex8);
      this.$root.$emit('changeColor', picker);
    },

    // ItemForm -----------------
    createItem(item) {
      this.displayData.push(item);
      this.$emit('input', this.displayData);
      this.toggleForm();
    },
    toggleForm() {
      this.showItemForm = !this.showItemForm;
    }
  },
};
</script>

<style>
  .object-view {
    display: flex;
    flex-direction: row;
    padding: 1px 0;
  }
  .object-view__container {
    /* display: flex;
    flex-direction: row; */
    background-color: rgba(255, 255, 255, 0.5);
  }
  .object-view__key {
    display: flex;
    flex-direction: column;
  }
  .key-label {
    min-width: 180px;
    padding-right: 0.75rem;
    text-align: right;
  }
  .key-button {
    margin: 0.5rem 2rem;
  }

  .value_text_area {
    width: 360px;
    min-width: 300px;
    height: 90px;
  }
  .value_number {
    width: 110px;
  }
  .value_text {
    width: 360px;
  }
  .value_checkbox {
    min-width: 1em;
    min-height: 1em;
  }

  .array-label {
    font-weight: bold;
    background-color: rgba(200, 241, 255, 0.5);
  }
  .object-container {
    padding: 5px;
    margin: 5px 0;
    border: 1px solid #888888;
  }
  .array-container {
    padding: 0 8px;
    border-radius: 8px;
    border-top-left-radius: 0;
    border: 1px solid #888888;
    background-color: rgba(200, 241, 255, 0.5);
  }
  
  /* color picker */
  .picker-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: rgba(0,0,0, 0.2);
  }
  .picker-panel .close-circle-outline-icon {
    margin: 5px 10px;
    float: right;
  }
  .picker-panel .close-circle-outline-icon .material-design-icon__svg {
    fill: #ffffff;
  }
  .btn-color-palette {
    position: absolute;
    top: 31%;
    left: 160px;
  }
  .btn-fill-palette {
    position: absolute;
    top: 31%;
    right: 58px;
  }
  .color-swatch {
    width: 30px;
    height: 20px;
    margin: 0 5px;
    cursor: pointer;
    border: 1px solid #000000;
  }
  .swatch-glow {
    box-shadow: 0px 0px 20px 5px rgb(78, 236, 210);
    /* in order: x offset, y offset, blur size, spread size, color */
    /* blur size and spread size are optional (they default to 0) */
  }
</style>
