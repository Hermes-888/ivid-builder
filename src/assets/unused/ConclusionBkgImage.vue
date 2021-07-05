<template>
	<div class="conclusion">
		<div class="conclusion-image"
			:style="{ backgroundImage: `url(${conclusionImage})` }"
		></div>
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
	</div>
</template>

<script>
	import PlayAudioButton from "./PlayAudioButton.vue";

	export default {
		name: 'Conclusion',

		components: {
			PlayAudioButton
		},

		/**
		 * conclusionText can contain HTML
		 * conclusionStyle is an object of css properties to change its default style
		 * if conclusionAudio, add a PlayAudioButton if clicked
		 * conclusionImage will be displayed as background-image
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
			conclusionImage: {
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
		},
		watch: {
			/**
			 * audio volume and playbackRate are passed from App
			 */
			audioVolume: {
				immediate: true,
				handler(n) {
					if (this.audioplayer) {
						this.audioplayer.volume = n;
					}
				}
			},
			audioPlaybackRate: {
				immediate: true,
				handler(n) {
					if (this.audioplayer) {
						this.audioplayer.playbackRate = n;
					}
				}
			}
		},
		data() {
			return {
				audioplayer: null,// <audio> element
				buttonsEnabled: false
			}
		},
		mounted() {
			this.$nextTick(function () {
				if (this.conclusionAudio) {
					// create an audio element in memory, not attached to the DOM
					this.audioplayer = document.createElement('audio');
					this.audioplayer.setAttribute('id', 'conclusionplayer');
					this.audioplayer.setAttribute('crossorigin', 'anonymous');
					this.audioplayer.src = this.conclusionAudio;
					this.audioplayer.volume = this.audioVolume;
					this.audioplayer.playbackRate = this.audioPlaybackRate;
					this.audioplayer.addEventListener('ended', this.audioEnded);

					var playPromise = this.audioplayer.play();

					if (playPromise !== undefined) {
						playPromise.then(_ => {
							// Automatic playback started!
						})
							.catch(error => {
								console.log('playAudioFile error:', error);
								// Auto-play was prevented, may not be loaded yet, Show paused UI.
							});
					}
				}
			});
		},
		methods: {
			audioEnded: function() {
				// conclusion audio has ended so tell the LMS
				this.$emit('announceCompleted');
			}
		}
	}
</script>

<style>
	.conclusion-image {
		height: 90vh;
		margin: 0 5px;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center center;
	}
	.conclusion-text {
		position: absolute;
		top: 20%;
		left: 10%;
		width: 75%;
		color: #333333;
		text-align: center;
		padding: 20px;
		border-radius: 8px;
		border: 3px solid #808080;
		background-color: rgba(255,255,255, 0.8);
	}

	@media (max-width: 830px) {
		.conclusion-text {
			font-size: 18px;
		}
	}
	@media (max-width: 480px) {
		.conclusion-text {
			padding: 5px;
		}
	}
</style>
