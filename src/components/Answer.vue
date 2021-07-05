<template>
	<div
		class="answer-button"
	>
		<span v-html="answerText"></span>
		<play-audio-button
			v-if="answerAudio"
			:audioPath="answerAudio"
			:audioVolume="audioVolume"
			:audioPlaybackRate="audioPlaybackRate"
		/>
	</div>
</template>

<script>
	import PlayAudioButton from "./PlayAudioButton.vue";

	/**
	 * Answer button can include an optional audio file (answerAudio)
	 * Answer click event is added and handled in the Scene
	 * ex: @click.native="answerSelected(answer)"
	 * 
	 * answerText can be html ex: Click <b>ME</b> now
	 * answerAudio is a path to an mp3 audio file
	 * audioVolume and audioPlaybackRate are passed to PlayAudioButton
	 */

	export default {
		name: 'Answer',
		components: {
			PlayAudioButton
		},
		props: {
			answerText: {
				type: String,
				default: ''
			},
			answerAudio: {
				type: String,
				default: ''
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
		}
	}
</script>

<style>
	.answer-button {
		margin: 20px 0;
		padding: 8px;
		color: #333333;
		text-align: left;
		border-radius: 12px;
		border: 3px solid #606060;
		background-color: rgba(255, 255, 255, 0.8);
		cursor: pointer;
	}

	.answer-button:hover {
		color: #000000;
		border-color: #000000;
	}

	@media (max-width: 1024px) {
		.answer-button:hover {
			color: #333333;
			border-color: #606060;
		}
	}
	@media (max-width: 830px) {
		.answer-button {
			font-size: medium;
			margin: 5px 0;
		}
	}
</style>
