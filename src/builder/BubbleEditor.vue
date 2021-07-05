<template>
  <div class="editor">
    <editor-menu-bubble
      :editor="editor"
      :keep-in-bounds="keepInBounds"
      v-slot="{ commands, isActive, menu }"
      v-model.lazy="value"
    >
      <div
        class="menububble"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <icon-bold name="bold"/>
        </button>
        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <icon-italic name="italic"/>
        </button>
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <icon-strike-through name="strike"/>
        </button>
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <icon-underline name="underline"/>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <icon-list-bulleted name="ul"/>
        </button>
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <icon-list-numbered name="ol"/>
        </button>
        <button
          class="menubar__button"
          @click="commands.undo"
        >
          <icon-undo name="undo"/>
        </button>
        <button
          class="menubar__button"
          @click="commands.redo"
        >
          <icon-redo name="redo"/>
        </button>

        <!-- <button
          class="menububble__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <icon-code-tags name="code" />
        </button> -->
      </div>
    </editor-menu-bubble>

    <editor-content class="editor__content" :editor="editor"/>
  </div>
</template>

<script>
/**
 * TipTap V1 https://tiptap.dev/
 * https://tiptap.dev/links
 * https://github.com/ueberdosis/tiptap
 * https://stackoverflow.com/questions/63912152/how-can-i-put-content-from-tiptap-text-editor-into-a-v-model
 * https://github.com/ueberdosis/tiptap/blob/main/examples/Components/Routes/Basic/index.vue
 * 
 * 
 * Usage: set id to data[].property for updateChangedText
    <bubble-editor id="screenText"
            :value="row.screenText.text"
            @hasUpdates="updateChangedText"
    />
 *
 * Or create an instance:
 * let editorInstance = Vue.extend(BubbleEditor);
      this.editorNode = new editorInstance({
        // propsData: { value: '<p>nada node</p>'}
      });

      this.editorNode.$mount();
 */
import iconBold from 'vue-material-design-icons/FormatBold.vue';
import iconItalic from 'vue-material-design-icons/FormatItalic.vue';
import iconStrikeThrough from 'vue-material-design-icons/FormatStrikethroughVariant.vue';
import iconUnderline from 'vue-material-design-icons/FormatUnderline.vue';
import iconListBulleted from 'vue-material-design-icons/FormatListBulleted.vue';
import iconListNumbered from 'vue-material-design-icons/FormatListNumbered.vue';
import iconUndo from 'vue-material-design-icons/Undo.vue';
import iconRedo from 'vue-material-design-icons/Redo.vue';
// History breaks something
// import iconHistory from 'vue-material-design-icons/History.vue';
// import iconCodeTags from 'vue-material-design-icons/CodeTags.vue';
// import iconLink from 'vue-material-design-icons/LinkVariantPlus.vue';

import {Editor, EditorContent, EditorMenuBubble} from 'tiptap'
import {
  Blockquote,// unused
  BulletList,// ul
  CodeBlock,// unused
  HardBreak,// unused
  Heading,// H1, H2, H3
  ListItem,
  OrderedList,// ol
  TodoItem,// unused
  TodoList,// unused
  Bold,
  Code,// unused
  Italic,
  Link,// maybe? iconLink https://tiptap.dev/links
  Strike,
  Underline,
  History,// unused
} from 'tiptap-extensions'

export default {
  name: 'BubbleEditor',
  components: {
    EditorContent,
    EditorMenuBubble,
    iconBold,// vue-material-design-icon
    iconItalic,
    iconStrikeThrough,
    iconUnderline,
    iconListBulleted,
    iconListNumbered,
    iconUndo,
    iconRedo,
    // iconHistory,
    // iconCodeTags
  },
  props: {
    value: {
        type: String,
        default: 'Some Text ...'
    }
  },
  data() {
    return {
      keepInBounds: true,
      editor: null,// initialize in mounted()
    }
  },
  watch: {
    editor: {
      immediate: true,
      handler(editor) {
        if (!editor || !editor.element) return;

        // Fires on every keystroke
        this.editor.on("update", ({getHTML}) => {
          let html = getHTML();
          // console.log('BubbleEditor: update:', html, this.$attrs);// OK
          //let stripped = html.replace(/(<([^>]+)>)/gi, "");// all tags
          // let stripped = html.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
          let s = html.replace(/<li><p>/gm, "<li>");  
              html = s.replace(/<\/p><\/li>/gm,"</li>");
          // stripped = '<p>' + stripped + '</p>';
          if (html !== getHTML()) {
              console.log('stripped:', html);// stripped);
              // this.editor.setContent(html, false);// nope
          }
          
          // console.log('JSON:', this.editor.getJSON());
          // console.log('value:', this.value);
          this.$emit('hasUpdates', html, this.$el.id);
        });
      }
    },
    value (val) {
        // so cursor doesn't jump on typing
        if (this.editor && val !== this.value) {
            this.editor.setContent(val, false);// true=emit change?
        }
    }
  },
  mounted() {
      this.editor = new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({levels: [1, 2, 3]}),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: this.value
      });

      // this.editor.setContent(this.value);
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style>
  /* cannot be scoped */
  .ProseMirror-focused:focus {
    padding: 1px 5px;
  }
  /*.ProseMirror-focused:focus {*/
  /*  outline: none;*/
  /*}*/
  /*.editor__content {*/
  /*  background-color: #ffffff;*/
  /*}*/
</style>
<style scoped>
.menububble {
  position: absolute;
  display: -webkit-box;
  display: flex;
  z-index: 20;
  background: #ababab;
  border-radius: 5px;
  border: 1px solid #000;
  padding: .3rem;
  margin-bottom: .5rem;
  -webkit-transform: translate(-35%, -40px);
  transform: translate(-35%, -40px);
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity .2s, visibility .2s;
  transition: opacity .2s, visibility .2s;
}

.menububble.is-active {
  opacity: 1;
  visibility: visible;
}
</style>
