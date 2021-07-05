<template>
  <div class="story-panel">
    <!-- <div class="panel-row top-row">
      <div class="id-cell">
        <div class="panel-header">Slide ID</div>
        <div class="pad-left">A</div>
        <div class="panel-header">Row ID</div>
        <input class="row-id-input" name="rowId"
          type="text"
          placeholder="Row #"
          minlength="1" maxlength="8" size="8"
          v-model="itemData[rowIndex].rowId"
        />
      </div>
      <div class="cue-cell">
        <div class="panel-header">{{ itemHeaders[1] }}</div>
        <textarea class="text-editor"
          style="width: 99%; height: 60%;"
          name="fullText"
          rows="3" cols="169"
          placeholder="Full Text Cue."
          v-model="itemData[rowIndex].fullText"
          @input="updateTextArea"
        ></textarea>
      </div>
    </div> -->
    <div class="panel-row middle-row">
      <!-- <div class="panel-column-left">
        <div class="panel-text">
          <div class="panel-header">{{ itemHeaders[3] }}</div>
          <div class="inner-text"
               data-type="textPresentation"
               @click="selectCell"
          >
            <div v-html="itemData[rowIndex].textPresentation"></div>
          </div>
        </div>
        <div class="panel-text">
          <div class="panel-header">{{ itemHeaders[4] }}</div>
          <div class="inner-text"
               data-type="imageDescription"
               @click="selectCell"
          >
            <div v-html="itemData[rowIndex].imageDescription"></div>
          </div>
        </div>
        <div class="panel-text">
          <div class="panel-header">Image {{ itemHeaders[5] }}</div>
          <div class="inner-text"
               data-type="imagePresentation"
               @click="selectCell"
          >
            <div v-html="itemData[rowIndex].imagePresentation"></div>
          </div>
        </div>
      </div> -->
      
      <div class="panel-column-right">
        <!-- v-show="!tableView" -->
        <div class="nada-nada-nada"
          v-for="(i, index) in itemData"
          :key="index"
        >
          <div class="image-layers"
            v-if="i.imageData && index < 2"
            v-show="layersVisible"
            :id="'imagelayer'+index"
          >
            <img class="layers" alt="image"
              v-if="i.imageData && index < 2"
              :src="i.imageData.url"
            />
          </div>
        </div>
        <div class="panel-header">
          Screen Layout
          <div class="image-buttons">
            <button role="button" class="icon-button"
              title="View image layers"
              @click="layersVisible = !layersVisible"
            >
              <icon-eye title="View image layers"/>
            </button>
            <button role="button" class="icon-button"
                    title="Search for images in repository"
                    @click="$emit('toggleRepo')"
            >
              <icon-cloud-search title="Search for images in repository"/>
            </button>
            <button role="button" class="icon-button"
                    title="Upload an image. It will also be added to the repository."
                    @click="uploadImage"
            >
              <icon-upload-cloud title="Upload an image. It will also be added to the repository."/>
            </button>
            <button role="button" class="icon-button"
                    title="Remove this image from row."
                    v-if="itemData[rowIndex].imageData.url"
                    @click="removeImage"
            >
              <icon-delete title="Remove this image from row."/>
            </button>
            <button role="button" class="icon-button"
                    title="Download this image file."
                    v-if="itemData[rowIndex].imageData.url"
                    @click="downloadImage"
            >
              <icon-file-download title="Download this image file."/>
            </button>
            <button role="button" class="more-menu icon-button"
                    id="moreMenu"
                    title="Open a panel of tools for: New Column, Audio Files, Learning Extras, ..."
            >
              <icon-dots title="Open a panel of tools for: New Column, Audio Files, Learning Extras, ..."/>
            </button>
          </div>
        </div>
        <drag-image-panel
          id="img"
          :panelType="itemHeaders[6]"
          :imageData="itemData[rowIndex].imageData"
          @updateLocation="updateLocationData"
        />
        <!-- TODO: add BubbleEditor -->
        <drag-text-panel
          id="txt"
          :panelType="itemHeaders[2]"
          :screenText="itemData[rowIndex].screenText"
          @updateLocation="updateLocationData"
        />
      </div>
    </div>
    <!-- <div class="bottom-row">
      <div class="panel-slide">
        <div style="padding: 10px;">Slide ID: A Type: Interactive Title: Info: modified from course ...</div>
      </div>
      <div class="panel-slide-thumbs">
        <button role="button" class="tall-button"
          title="Previous Panel"
          v-html="'<'"
          @click="goBack"
        ></button>
        <div
          v-for="(row, index) in itemData[0].dataRows"
          :key="index"
          @click="thumbClicked"
        >
          <div v-if="(index+1) === rowIndex"
            class="slide-thumb selected"
            title="Select Panel"
            :data-index="row"
          >
            {{ itemData[row].rowId }}
          </div>
          <div v-else class="slide-thumb"
            title="Select Panel"
            :data-index="row"
          >
            {{ itemData[row].rowId }}
          </div>
        </div>
        <button role="button" class="tall-button"
          title="Next Panel"
          v-html="'>'"
          @click="goForward"
        ></button>
        <button role="button" class="tall-button wide-button"
          title="Add New Panel"
          v-html="'+'"
          @click="addPanel"
        ></button>
      </div>
    </div> -->
  </div>
</template>

<script>
import DragImagePanel from "./DragImagePanel.vue";
import DragTextPanel from "./DragTextPanel.vue";
import BubbleEditor from "./BubbleEditor.vue";
import Vue from 'vue';// for editorNode instance

export default {
  /**
   * Story Panel displays 1 row at a time
   * Drag and Resize Image, Drag ScreenText
   */
  name: "StoryPanel",
  components: {
    DragImagePanel,
    DragTextPanel,
    // BubbleEditor
  },
  props: {
    itemHeaders: {
      type: Array,
      default() {
        return []
      }
    },
    itemData: {
      type: Array,
      default() {
        return []
      }
    },
    tableView: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedSlide: 0,// Faked, type: 'slide'
      rowIndex: 0,// default itemData[rowIndex]
      layersVisible: false,
      editorNode: null,// append/remove to selectedCell
      cellType: null,// set at selectCell(), itemData.<property>
      textContent: '',// from editor update, updateChangedText(textContent, cellType);
      lastElement: null,// to remove status
      blankDataRow: {
        type: 'data',
        rowId: 'ID#',
        fullText: '',
        screenText: {
          text: '<p></p>',
          color: '',
          location: {top: 0, left: 0}// StoryPanel layout
        },
        textPresentation: '',
        imageDescription: '',
        imagePresentation: '',
        imageData: {
          url: '',// 'images/cookies.png',
          location: {'top': 0, 'left': 0, 'width': 320, 'height': 180}// StoryPanel layout
        }
      },
    }
  },
  mounted() {
    this.$nextTick(function () {
      let comp = this;// scope for addEventListener

      // additional icon ideas
      // image column can have a icon-video = Filmstrip.vue; preview modal w/ controls
      // Waveform.vue; audio icon Audio repository?
      // LinkVariant.vue; add link to text?
      // draw on Screen Layout canvas and save as image. icon LeadPencil.vue;

      // create an editor node to append to selected cell
      // could be done in the template?
      let editorInstance = Vue.extend(BubbleEditor);
      this.editorNode = new editorInstance({
        // propsData: { value: '<p>nada node</p>'}
      });

      this.editorNode.$mount();

      // also happens on icon click
      this.editorNode.editor.on('blur', function() {
          console.log('editor blur txt:', comp.textContent, 'key:', comp.cellType);
          console.log('editor blur lastElement:', comp.lastElement);
          // MAY need to update text through here
          // also happens on icon click, but textContent not set yet
          // AT selectCell() - comp.updateChangedText(comp.textContent, comp.cellType);

          // clicked in same panel outside of editor
          // // udate text, show the original and remove the editor
          if (comp.textContent && comp.cellType) {
            comp.updateChangedText(comp.textContent, comp.cellType);
            // console.log('-- blur childNodes:', comp.lastElement.childNodes, comp.lastElement);
            // comp.lastElement.childNodes[0].style.display = 'block';
            // comp.lastElement.childNodes[1].remove();
            // comp.lastElement.setAttribute('data-status', '');
            comp.removeEditor();
          }
      });

      // Fires every keystroke and when menububble icon is clicked
      this.editorNode.$on('hasUpdates', function(txt, key) {
        console.log('mounted hasUpdates', txt, key);
        // key = cellType set at selectCell
        comp.textContent = txt;// update global
      });

      // console.log('mounted:', this.editorNode);
    });
  },
  watch: {
    itemData: {
    immediate: true,
      handler(newData) {
        console.log('--- watch panel itemData', newData);
        // this.$forceUpdate();
      }
    }
  },
  methods: {
    selectCell: function(cell) {
      console.log('selectCell: path', cell.path);
      // StoryPanel rowId and fullText do not use editor Eventually screenText will be
      // you have to select the text twice

      let key = this.cellType;// null or last cellType for updateChangedText()
      // click can happen on the text or editor or icon
      let element = cell.path.find((el) => {
        return el.classList.contains('inner-text');
      });

      // this.cellType = element.getAttribute('data-type');

      if (element.getAttribute('data-status') === 'active') {
        console.log('same cell so return if nodeName:', cell.target.nodeName);
        if (cell.target.nodeName === 'DIV') {
          console.log('DIV:', cell.target);
          // clicked in same panel outside of editor
          // udate text, show the original and remove the editor
          if (this.textContent && this.cellType) {
            this.updateChangedText(this.textContent, this.cellType);
          }
          console.log('FIX childNodes:', this.lastElement.childNodes, this.lastElement);
          this.removeEditor();
          // this.lastElement.setAttribute('data-status', '');
          // this.lastElement.childNodes[0].style.display = 'block';
          // this.lastElement.childNodes[1].remove();
        }
        return;
      }

      if (key && this.textContent) {
        // remove status from element and show updated text
        console.log('update lastElement:', key, this.lastElement);
        this.lastElement.setAttribute('data-status', '');
        this.lastElement.childNodes[0].style.display = 'block';
        // save last change before starting a new editor
        this.updateChangedText(this.textContent, key);
        this.key = this.cellType = this.textContent = '';// reset?
      }

      // loop thru possible and remove active status and childNodes[0].style.display none?
      this.removeEditor();
      // let group = document.querySelectorAll('.inner-text');
      // group.forEach(function(el) {
      //   console.log('group el:', el);
      //   el.setAttribute('data-status', '');
      //   el.childNodes[0].style.display = 'block';// un-hide always
      //   if (el.childNodes.length > 1) {
      //     el.childNodes[1].remove();
      //   }
      // });

      element.setAttribute('data-status', 'active');
      this.lastElement = element;// to remove status
      this.cellType = element.getAttribute('data-type');

      console.log('parent:', element.parentElement);
      console.log('element:', element);
      console.log('cellType:', this.cellType);

      // element.parentElement.setAttribute('data-status', 'selected');
      // element.classList.add('cell-selected');
      this.$root.selectedRowId = this.rowIndex;// StoryBoard.repoImageSelected

      if (element.childNodes) {
        // hide or remove childNodes
        if (element.childNodes.length) {
          console.log('element childNodes:', element.childNodes);
          // element.childNodes[0].remove();
          element.childNodes[0].style.display = 'none';
        }

        // switch on cellType to match data.property
        switch (this.cellType) {
          // case 'rowId': break;// plain input
          // case 'fullText': break;// plain textarea
          // TODO: EVENTUALLY
          // case 'screenText':
          //   this.editorNode.editor.setContent(this.itemData[this.rowIndex].screenText.text, false);
          //   this.editorNode.value = this.itemData[this.rowIndex].screenText.text;
          //   break;
          case 'textPresentation':
            this.editorNode.editor.setContent(this.itemData[this.rowIndex].textPresentation, false);
            this.editorNode.value = this.itemData[this.rowIndex].textPresentation;
            break;
          case 'imageDescription':
            this.editorNode.editor.setContent(this.itemData[this.rowIndex].imageDescription, false);
            this.editorNode.value = this.itemData[this.rowIndex].imageDescription;
            break;
          case 'imagePresentation':
            this.editorNode.editor.setContent(this.itemData[this.rowIndex].imagePresentation, false);
            this.editorNode.value = this.itemData[this.rowIndex].imagePresentation;
            break;
        }

        console.log('attach editorNode:', this.editorNode);
        // append the editor created at mounted to this cell
        element.appendChild(this.editorNode.$el);
        this.editorNode.$el.id = this.cellType;
        this.editorNode.editor.focus();
      }
    },
    /**
     * loop thru divs that could have the editor and
     * remove the active status, display childNodes[0] and
     * remove the editor
     */
    removeEditor: function() {
      let group = document.querySelectorAll('.inner-text');
      group.forEach(function(el) {
        // console.log('group el:', el);
        el.setAttribute('data-status', '');
        el.childNodes[0].style.display = 'block';
        if (el.childNodes.length > 1) {
          el.childNodes[1].remove();
        }
      });
    },
    goBack: function () {
      if (this.rowIndex > -1) {
        this.rowIndex--;
        this.$root.selectedRowId = this.rowIndex;
      }
    },
    goForward: function () {
      if (this.rowIndex < this.itemData[0].dataRows.length) {
        this.rowIndex++;
        this.$root.selectedRowId = this.rowIndex;
      }
    },
    thumbClicked: function (event) {
      console.log('thumbClicked:', event.target.getAttribute('data-index'), this.itemData[0].dataRows);
      this.rowIndex = parseInt(event.target.getAttribute('data-index'));
      this.$root.selectedRowId = this.rowIndex;
    },
    /**
     * Add a new row to itemData
     */
    addPanel: function () {
      // add a new row to end of slide group
      if (!this.$root.selectedRowId) {
        this.$root.selectedRowId = this.rowIndex;// = 2;// Faked
      }
      if (this.$root.selectedRowId) {
        this.itemData.splice(this.rowIndex + 1, 0, this.blankDataRow);
        // todo: Fix dataRows: [1,3,2,4] w/ forEach to renumber them
        this.itemData[this.selectedSlide].dataRows.splice(this.rowIndex + 1, 0, this.rowIndex + 1);
        // this.itemData[this.selectedSlide].dataRows.push(this.itemData[this.selectedSlide].dataRows.length+1);// faked
        console.log('addPanel:', this.itemData[this.selectedSlide].dataRows);
        // switch to new panel
        this.rowIndex +=1;
      } //else {console.log('selectedRowId not set');}
    },
    /**
     * Drag Panel has moved or resized
     * @param location is only used for Story Panel Image and ScreenText layout
     * @param type img=imageData or txt=screenText
     */
    updateLocationData: function (location, type) {
      if (type === 'img') {
        Object.assign(this.itemData[this.rowIndex].imageData.location, location);
      }
      if (type === 'txt') {
        // screenText.location:{top, left}
        Object.assign(this.itemData[this.rowIndex].screenText.location, location);
      }
      console.log('updateData:', type, 'location:', location.top, location.left, location.width, location.height);
    },
    /**
     * fires on every keystroke
     * Mark the data as dirty, to indicate the data needs to be saved
     *
     * @param txt String updated html
     * @param key String bubble-editor id
     */
    updateChangedText: function (txt, key) {
      this.$root.selectedRowId = this.rowIndex;
      console.log('updateChangedText:', txt, key);
      if (!txt) { console.log('txt is empty'); return; }

      switch (key) {
        case 'rowId':
          this.itemData[this.rowIndex].rowId = txt;
          break;
        case 'fullText':
          this.itemData[this.rowIndex].fullText = txt;
          break;
        case 'screenText':
          this.itemData[this.rowIndex].screenText.text = txt;
          break;
        case 'textPresentation':
          this.itemData[this.rowIndex].textPresentation = txt;
          break;
        case 'imageDescription':
          this.itemData[this.rowIndex].imageDescription = txt;
          break;
        case 'imagePresentation':
          this.itemData[this.rowIndex].imagePresentation = txt;
          break;
      }
      // reset txt only, cellType may get set immediately
      this.textContent = '';
      // this.$emit('updateItemData', this.itemData[this.rowIndex], this.rowIndex, 'panel');
      // console.log('Panel: itemData:', this.itemData[this.rowIndex]);
    },
    // Already models the itemData[]
    updateTextArea: function (evt) {
      this.$root.selectedRowId = this.rowIndex;
      // InputEvent.data, evt.target.name
      console.log('updateTextArea:', evt.data, evt.target.name);
      // console.log('evt.target. ???', document.querySelector(''));
    },
    /**
     * open file browser and upload to Filepond
     * update imageData.url
     */
    uploadImage: function () {
      console.log('Upload clicked:', this.itemData[this.rowIndex].imageData);
    },
    /**
     * remove from table and update data
     */
    removeImage: function () {
      if (this.itemData[this.rowIndex].imageData.url) {
        console.log('Remove image from data');
        this.itemData[this.rowIndex].imageData.url = '';
      }
    },
    /**
     * download image file
     */
    downloadImage: function () {
      console.log('Download: ', this.itemData[this.rowIndex].imageData.url);
    },
    /**
     * Add multiple ScreenText?
     */
    addScreenText: function () {
      console.log('Add new ScreenText?');
    },
    /**
     * Onion Skin: (All layers?)
     * use image.location to size them. if this is the bottom layer, append ?
     */
    toggleLayers: function () {
      // if on then off
      this.layersVisible = !this.layersVisible;
    }
  }
}
</script>

<style scoped>
.story-panel {
  font-size: 16px;
}

.panel-row {
  display: flex;
  width: 100%;
  height: fit-content;
  /* margin-bottom: 5px; */
}

.panel-header {
  display: flex;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
  padding: 3px;
  /* background-color: #d3d3d3; */
}

.top-row {
  height: 85px;
}

.middle-row {
  height: fit-content;
}

.bottom-row {
  width: 100%;
  height: 80px;
}

.id-cell {
  width: 10%;
  font-weight: 600;
  border: 1px solid #000000;
  background-color: #ffffff;
}
.row-id-input {
  padding: 5px 0 0 5px;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-weight: 600;
}
.cue-cell {
  width: 90%;
  margin-left: 1%;
  border: 1px solid #000000;
  background-color: #ffffff;
}

.panel-column-left {
  width: 30%;
  /*border: 1px solid green;*/
}

.panel-text {
  min-height: 21.5vh;
  margin: 0 0 5px 0;
  border: 1px solid #000000;
  background-color: #ffffff;
}

.inner-text {
  padding: 10px;
  min-height: 17vh;
}

.pad-left {
  padding-left: 5px;
}

textarea {
  font-family: 'Arimo', Helvetica, Arial, sans-serif; /* Segoe for Spanish? */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  margin: 3px;
  border: none;
  resize: none;
  width: 97%;
  height: 85%;
}

.panel-column-right {
  /* width: 69%; */
  /* position: relative; */
  width: 98vw;
  height: 90vh;
  margin-left: 1%;
  overflow: hidden;
  border: 1px solid #ff0000;
  /* background-color: #ffffff; */
}

.panel-slide {
  font-weight: 600;
  border: 1px solid #666666;
  background-color: #ffffff;
}

.panel-slide-thumbs {
  display: flex;
  border: 1px solid #666666;
  background-color: #ffffff;
}

.tall-button {
  line-height: 20px;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
}
.wide-button {
  width: 40px;
  margin-left: 5px;
  border: 1px solid #333333;
  background-color: #b4dbb4;
}
.wide-button:hover {
  background-color: #a1d9a1;
}

.slide-thumb {
  cursor: pointer;
  padding: 0 10px;
  font-weight: 600;
  text-align: center;
  line-height: 4vh;
  user-select: none;
  border: 1px solid #666666;
  background-color: #cccccc;
}

.selected {
  border-color: #000000;
  background-color: #ffffff;
}

.image-buttons {
  display: flex;
  width: 80%;
}

.image-buttons button {
  margin: 0 auto;
}

.image-layers {
  position: absolute;
  top: 30px;
  left: 0;
  width: 97%;
}

.layers {
  opacity: 0.5;
  max-width: 100%;
  max-height: 100%;
}

.icon-button {
  margin: 0 auto;
  padding: 0 8px;
  cursor: pointer;
  font-size: 18px;
  color: #333333;
  border-radius: 2px;
  border: 1px solid  #000000;
  background-color: #efefef;
}
</style>
