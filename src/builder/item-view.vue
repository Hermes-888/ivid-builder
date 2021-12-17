<template>
  <div class="object-view__container">
    <div class="object-view__items">
      <div
        v-for="(item, i) in currentData"
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
            :class="item.type === 'array' || item.type === 'object' ? 'array-label' : 'json-editor__input key__input'"
          ></div>
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
            <span v-if="item.type === 'null'" class="json-editor__input value__input">null</span>
            <textarea
              v-if="item.type === 'string' && item.value.length >= 40"
              v-model.trim="item.value"
              class="json-editor__input value__input"
            />
            <input
              v-if="item.type === 'string' && item.value.length < 40"
              v-model.trim="item.value"
              type="text"
              class="json-editor__input value__input"
            />
            <input
              v-if="item.type === 'number'"
              v-model.number="item.value"
              type="number"
              class="json-editor__input value__input"
              step="0.1e-100"
            />
            <select
              v-if="item.type === 'boolean'"
              v-model="item.value"
              class="json-editor__select value__input"
            >
              <option :value="true">true</option>
              <option :value="false">false</option>
            </select>
          </template>
        </div>
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

export default {
  name: 'ItemView',
  // components: {
  //   ItemForm,
  // },
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
      currentData: this.parsedData ? this.parsedData : [],
      itemForm: false,
    };
  },
  watch: {
    parsedData: {
      handler() {
        this.currentData = this.parsedData;
      },
    },
  },
  methods: {
    createItem(item) {
      // ItemForm
      this.currentData.push(item);
      this.$emit('input', this.currentData);
      this.toggleForm();
    },
    toggleForm() {
      this.itemForm = !this.itemForm;
    }
  },
};
</script>

<style>
  .object-view {
    display: flex;
    flex-direction: row;
    padding: 2px 0;
  }
  .object-view__container {
    display: flex;
    flex-direction: row;
    background-color: #ffe4c4;
  }
  .key__input {
    min-width: 180px;
    margin-right: 10px;
    justify-content: flex-start;
  }

  input, .value_input {
    min-width: 298px;
    justify-content: flex-end;
  }
  textarea, .value_input {
    min-width: 300px;
    min-height: 50px;
  }
  .array-label {
    min-width: 180px;
    margin-right: 10px;
    font-weight: bold;
    background-color: #c8f1ff;
  }
  .object-container {
    padding: 5px;
    margin: 5px 0;
    border: 1px solid #888888;
  }
  .array-container {
    padding: 0 5px;
    border: 1px solid #888888;
    background-color: #c8f1ff;
  }
</style>
