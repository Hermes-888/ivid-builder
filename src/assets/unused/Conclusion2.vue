<template>
	<div class="conclusion">
		<div class="conclusion-text"
			v-bind:style="conclusionStyle"
		>
			<play-audio-button
				ref="audioBtn"
				v-if="conclusionAudio"
				:audioPath="conclusionAudio"
				:audioVolume="audioVolume"
				:audioPlaybackRate="audioPlaybackRate"
			/>
			<span v-html="conclusionText"></span>
		</div>
		<div class="image-container">
			<div class="image-holder">
				<ImageButton
					v-for="image in conclusionImages"
					:key="image.id"
					:imagePath="image.filepath"
					@click.native="imageClicked(image)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	import ImageButton from "./ImageButton";
	import PlayAudioButton from "./PlayAudioButton.vue";

	export default {
		name: 'Conclusion',

		components: {
			ImageButton,
			PlayAudioButton
		},

		/**
		 * conclusionText can contain HTML
		 * conclusionStyle is an object of css properties to change its default style
		 * if conclusionAudio, add a PlayAudioButton and wait until isActive then play the file
		 * conclusionImages will become ImageButtons, emit their id when clicked
		 * isActive will become true when App sets showConclusion to true
		 */
		props: {
			conclusionText: {
				type: String,
				default: ''
			},
			conclusionStyle: {
				type: Object,
				default() {}
			},
			conclusionAudio: {
				type: String,
				default: ''
			},
			conclusionImages: {
				type: Array, // Needs to be objects with scene to play
				default() { return[]; }
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
		methods: {
			imageClicked: function(e) {
				if (this.conclusionAudio) {
					this.$refs.audioBtn.$emit('pauseAudio');
				}
				this.$emit('imageClicked', e.id);
			}
		}
	}
</script>

<style>
	.conclusion-text {
		width: 80%;
		margin: 20px auto 0 auto;
		color: #333333;
		text-align: center;
		padding: 20px;
		border-radius: 8px;
		border: 3px solid grey;
		background-color: rgba(255,255,255, 0.8);
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}

	.image-container {
		display: inline-block;
		width: 80%;
	}

	.image-holder {
		display: inline-flex;
		margin: 5% auto;
	}

	@media (max-width: 830px) {
		.conclusion-text {
			font-size: 18px;
		}
		.image-container {
			width: 100%;
		}
		.image-holder {
			width: 500px;
			margin-top: 2%;
		}
		.image-button {
			margin: 2% 3%;
		}
	}
	@media (max-width: 480px) {
		.conclusion-text {
			padding: 5px;
		}
		.image-container {
			width: 100%;
			height: 90%;
		}
		.image-holder {
			width: 110px;
			display: block;
		}
	}
</style>
