<template>
  <div class="json-editor">
    <div class="object-view object-view_list">
      <!-- <div v-show="!item.collapsed" class="object-view__value"> -->
      <div class="object-view__value">
        <item-view
          v-if="item.type === 'object' || item.type === 'array'"
          v-model="item.value"
          :item-type="item.type"
          :parsed-data="item.value"
        >
          <div class="object-view array-view"
            v-text="item.value"
          ></div>
        </item-view>
        <template v-else>
          <span v-if="item.type === 'null'" class="json-editor__input value__input">null</span>
          <input
            v-if="item.type === 'string'"
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
</template>

<script>
import Item from '../helpers/item';
import ItemView from './item-view.vue';

const typesList = ['object', 'array', 'string', 'number', 'boolean', 'null'];

export default {
  name: 'JsonEditor',
  components: {
    ItemView,
  },
  provide() {
    return {
      typesList,
      options: this.options,
    };
  },
  props: {
    dataInput: {
      type: [String, Number, Boolean, Array, Object],
      default() {
        return null;
      },
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      item: new Item({ key: 'current dataInput', value: this.dataInput }, 'object'),
      cache: {
        value: null,
        type: 'null',
      },
      typesList,
    };
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler() {
        const newValue = JSON.stringify(this.item.value);

        if (newValue === JSON.stringify(this.cache.value) && this.item.type === this.cache.type)
          return;

        this.cache.type = `${this.item.type}`;
        this.cache.value = JSON.parse(newValue);
        // console.log('-watch item cache:', this.cache.type, this.cache.value);
        // console.log('-watch item key:', JSON.stringify(this.item.type));

        // NOTE: changes the whole object on every key
        // console.log('-watch item value:', newValue);

        // this.$emit('data-output', this.item.buildItem());
      }
    },
    dataInput: {
      immediate: true,
      handler() {
        // debugging
        console.log('dataInput', this.dataInput);// slidedata
      }
    }
  }
};
</script>

<style>
.editor-panel {
  width: 65%;
  max-width: 65% !important;
}
.tabs-container {
  display: none;
}

  .json-editor {
    max-height: 65vh;
    overflow-y: auto;
  }
  .object_view {
    display: flex;
    flex-direction: row;
  }
</style>