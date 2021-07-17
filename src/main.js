import Vue from 'vue';
import App from './App.vue';

import Velocity from 'velocity-animate';// anime.js
// https://materialdesignicons.com/
// usage: <icon-upload-cloud title="tooltip text"/>
import 'vue-material-design-icons/styles.css';
import iconPalette from 'vue-material-design-icons/Palette.vue';
Vue.component('icon-palette', iconPalette);
import iconSave from 'vue-material-design-icons/ContentSaveOutline.vue';
Vue.component('icon-save', iconSave);// Not used yet
import iconEye from 'vue-material-design-icons/EyeOutline.vue';
Vue.component('icon-eye', iconEye);
import iconCloudSearch from 'vue-material-design-icons/CloudSearchOutline.vue';
Vue.component('icon-cloud-search', iconCloudSearch);
import iconUploadCloud from 'vue-material-design-icons/CloudUploadOutline.vue';
Vue.component('icon-upload-cloud', iconUploadCloud);
import iconDelete from 'vue-material-design-icons/TrashCanOutline.vue';
Vue.component('icon-delete', iconDelete);
import iconFileDownload from 'vue-material-design-icons/FileDownloadOutline.vue';
Vue.component('icon-file-download', iconFileDownload);
import iconClose from 'vue-material-design-icons/CloseCircleOutline.vue';
Vue.component('icon-close', iconClose);
import iconDots from 'vue-material-design-icons/DotsVertical.vue';
Vue.component('icon-dots', iconDots);

import iconCollapse from 'vue-material-design-icons/ArrowCollapseVertical.vue';
Vue.component('icon-collapse', iconCollapse);
import iconExpand from 'vue-material-design-icons/ArrowExpandVertical.vue';
Vue.component('icon-expand', iconExpand);

import iconFileEdit from 'vue-material-design-icons/FileDocumentEdit.vue';
Vue.component('icon-file-edit', iconFileEdit);
import iconSaveFile from 'vue-material-design-icons/ContentSaveOutline.vue';
Vue.component('icon-save-file', iconSaveFile);
import iconFileSearch from 'vue-material-design-icons/FileSearchOutline.vue';
Vue.component('icon-file-search', iconFileSearch);

// video player controls
import iconPlay from 'vue-material-design-icons/Play.vue';
Vue.component('icon-play', iconPlay);
import iconPause from 'vue-material-design-icons/Pause.vue';
Vue.component('icon-pause', iconPause);
import iconRewind from 'vue-material-design-icons/Rewind.vue';
Vue.component('icon-rewind', iconRewind);
import iconStepBack from 'vue-material-design-icons/StepBackward2.vue';
Vue.component('icon-step-back', iconStepBack);
import iconPlus from 'vue-material-design-icons/Plus.vue';
Vue.component('icon-plus', iconPlus);
import iconHideLayers from 'vue-material-design-icons/LayersOff.vue';
Vue.component('icon-hide-layers', iconHideLayers);

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
}).$mount('#app');
