<template>
	<div class="topics-box">
    <div class="topics-title"
      v-text="topicsTitle"
    ></div>
    <div class="topics-body">
      <div class="topics-subtitle"
        v-text="topicsSubtitle"
      ></div>
      <div class="topic"
        v-for="(topic, index) in topics"
        :key="index"
        :data-index="index"
      >
        <div v-if="!Array.isArray(topic)" class="topics-item item-bold">
          <span v-text="topic"></span>
        </div>
        <ul v-if="Array.isArray(topic)">
          <li class="topics-item">
            <span v-text="topic[0]"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
	/**
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	 */
	export default {
		name: 'TestTopics',
		props: {
      topicsTitle: {
        type: String,
				default: ''
      },
      topicsSubtitle: {
        type: String,
        default: ''
      },
      topics: {
        type: Array,
        default() {
					return []
				}
      }
    }
	}
</script>

<style scoped>
	.topics-box {
    position: absolute;
    top: 10%;
    left: 10%;
    width: auto;
    /* font-family: 'Times New Roman', Times, serif; */
    font-family: 'Arimo', Arial, Helvetica, sans-serif;
    font-weight: normal;
    color: #333333;
    border-radius: 8px;
    border: 5px solid #333333;
    background-color: rgba(255, 255, 255, 0.8);
  }
  .topics-title {
    padding: 10px 10px 5px 10px;
    font-weight: bold;
    border-bottom: 2px solid #888888;
  }
  .topics-subtitle {
    margin-bottom: 8px;
    font-size: smaller;
    text-align: left;
  }
  .topics-body {
    padding: 10px 15px;
    text-align: left;
  }
  .item-bold {
    font-weight: bold;
  }
  .topics-item {
    line-height: 12px;
  }

  /* Pixel2 iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 740px) and (max-height: 420px) {
    .topics-box {
      border-width: 3px;
    }
  }
  /* iPhone 5 SE*/
  @media (max-width: 570px) {
    .topics-title {
      padding: 5px 10px;
    }
    .topics-body {
      padding: 5px 10px;
    }
    .topic ul {
      margin: 5px 5px 0 0;
    }
  }
</style>
