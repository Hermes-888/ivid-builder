<template>
	<div class="answer-button">
    <div class="answer-text"
      v-html="answerText"
    ></div>
		<!-- <span v-html="answerText"></span> -->
    <span class="answer-icon"
          v-if="answerIcon"
          @click="openImageModal"
    >
      {{answerIcon}}
    </span>
	</div>
</template>

<script>
	/**
	 * Drag Answer button can include an optional icon
	 * Answer click event is added and handled in the Scene
	 * ex: @click.native="answerSelected(answer)"
	 * 
	 * answerText can be html ex: Click <b>ME</b> now
	 */

	export default {
		name: 'DragAnswer',
		props: {
			answerText: {
				type: String,
				default: ''
			},
      answerIcon: {
				type: String,
        default: 'i'
      }
		},
    methods: {
      openImageModal: function() {
        let num = this.$el.getAttribute('data-id');
        this.$emit('openImageModal', num);
      }
    }
	}
</script>

<style>
	.answer-button {
    display: flex;
    justify-content: flex-start;
    touch-action: none;
		margin: 20px 0;
		padding: 8px;
		color: #333333;
		text-align: center;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: #ffffff;
		/*cursor: pointer;*/
	}

	.answer-button:hover {
		color: #000000;
		border-color: #000000;
    font-weight: 600;
	}

  .answer-disabled {
    touch-action: none;
    margin: 20px 0;
    padding: 8px;
    color: #eeeeee;
    /*text-align: center;*/
    border-radius: 8px;
    border: 3px solid #ababab;
    background-color: #808080;
  }

  .answer-text {
    width: 93%;
    padding-right: 5px;
  }
  .answer-icon {
    float: right;
    margin: auto;
    padding: 1px 4px;
    color: #ffffff;
    line-height: 16px;
    font-size: 16px;
    font-weight: 600;
    font-style: italic;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #006f7e;
    background-color: #17A2B8;
  }

  /* iPhone 12 532 x 1,170 px */
  @media (max-width: 1170px) and (max-height: 532px) {
    .answer-button {
      margin: 15px auto;
		}
    .answer-disabled {
      margin: 15px auto;
    }
  }
	/* @media (max-width: 1024px) and (max-height: 768px) {} */
  @media (max-width: 830px) and (max-height: 420px) {
		.answer-button {
			font-size: medium;
      margin: 10px auto;
      padding: 3px;
      border-width: 2px;
		}
    .answer-disabled {
      font-size: medium;
      margin: 10px auto;
      padding: 3px;
      border-width: 2px;
    }
    .answer-icon {
      padding: 1px 3px;
      line-height: 12px;
      font-size: 14px;
    }
	}
  @media (max-width: 670px) and (max-height: 340px) {
    .answer-button {
      font-size: unset;/* 14px */
      margin: 8px auto;
    }
    .answer-disabled {
      font-size: unset;
      margin: 8px auto;
    }
  }
  @media (max-width: 570px) and (max-height: 320px) {
    .answer-button {
      margin: 6px auto;
    }
    .answer-disabled {
      margin: 6px auto;
    }
  }

</style>
