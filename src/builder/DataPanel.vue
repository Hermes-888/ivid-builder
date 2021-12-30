<template>
    <div class="data-panel"
      v-show="panelOpen"
    >
      <div class="data-buttons">
        <button role="button" id="all"
          class="btn btn-sm btn-default"
          @click="changeData"
        >
          All Data
        </button>
        <button role="button" id="introData"
          class="btn btn-sm btn-default"
          @click="changeData"
        >
          Intro Data
        </button>
        <button role="button" id="sceneData"
          class="btn btn-sm btn-default"
          @click="changeData"
        >
          Scene Data
        </button>
        <button role="button" id="cueData"
          class="btn btn-sm btn-default"
          @click="changeData"
        >
          Cue Data
        </button>
        <button role="button" id="cueData0"
          class="btn btn-sm btn-default"
          @click="changeData"
        >
          <button @click="incCueNum(-1)">-</button>
          Cue Data[{{cueNum}}]
          <button @click="incCueNum(+1)">+</button>
        </button>
        <button role="button" id="sceneData"
          class="btn btn-sm btn-default"
          @click="panelOpen = false"
        >
          Close
        </button>
      </div>
      <div class="data-buttons">
        <div class="bordered"></div>
        <div class="data-label" v-text="objectName"></div>
      </div>
      <div>
        <json-editor
          v-if="modeled"
          :key="key"
          :formData="modeled"
        />
      </div>
    </div>
</template>

<script>
/**
 * filtered data w/ buttons
 */
// import rawdata from '../../public/slidedata.json';
import Button from '../components/Button.vue';
import JsonEditor from './json-editor.vue';

export default {
    name: "DataPanel",
    components: {
      JsonEditor,
      Button
    },
    props: {
      allData: {
        type: [Object, Array],
        default: null
      }
    },
    data () {
        return {
          key: 1,// force re-render
          panelOpen: true,// hide/show DataPanel
          language: 0,// 1=spanish
          objectName: '',// Cue Data
          modeled: null,// display data on panel
          sceneNum: 0,
          cueNum: 0,// to max
          cueData: null
        }
    },
    mounted () {
      this.$nextTick(() => {
        // console.log('allData:', this.allData);
        // this.cueData = allData.sceneLanguage[this.language].sceneData[this.sceneNum].cueData;
        // this.$root.$on('repoImageSelected', function(filename) {
        //   console.log('-repoImageSelected', filename);
        //   this.modeled.find();
        // });
      });
    },
    watch: {
      allData: {
        immediate: true,
        handler(newstate, oldstate) {
          if (newstate.hasOwnProperty('introLanguage')) {
            console.log('allData:', newstate);
            this.cueData = this.allData.sceneLanguage[this.language].sceneData[this.sceneNum].cueData;
            // this.key +=1;// force re-render
          }
        }
      }
    },
    methods: {
      changeData: function(btn) {
        console.log(btn.target.id);
        switch(btn.target.id) {
          case 'all':
            this.objectName = 'All allData';
            this.modeled = this.allData;
            break;
          case 'introData':
            this.objectName = 'Introduction data';
            this.modeled = this.allData.introLanguage[this.language];
            break;
          case 'sceneData':
            this.objectName = 'Scene Data';
            this.modeled = this.allData.sceneLanguage[this.language].sceneData;
            break;
          case 'cueData':
            this.objectName = 'Scene Cue Data';
            this.modeled = this.cueData;
            break;
          case 'cueData0':
            this.objectName = 'Cue Data';
            this.modeled = this.cueData[this.cueNum];
            break;
        }
        this.key += 1;// force re-render
      },
      incCueNum: function(num) {
        console.log('inCueNum:', num);
        this.cueNum += num;
        if (this.cueNum < 0) { this.cueNum = this.cueData.length-1; }
        if (this.cueNum === this.cueData.length) { this.cueNum = 0; }
        this.modeled = this.cueData[this.cueNum];
        this.key +=1;// force re-render
      }
    }
}
</script>

<style scoped>
    .data-panel {
      position: absolute;
      top: 8vh;
      left: 5vh;
      width: 50vw;
      height: 80vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
      padding: 10px;
      border: 2px solid #333333;
      background-color: rgba(255, 255, 255, 0.801);
    }
    .data-buttons {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    .data-display {
      flex-direction: column;
    }
    .bordered {
      margin-top: 5px;
      border: 1px solid #808080;
    }
    .data-label {
      text-align: left;
      font-weight: bold;
    }
</style>
