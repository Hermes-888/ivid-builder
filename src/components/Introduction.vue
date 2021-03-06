<template>
	<div class="introduction">
		<div class="intro-image" ref="introimage"></div>
		<div class="intro-container">
			<div class="intro-text">
				<play-audio-button
					ref="audioBtn"
					v-if="introData.audio"
					:audioPath="introData.audio"
					:audioVolume="audioVolume"
					:audioPlaybackRate="audioPlaybackRate"
				/>
				<span v-html="introData.text"></span>
			</div>
			<div class="start-button">
				<div class="start-image"
					@click="startClicked"
				>
					<svg viewBox="0 0 200 200">
						<circle r="90" cy="100" cx="100"
							stroke-width="5"
							:stroke="introData.buttonColor"
							:fill="introData.fillColor"
						/>
						<polygon points="70 55 70 145 145 100"
							:fill="introData.buttonColor"
						/>
					</svg>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PlayAudioButton from "./PlayAudioButton.vue";

	export default {
		name: 'Introduction',
		components: {
			PlayAudioButton
		},

		/**
		 * introData.text can contain HTML
		 * if introData.audio, add an audio button element and allow user to play the file
		 * if introData.image, add a background image at mounted
		 */
		props: {
			introData: {
				type: Object,
				default() {
					return {
						text: '',
						audio: '',
						image: '',
						buttonColor: '',
						fillColor: ''
					}
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
		mounted() {
			this.$nextTick(function() {
				if (this.introData.image) {
					this.$refs.introimage.style.backgroundImage = "url('" + this.introData.image + "')";
				}
			});
		},
		methods: {
			/**
			 * Play button has been clicked
			 */
			startClicked: function() {
				if (this.introData.audio) {
					this.$refs.audioBtn.$emit('pauseAudio');
				}
				this.$emit('startClicked');
			}
		}
	}
</script>

<style>
	.introduction {
		width: 90%;
		min-height: 90%;
		margin: 0 auto;
	}
	.intro-image {
		min-height: 90vh;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}
	.intro-container {
		position: absolute;
		top: 80px;
		left: 0;
		width: 99.5vw;
	}
	.intro-text {
		width: 80%;
		margin: 2% auto 0 auto;
		color: #333333;
		text-align: center;
		padding: 1.5%;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: rgba(255,255,255, 0.8);
	}
	.start-button {
		width: 20%;
		margin: 3% auto 0 auto;
		cursor: pointer;
	}

	/* iPhone 12 532 x 1170 px */
	@media (max-width: 1170px) and (max-height: 532px) {
		.start-button {
			margin-top: 2%;
		}
	}
	/* tablet landscape */
	/* @media (max-width: 1024px) and (min-height: 740px) and (max-height: 768px) {} */
	@media (max-width: 830px) and (min-height: 360px) and (max-height: 380px) {
		.start-button {
			margin-top: 2%;
		}
	}
	/* tablet portrait */
	@media (max-width: 768px) and (min-height: 1010px) and (max-height: 1024px) {
		.start-button {
			width: 25%;
		}
	}
	/* Pixel2, Pixel4, iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 750px) and (max-height: 420px) {
		.intro-text {
			border-width: 2px;
		}
		.start-button {
			margin-top: 2%;
		}
	}
	/* iPhone 6/7/8 */
	/* @media (max-width: 670px) {} */
</style>
