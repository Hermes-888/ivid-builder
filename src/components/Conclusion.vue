<template>
	<div class="conclusion" ref="conclusion" v-once>
		<div class="conclusion-text"
			v-if="conclusionData.text"
		>
			<span v-html="conclusionData.text"></span>
		</div>
		<div class="image-container"
			v-if="!conclusionData.video"
		>
			<div class="image-holder"
				v-if="conclusionData.images"
			>
				<ImageButton
					v-for="image in conclusionData.images"
					:key="image.id"
					:imagePath="image.filepath"
					@click.native="imageClicked(image)"
				/>
			</div>
		</div>
		<div class="conclusion-video"
			v-if="conclusionData.video"
		>
			<video id="concludevid" ref="concludevid"
				class="video-element"
				controls autoplay
				playsinline
				disablePictureInPicture="true"
				crossorigin="anonymous"
				:src="conclusionData.video"
				@ended="audioEnded"
			>
				<track kind="captions"
					v-for="(track, index) in conclusionData.captions"
					:key="index"
					:label="track.label"
					:srclang="track.language"
					:src="track.file"
				/>
			</video>
		</div>
		<div class="topics-panel"
			v-if="conclusionData.testTopics"
		>
      <transition name="showl">
				<test-topics
					v-show="showTestTopics"
					:topics="conclusionData.testTopics"
				/>
      </transition>
    </div>
	</div>
</template>

<script>
	import ImageButton from "./ImageButton";
	import TestTopics from './TestTopics.vue';

	export default {
		name: 'Conclusion',

		components: {
			ImageButton,
			TestTopics
		},

		/**
		 * conclusion text can contain HTML
		 * if conclusion audio, add an audio element and play the file
		 * conclusion images[] will become ImageButtons, emit their id when clicked
		 */
		props: {
			conclusionData: {
				type: Object,
				default() {
					return {
						text: '',
						audio: '',// optional audio for text
						video: '',// display a video conclusion
						captions: [],// with vtt captions
						image: '',// single background image
						images: []// objects with scene to play
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
			},
			ccLanguage: {
				type: String,
				required: false,
				default: ''// = off, else the Captions.vtt language to display
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
						console.log('conclude volume:', n);
					}
					if (this.$refs.concludevid) {
						console.log('conclude volume:', n, this.$refs.concludevid);
						this.$refs.concludevid.volume = n;
					}
				}
			},
			audioPlaybackRate: {
				immediate: true,
				handler(n) {
					if (this.audioplayer) {
						this.audioplayer.playbackRate = n;
					}
					if (this.$refs.concludevid) {
						console.log('conclude playbackRate:', n, this.$refs.concludevid);
						this.$refs.concludevid.playbackRate = n;
					}
				}
			},
			ccLanguage: {
				immediate: true,
				handler(n) {
					// console.log('ccLanguage:', n);// null=off, language? or label
					// change which captions file to show : null = off
					if (this.conclusionData.captions && this.$refs.concludevid) {
						var tracks = Array.prototype.slice.call(this.$refs.concludevid.textTracks);
						// console.log('intro textTracks:', tracks);
						tracks.forEach(function(track) {
							track.mode = 'hidden';
							if (n === track.language) {
								track.mode = 'showing';
							}
						});
					}
				}
			}
		},
		data() {
			return {
				audioplayer: null,// <audio> element
				videoplayer: null,//
				buttonsEnabled: false,
				showTestTopics: false
			}
		},
		mounted() {
			this.$nextTick(function () {
				if (this.conclusionData.image) {
					// possibly use image-container
					this.$refs.conclusion.style.backgroundImage = "url('" + this.conclusionData.image + "')";
				}

				if (this.conclusionData.audio) {
					// create an audio element in memory, not attached to the DOM
					this.audioplayer = document.createElement('audio');
					this.audioplayer.setAttribute('id', 'conclusionplayer');
					this.audioplayer.setAttribute('crossorigin', 'anonymous');
					this.audioplayer.src = this.conclusionData.audio;
					this.audioplayer.volume = this.audioVolume;
					this.audioplayer.playbackRate = this.audioPlaybackRate;
					this.audioplayer.addEventListener('ended', this.audioEnded);

					let playPromise = this.audioplayer.play();

					if (playPromise !== undefined) {
						playPromise.then(_ => {
							// Automatic playback started! Show playing UI.
						})
						.catch(error => {
							console.log('playAudioFile error:', error);
							// Auto-play was prevented, may not be loaded yet, Show paused UI.
						});
					}
				}

				// if cc is on, show the correct track
				if (this.$refs.concludevid && this.conclusionData.hasOwnProperty('captions')) {
					// let tracks = Array.from(this.$refs.concludevid.textTracks);
					var tracks = Array.prototype.slice.call(this.$refs.concludevid.textTracks);
					let ccLanguage = this.ccLanguage;

					if (ccLanguage) {
						tracks.forEach(function(track) {
							track.mode = 'hidden';
							if (track.language === ccLanguage) {
								track.mode = 'showing';
							}
						});
					}
				}
			});
		},
		methods: {
			imageClicked: function(e) {
				if (this.buttonsEnabled) {
					this.$emit('imageClicked', e.id);
				}
			},
			audioEnded: function() {
				// enable the image buttons
				this.buttonsEnabled = true;

				if (this.conclusionData.TestTopics) {
					this.showTestTopics = true;
				}

				// conclusion audio has ended so tell the LMS we're done
				this.$emit('announceCompleted');
			}
		}
	}
</script>

<style>
	.conclusion {
		min-height: 90vh;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}
	.conclusion-text {
		width: 80%;
		margin: 20px auto 0 auto;
		color: #333333;
		text-align: center;
		padding: 20px;
		border-radius: 8px;
		border: 3px solid #333333;
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

	.conclusion-video {
		margin: auto;
	}
	.video-element {
		max-width: 100%;
		height: 90vh;
	}
	.topics-panel {
		position: absolute;
		bottom: 45%;
		left: 0;
		width: 99vw;
	}
	/* left animated <transition name="showl"> */
	.showl-leave-active,
	.showl-enter-active {
		transition: all .5s ease-in-out;
	}
	.showl-enter {
		transform: translate(-130px, 0);
	}
	.showl-enter-to {
		transform: translate(0, 0);
	}
	.showl-leave-to {
		transform: translate(-130px, 0);
	}

	/* iPhone 12 532 x 1,170 px */
	@media (max-width: 1170px) and (max-height: 532px) {
		.conclusion-text {
			top: 5%;
			padding: 10px;
			margin: 0 auto;
		}
		.conclusion-image {
			margin-top: 2%;
		}
	}
	/* tablet landscape */
	@media (max-width: 1024px) and (min-height: 740px) and (max-height: 768px) {
		.conclusion-text {
			top: 5%;
			padding: 10px;
			margin: 0 auto;
		}
		.conclusion-image {
			margin-top: 14%;
		}
	}
	@media (max-width: 830px) and (max-height: 380px) {
		.conclusion-text {
			font-size: 18px;
		}
		.conclusion-image {
			top: 5%;
			margin-top: 1%;
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
	/* tablet portrait */
	@media (max-width: 768px) and (min-height: 1010px) and (max-height: 1024px) {
		.conclusion-text {
			top: 4%;
			padding: 10px;
			margin: 0 auto;
		}
		.conclusion-image {
			margin-top: 18%;
		}
	}
	/* Pixel2, Pixel4, iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 750px) and (max-height: 420px) {
		.conclusion-text {
			top: 7%;
		}
		.conclusion-image {
			margin-top: 2%;
		}
	}
	/* iPhone 6/7/8 */
	@media (max-width: 670px) {
		.conclusion-text {
			top: 10%;
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
