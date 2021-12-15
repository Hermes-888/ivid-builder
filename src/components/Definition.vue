<template>
  <div class="definition-box">
    <div class="title"
      v-show="textTitle"
      v-text="textTitle"
    >
    </div>
    <div class="definition"
         v-html="textBlock"
    ></div>
  </div>
</template>

<script>
/**
 * display a block of text
 */
export default {
  name: 'Scene',
  components: {},
  props: {
    textTitle: {
      type: String,
      default: ''
    },
    textBlock: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.definition-box {
  width: 43%;
  min-height: 14vh;
  margin: 0 1.5% 3% 1.5%;
  padding: 10px;
  text-align: left;
  border-radius: 12px;
  border: 3px solid #333333;
  background-color: #ffffff;
}
.title {
  font-weight: 600;
}
.definition-completed {
  background-color: #f0ecc9;
  border-color: #808080;
}

/* Laptop tablet landscape 1366x768 */
/* @media (max-width: 1380px) {} */
/* iPhone 12 532 x 1,170 px */
@media (max-width: 1170px) and (max-height: 532px) {
  .definition-box {
    margin: 0 1.5% 1.5% 1.5%;
  }
}

@media (max-width: 830px) and (max-height: 420px) {
  .definition-box {
    width: 44%;
    min-height: 18vh;
    margin: 0 1% 2% 1%;
    padding: 6px;
    font-size: smaller;
    border-width: 2px;
  }
}
/* tablet portrait */
@media (max-width: 768px) and (max-height: 1024px) {
  .definition-box {
    width: 42%;
    margin: 0 1% 2% 1%;
  }
}
@media (max-width: 740px) and (max-height: 420px) {
  .definition-box {
    width: 45%;
    margin: 0 .5% 1% .5%;
  }
}
@media (max-width: 670px) and (max-height: 420px) {
  .definition-box {
    width: 44%;
    min-height: 19vh;
  }
}
@media (max-width: 570px) and (max-height: 340px) {
  .definition-box {
    width: 45%;
    border-width: 1px;
    margin: 0 .25% .5% .25%;
    font-size: 11px;
  }
}
</style>
