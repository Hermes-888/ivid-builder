<template>
	<div class="audio-button"
		title="Play audio"
		@click="playAudio"
	>
		<svg width="24" height="24" viewBox="0 0 24 24">
			<path fill="#606060" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
		</svg>
		<audio ref="audiobtn"
			crossorigin="anonymous"
			:src="audioPath"
		>
		</audio>
	</div>
</template>

<script>
	/**
	 * pass in a path to an mp3 audio file
	 * click the speaker icon to play the audio, click again to pause
	 *
	 * attach this to an Answer or Introduction (doesn't autoplay)
	 */
	export default {
		name: 'PlayAudioButton',
		props: {
			audioPath: {
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
		data() {
			return {
				audioBtnPlayer: null,
				playing: false
			}
		},
		watch: {
			/**
			 * audio volume and playbackRate are passed from App
			 */
			audioVolume: {
				immediate: true,
				handler(n) {
					if (this.audioBtnPlayer) {
						this.audioBtnPlayer.volume = n;
					}
				}
			},
			audioPlaybackRate: {
				immediate: true,
				handler(n) {
					if (this.audioBtnPlayer) {
						this.audioBtnPlayer.playbackRate = n;
					}
				}
			}
		},
		mounted() {
			/**
			 * if audio add an audio element, click to play the file
			 * pass in volume?
			 */
			this.$nextTick(function () {
				var me = this;
				if (this.audioPath) {
					this.audioBtnPlayer = this.$refs.audiobtn;
					this.audioBtnPlayer.volume = this.audioVolume;
					this.audioBtnPlayer.playbackRate = this.audioPlaybackRate;

					this.audioBtnPlayer.addEventListener('ended', function() {
						me.playing = false;
					});

					// pause if start button clicked
					this.$on('pauseAudio', function() {
						if (me.audioPath) {
							me.audioBtnPlayer.pause();
							me.playing = false;
							me.audioBtnPlayer.currentTime = 0;
						}
					});
					// pause if Scene plays another file
					this.$root.$on('pauseAudio', function() {
						if (me.audioPath) {
							me.audioBtnPlayer.pause();
							me.playing = false;
							me.audioBtnPlayer.currentTime = 0;
						}
					});
				}
			});
		},
		methods: {
			/**
			 * play the audio but don't select the answer it is attached to
			 */
			playAudio: function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.$root.$emit('pauseAudio');// pause any others that may be playing
				this.$nextTick(function() {
					this.audioBtnPlayer.volume = this.audioVolume;
					this.audioBtnPlayer.playbackRate = this.audioPlaybackRate;
					this.playing ? this.audioBtnPlayer.pause() : this.audioBtnPlayer.play();
					this.playing = !this.playing;
				});
			}
		}
	}
</script>

<style scoped>
	.audio-button {
		cursor: pointer;
		color: #333333;
		float: right;
	}
</style>
