<template>
	<div class="multi-choice">
		<div class="multi-container" ref="multicontainer">
			<div class="multi-question">
				<span v-html="mcData.questionText"></span>
			</div>
			<div class="multi-instructions"
				v-if="!showFeedback"
			>
				<span v-html="mcData.questionInstructions"></span>
			</div>
			<div class="multi-answer-container"
				v-if="!showFeedback"
			>
				<div class="multi-answer"
					v-for="(answer, index) in answers"
					:key="index"
					@click="answerSelected(answer)"
				>
					<div class="multi-item">
						<div class="answer-text"
							v-html="answer.answerText"
						></div>
						<div title="Play audio"
							v-if="answer.answerAudio"
							:data-file="answer.answerAudio"
							@click="answerAudio"
						>
							<svg width="24" height="24" viewBox="0 0 24 24"
								:data-file="answer.answerAudio"
								@click="answerAudio"
							>
								<path fill="#606060" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div class="multi-hint-container"
				v-show="!showFeedback"
			>
				<div class="multi-hint-button"
					v-show="!showHint"
					@click="hintClicked"
					:style="{
						color: mcData.hintButtonTextColor,
						backgroundColor: mcData.hintButtonBackgroundColor
					}"
				>
					<span v-text="mcData.hintButtonText"></span>
				</div>
				<div class="multi-hint-text"
					v-show="showHint"
				>
					<!-- <span>Hint: </span> -->
					<span v-html="mcData.hintText"></span>
				</div>
			</div>
			<div class="multi-feedback"
				v-if="showFeedback"
			>
				<div class="multi-feedback-text"
					v-html="selectedAnswer.feedbackText"
				></div>
				<Button
					:buttonText="'Continue'"
					@click.native="continueSelected"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	/**
	 * Multiple Choice question and answers
	 * pass audio paths upward to play them
	 *
	 * display a question w/audio
	 * answers is an array of objects that can be randomized
	 * answerText: '',
	 * answerAudio: '',// displays a speaker icon
	 * feedbackText: '',
	 * feedbackAudio: '',
	 *
			hintButtonText: 'Need a hint?',
			hintButtonTextColor: '',
			hintButtonBackgroundColor: '',
			hintText: 'E. coli bacteria naturally occur in meat products, like raw pork sausage.',
			hintAudio: 'audio/english/hint.mp3',
	 */
	import Button from "@/components/Button.vue";

	export default {
		name: 'MultiChoice',
		components: {
			Button
		},
		props: {
			mcData: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				showAnswers: true,
				showFeedback: false,
				showHint: false,
				answers: [],// to randomize
				selectedAnswer: null
			}
		},
		mounted() {
			this.answers = this.mcData.answers;
			if (this.mcData.randomizeAnswers) {
				this.answers = this.randomizeAnswers(this.answers);
			}
			if (this.mcData.backgroundColor) {
				this.$refs.multicontainer.style.backgroundColor = this.mcData.backgroundColor;
			}
			if (this.mcData.questionAudio) {
				this.$emit('playAudioFile', this.mcData.questionAudio);
			}
		},
		methods: {
			answerSelected: function(item) {
				this.selectedAnswer = item;
				this.showAnswers = false;
				this.showFeedback = true;

				if (item.feedbackAudio) {
					this.$emit('playAudioFile', item.feedbackAudio);
				}
			},
			continueSelected: function () {
				this.$emit('answerSelected', this.mcData);
			},
			hintClicked: function() {
				//console.log('hintClicked:');
				// show hintText
				if (this.mcData.hintText) {
					this.showHint = true;
				}
				if (this.mcData.hintAudio) {
					this.$emit('playAudioFile', this.mcData.hintAudio);
				}
			},
			// Speaker Icon can play the answerAudio without selecting the answer it is attached to
			answerAudio: function(e) {
				e.preventDefault();
				e.stopPropagation();
				var filename = e.target.getAttribute('data-file');
				if (!filename) {
					filename = e.target.parentNode.getAttribute('data-file');
				}
				if (filename) {
					this.$emit('playAudioFile', filename);
				}
			},
			/**
			 * randomize answers and return them
			 * make sure they are not in the original sequence
			 * this.mcData.answers = this.randomizeAnswers(this.mcData.answers);
			 */
			randomizeAnswers: function(array) {
				var sequence = JSON.stringify(array);
				var nuSequence = this.randomizeArray(array);

				while (JSON.stringify(nuSequence) === sequence) {
					nuSequence = this.randomizeArray(nuSequence);
				}
				return nuSequence;
			},
			randomizeArray: function(array) {
				var i = array.length;
				var ri = 0;
				while (i--) {
					ri = Math.floor(Math.random() * (i + 1));
					[array[i], array[ri]] = [array[ri], array[i]];
				}
				i = array.length;// twice creates a better result
				while (i--) {
					ri = Math.floor(Math.random() * (i + 1));
					[array[i], array[ri]] = [array[ri], array[i]];
				}
				return array;
			},
		}
	}
</script>

<style scoped>
	.multi-choice {
		position: absolute;
		top: 0;
		width: 99%;
	}
	.multi-container {
		width: 60%;
		margin: 0 auto;
		padding: 20px;
		border-radius: 12px;
		border: 3px solid #333333;
		background-color: rgba(255, 255, 255, 0.8);
	}
	.multi-question {
		font-size: larger;
		font-weight: 600;
		text-align: center;
		padding-bottom: 10px;
	}
	.multi-instructions {
		text-align: center;
		padding: 5px 0;
	}
	.multi-hint-text {
		padding: 5px 0;
		border-top: 2px solid #333333;
	}
	.multi-hint-button {
		padding: 5px 10px;
		margin: 5px auto;
		width: fit-content;
		color: #4c4c4c;
		font-size: smaller;
		font-weight: 600;
		text-align: center;
		text-transform: uppercase;
		border-radius: 8px;
		border: 1px solid #333333;
		background-color: #ffffff;
		cursor: pointer;
	}

	.multi-hint-button:hover {
		color: #000000;
		border: 2px solid #000000;
		background-color: #efffef;
	}
	.multi-answer-container {
		display: flex;
		flex-direction: column;
	}
	.multi-answer {
		width: 95%;
		margin: 0 auto;
		text-align: center;
	}
	.multi-item {
		display: flex;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 8px;
		border: 1px solid #333333;
		background-color: #ffffff;
		cursor: pointer;
	}
	.multi-item:hover {
		border: 2px solid #000000;
		background-color: #efffef;
	}
	.multi-feedback {
		padding: 20px;
		border-radius: 8px;
		border: 2px solid #333333;
		background-color: #ffffff;
	}
	.multi-feedback-text {
		width: 100%;
		padding-bottom: 10px;
	}
	.answer-text {
		width: 99%;
	}

	/* iPhone 12 532 x 1,170 px */
	@media (max-width: 1170px) and (max-height: 532px) {
		.multi-container {
			width: 70%;
			margin-top: -65px;
		}
		.multi-answer {
			width: 90%;
		}
	}
	/* tablet landscape */
	@media (max-width: 1024px) and (min-height: 740px) and (max-height: 768px) {
		.multi-container {
			width: 80%;
			margin-top: -50px;
		}
		.multi-answer {
			width: 90%;
		}
	}
	/* Pixel2 XL */
	@media (max-width: 830px) and (max-height: 420px) {
		.multi-container {
			width: 80%;
			margin-top: -5%;
			padding: 5px;
		}
		.multi-item {
			margin-bottom: 10px;
			padding: 5px;
		}
	}
	/* tablet portrait */
	@media (max-width: 768px) and (min-height: 1000px) and (max-height: 1024px) {
		.multi-container {
			width: 80%;
			padding: 15px;
			margin-top: 25%;
		}
		.multi-answer {
			width: 90%;
		}
	}
	/* Pixel2 iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 740px) and (max-height: 420px) {
		.multi-container {
			width: 90%;
			margin-top: -8%;
			padding: 5px;
			border-width: 2px;
		}
		.multi-feedback {
			border-width: 2px;
			padding: 10px;
		}
		.answer-text {
			font-size: larger;
		}
		.multi-feedback-text {
			font-size: large;
		}
	}

	@media (max-width: 670px) {
		.multi-container {
			width: 90%;
			margin-top: -8%;
			border-width: 2px;
		}
		.multi-question {
			padding-bottom: 0;
		}
		.multi-item {
			margin-bottom: 5px;
		}
	}
	@media (max-width: 570px) {
		.multi-container {
			margin-top: -10%;
		}
		.answer-text {
			font-size: unset;
		}
	}
</style>
