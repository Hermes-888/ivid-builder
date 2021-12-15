<template>
	<div
		class="speech-bubble"
		v-bind:style="bubbleStyle"
	>
		<span v-html="bubbleText"></span>
	</div>
</template>

<script>
	export default {
		name: 'SpeechBubble',

		/**
		 * questionText can contain HTML
		 * bubbleStyle is an object of css properties
		 */
		props: {
			bubbleText: {
				type: String,
				default: ''
			},
			bubbleStyle: {
				type: Object,
				default() {}
			}
		}
	}
</script>

<style>
	.speech-bubble {
		position: absolute;
		color: #333333;
		text-align: center;
		padding: 10px;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: rgba(255,255,255, 0.8);
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}
</style>
