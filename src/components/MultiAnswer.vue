<template>
	<div class="multiple-answer">
		<div class="multi-question">
			<span v-html="mcData.questionText"></span>
		</div>
		<div class="multi-answer-container"
			v-if="showAnswers"
		>
			<div class="multi-answer"
				v-for="(answer, index) in answers"
				:key="index"
			>
				<div class="multi-item">
					<input type="checkbox" :id="'ck'+index">
					<label :for="'ck'+index">
						<span v-text="answer.answerText"></span>
					</label>
					<div class="audio-button"
							title="Play audio"
							:data-file="answer.answerAudio"
							@click="answerAudio"
					>
						<svg width="24" height="24" viewBox="0 0 24 24"
							:data-file="answer.answerAudio"
							@click="answerAudio"
						>
							<path fill="#606060" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
						</svg>
					</div>
				</div>
			</div>
			<div class="submit"
				v-if="!showFeedback"
			>
				<Button
					:buttonText="'Submit My Answers'"
					@click.native="checkAnswers"
				/>
			</div>
		</div>
		<div class="multi-feedback"
			title="Click to close feedback"
			v-if="showFeedback"
		>
			<span v-html="feedbackText"></span>
		</div>
	</div>
</template>

<script>
	/**
	 * Multiple Choice question and answers
	 * pass in the audio file, volume and playback
	 *
	 * display a question w/audio
	 * answers is an array of objects that can be randomized
	 * answerText: '',
	 * answerAudio: '',
	 * feedbackText: '',
	 * feedbackAudio: '',
	 * ToDo: add hint like MultiChoice
	 */
	import Button from "@/components/Button.vue";

	export default {
		name: 'MultiAnswer',
		components: {
			Button
		},
		props: {
			mcData: {
				type: Object,
				default() {
					return {};
				}
			},
			audioVolume: {
				type: Number,
				required: false,
				default: 1
			},
			audioPlaybackRate: {
				type: Number,
				required: false,
				default: 1
			}
		},
		data() {
			return {
				showAnswers: true,
				showFeedback: false,
				isFeedback: false,
				feedbackText: '',// set correct/wrong at checkAnswers
				answers: [],// to randomize
				audioPlayer: null
			}
		},
		mounted() {
			// player for QuestionAudio and FeedbackAudio
			this.audioPlayer = document.createElement('audio');
			this.audioPlayer.setAttribute('id', 'multi-audio');
			this.audioPlayer.setAttribute('crossorigin', 'anonymous');
			this.audioPlayer.addEventListener('ended', this.audioEnded);

			this.answers = this.mcData.answers;
			if (this.mcData.randomizeAnswers) {
				this.answers = this.randomizeAnswers(this.answers);
			}

			if (this.mcData.questionAudio) {
				this.playAudioFile(this.mcData.questionAudio);
			}
		},
		methods: {
			checkAnswers: function() {
				var comp = this;
				var isCorrect = true;
				var boxes = document.querySelectorAll('input');

				boxes.forEach(function (box, index) {
					console.log(index, box.id, 'checked', comp.answers[index].correct);
					// display right and wrong answer
					if (comp.answers[index].correct) {
						box.parentElement.classList.add('correct-answer');
					} else {
						box.parentElement.classList.add('incorrect-answer');
					}
					if (!box.checked && comp.answers[index].correct) {
						isCorrect = false;
					}
					if (box.checked && !comp.answers[index].correct) {
						isCorrect = false;
					}
				});
				// ToDo: multiple chances to get it right?
				if (isCorrect) {
					this.feedbackText = this.mcData.correctFeedbackText;
					this.playAudioFile(this.mcData.correctFeedbackAudio);
				} else {
					this.feedbackText = this.mcData.wrongFeedbackText;
					this.playAudioFile(this.mcData.wrongFeedbackAudio);
				}
				this.isFeedback = true;
				//this.showAnswers = false;
				this.showFeedback = true;
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
					this.playAudioFile(filename);
				}
			},
			playAudioFile: function(filename) {
				this.audioPlayer.pause();
				this.audioPlayer.src = filename;
				this.audioPlayer.currentTime = 0;
				this.audioPlayer.volume = this.audioVolume;
				this.audioPlayer.playbackRate = this.audioPlaybackRate;
				this.audioPlayer.play();
			},
			audioEnded: function() {
				if (this.isFeedback) {
					this.$emit('submitAnswers', this.mcData);// send data
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
	.multiple-answer {
		position: absolute;
		top: 15%;
		left: 24%;
		width: 50%;
		padding: 20px;
		border-radius: 12px;
		border: 3px solid #333333;
		background-color: rgba(255, 255, 255, 0.8);
	}
	.multi-question {
		font-size: larger;
		font-weight: 600;
		text-align: center;
		padding-bottom: 20px;
	}
	.multi-answer-container {
		display: flex;
		flex-direction: column;
	}
	.multi-answer {
		width: 60%;
		margin: 0 auto 10px;
		text-align: left;
	}
	.multi-item {
		display: flex;
		padding: 3px 5px;
		border-radius: 4px;
		border: 1px solid #333333;
		background-color: #ffffff;
	}

	.multi-feedback {
		padding: 20px;
		border-radius: 8px;
		border: 2px solid #333333;
		background-color: #ffffff;
	}
	.audio-button {
		cursor: pointer;
	}
	svg {
		padding-top: 5px;
	}
	input {
		width: 24px;
		height: 24px;
		cursor: pointer;
	}
	label {
		width: 99%;
		margin-left: 10px;
		padding-top: 5px;
		cursor: pointer;
	}
	.correct-answer {
		background-color: #a2f1cf;
	}
	.incorrect-answer {
		color: #ffffff;
		text-decoration: line-through;
		background-color: #999999;
	}

	@media (max-width: 1024px) {
		.multi-answer {
			width: 90%;
		}
	}
	/* Pixel2 XL */
	@media (max-width: 830px) and (max-height: 420px) {
		.multi-choice {
			left: 18%;
			width: 60%;
			margin-top: -50px;
			padding: 10px;
		}
		.multi-item {
			margin-bottom: 15px;
			padding: 5px;
		}
		.answer-text {
			font-size: large;
		}
	}
	/* tablet portrait */
	@media (max-width: 768px) and (max-height: 1024px) {
		.multi-choice {
			left: 24%;
			margin-top: 95px;
			padding: 15px;
		}
		.multi-answer {
			width: 90%;
		}
	}
	/* Pixel2 iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 740px) and (max-height: 420px) {
		.multi-choice {
			left: 10%;
			width: 75%;
			margin-top: -50px;
			padding: 10px;
		}
	}

	@media (max-width: 670px) {
		.multi-choice {
			left: 3%;
			width: 90%;
			border-width: 2px;
		}
		.multi-feedback {
			border-width: 2px;
		}
	}
</style>
