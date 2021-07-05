<template>
  <div class="builder-toolbar">
    <div class="editor-header">
        <div class="image-buttons"
            v-show="headerVisible"
        >
            <button role="button" class="icon-button"
                title="View image layers"
                @click="toggleLayers"
            >
                <icon-eye title="View image layers"/>
            </button>
            <button role="button" class="icon-button"
                    title="Upload an image. It will also be added to the repository."
                    @click="uploadImage"
            >
                <icon-upload-cloud title="Upload an image. It will also be added to the repository."/>
            </button>
            <button role="button" class="icon-button"
                    title="Download this image file."
                    @click="downloadImage"
            >
                <icon-file-download title="Download this image file."/>
            </button>
            <button role="button" class="icon-button"
                    title="Remove this image from row."
                    @click="removeImage"
            >
                <icon-delete title="Remove this image from row."/>
            </button>
            <button role="button" class="icon-button"
                    title="Search for images in repository"
                    @click="$emit('toggleRepo')"
            >
                <icon-cloud-search title="Search for images in repository"/>
            </button>
        </div>
        <div class="file-buttons">
            <button role="button" class="icon-button"
                title="Save data to JSON file"
                @click="$emit('saveFile')"
            >
                <icon-save-file title="Save data to JSON file"/>
            </button>
            <button role="button" class="more-menu icon-button"
                    id="moreMenu"
                    title="Open a panel of tools for: New Column, Audio Files, Learning Extras, ..."
                    @click="moreMenuModal"
            >
                <icon-dots title="Open a panel of tools for: New Column, Audio Files, Learning Extras, ..."/>
            </button>
            <button role="button" class="icon-button"
                title="Edit Data"
                @click="editCurrentData"
            >
                <icon-file-edit title="Edit Data"/>
            </button>
        </div>
    </div>
  </div>
</template>

<script>
import BubbleEditor from "./BubbleEditor.vue";
import Vue from 'vue';// for editorNode instance

export default {
  /**
   * Edit Panel displays icons to edit currently active
   * Drag and Resize Image, Drag ScreenText
   */
  name: "BuilderToolbar",
  // components: {
  //   // BubbleEditor
  // },
  props: {
    sceneVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      headerVisible: true,// toggle editor?
      contentVisible: false,// drag image and text
      selectedSlide: 0,// Faked, type: 'slide'
      // rawData
      rowIndex: 0,// itemData[rowIndex] = IntroContent[lang] or SceneData.cueData[rowIndex]
      layersVisible: false,
      editorNode: null,// append/remove to selectedCell
      cellType: null,// set at selectCell(), itemData.<property>
      textContent: '',// from editor update, updateChangedText(textContent, cellType);
      lastElement: null,// to remove status
      // blankCueData: {},
      blankDataRow: {
        type: 'data',
        rowId: 'ID#',
        fullText: '',
        screenText: {
          text: '<p></p>',
          color: '',
          location: {top: 0, left: 0}
        },
        textPresentation: '',
        imageDescription: '',
        imagePresentation: '',
        imageData: {
          url: '',// 'images/cookies.png',
          location: {'top': 0, 'left': 0, 'width': 320, 'height': 180}
        }
      },
    }
  },
  mounted() {
    this.$nextTick(function () {
      let comp = this;// scope for addEventListener

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
    sceneVisible: {
      immediate: true,
      handler(newstate) {
        if (newstate) {
          console.log('-- watch editPanel sceneVisible:', newstate);
          // show image and text panels?
          // this.contentVisible = newstate;// true
        }
      }
    },
  },
  methods: {
    toggleEditor: function() {
        // show/hide editor buttons and content
        console.log('toggleEditor:', this.sceneVisible);
        this.headerVisible = !this.headerVisible;
        if (this.sceneVisible && this.headerVisible) {
            this.contentVisible = true;
        } else {
            this.contentVisible = false;// ternian
        }
    },
    // 
    moreMenuModal: function() {
      console.log('More Menu: open modal here?')
    },
    // Edit Data btn opens dialog to edit the currentData
    editCurrentData: function() {
      console.log('editCurrentData:');//, this.itemData);
      this.$emit('editCurrentData');
    },
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
            // this.editorNode.editor.setContent(this.itemData[this.rowIndex].textPresentation, false);
            // this.editorNode.value = this.itemData[this.rowIndex].textPresentation;
            break;
          case 'imageDescription':
            // this.editorNode.editor.setContent(this.itemData[this.rowIndex].imageDescription, false);
            // this.editorNode.value = this.itemData[this.rowIndex].imageDescription;
            break;
          case 'imagePresentation':
            // this.editorNode.editor.setContent(this.itemData[this.rowIndex].imagePresentation, false);
            // this.editorNode.value = this.itemData[this.rowIndex].imagePresentation;
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
    /**
     * Add a new row to itemData
     */
    addPanel: function () {
      // add a new row to end of slide group
      if (!this.$root.selectedRowId) {
        this.$root.selectedRowId = this.rowIndex;// = 2;// Faked
      }
      if (this.$root.selectedRowId) {
        // this.itemData.splice(this.rowIndex + 1, 0, this.blankDataRow);
        // todo: Fix dataRows: [1,3,2,4] w/ forEach to renumber them
        // this.itemData[this.selectedSlide].dataRows.splice(this.rowIndex + 1, 0, this.rowIndex + 1);
        //X this.itemData[this.selectedSlide].dataRows.push(this.itemData[this.selectedSlide].dataRows.length+1);// faked
        console.log('addPanel:');//, this.itemData[this.selectedSlide].dataRows);
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
      // if (type === 'img') {
      //   Object.assign(this.itemData[this.rowIndex].imageData.location, location);
      // }
      // if (type === 'txt') {
      //   // screenText.location:{top, left}
      //   Object.assign(this.itemData[this.rowIndex].screenText.location, location);
      // }
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

      // switch (key) {
      //   case 'rowId':
      //     this.itemData[this.rowIndex].rowId = txt;
      //     break;
      //   case 'fullText':
      //     this.itemData[this.rowIndex].fullText = txt;
      //     break;
      //   case 'screenText':
      //     this.itemData[this.rowIndex].screenText.text = txt;
      //     break;
      //   case 'textPresentation':
      //     this.itemData[this.rowIndex].textPresentation = txt;
      //     break;
      //   case 'imageDescription':
      //     this.itemData[this.rowIndex].imageDescription = txt;
      //     break;
      //   case 'imagePresentation':
      //     this.itemData[this.rowIndex].imagePresentation = txt;
      //     break;
      // }
      // reset txt only, cellType may get set immediately
      this.textContent = '';
      //this.$emit('updateItemData', this.itemData[this.rowIndex], this.rowIndex, 'panel');
      console.log('Panel: itemData:');//, this.itemData[this.rowIndex]);
    },
    // Already models the itemData[]
    updateTextArea: function (evt) {
      this.$root.selectedRowId = this.rowIndex;
      // InputEvent.data, evt.target.name
      console.log('updateTextArea:');//, evt.data, evt.target.name);
      // console.log('evt.target. ???', document.querySelector(''));
    },
    /**
     * open file browser and upload to Filepond
     * update imageData.url
     */
    uploadImage: function () {
      console.log('Upload clicked:');//, this.itemData[this.rowIndex].imageData);
    },
    /**
     * remove from table and update data
     */
    removeImage: function () {
      // if (this.itemData[this.rowIndex].imageData.url) {
         console.log('Remove image from itemData');
      //   //this.itemData[this.rowIndex].imageData.url = '';
      // }
    },
    /**
     * download image file
     */
    downloadImage: function () {
      console.log('Download: ');//, this.itemData[this.rowIndex].imageData.url);
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
      console.log('layersVisible:', this.layersVisible);
    }
  }
}
</script>

<style scoped>
.builder-toolbar {
  font-size: 16px;
  padding: 5px;
}

.panel-row {
  display: flex;
  width: 100%;
  height: fit-content;
  /* margin-bottom: 5px; */
}

.editor-header {
  display: flex;
  font-size: 12px;
  font-weight: 600;
  color: #666666;
  padding: 3px;
  /* background-color: #d3d3d3; */
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

.editor-content {
  /* position: relative; */
  width: 98vw;
  height: 90vh;
  overflow: hidden;
  border: 1px solid #ff0000;
  /* background-color: #ffffff; */
}

  .tall-button {
    line-height: 20px;
    font-size: 20px;
    font-weight: 800;
    cursor: pointer;
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
  width: 20%;
}
.file-buttons {
  width: 10%;
  display: flex;
  margin-left: 5%;
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
.icon-button:hover {
  background-color: #ccf1cc;
}
</style>
