<template>
	<div class="video-container">
		<video class="video-element"
			ref="vid"
			playsinline
			disablePictureInPicture="true"
		>
			<track v-if="ccEnabled && captionsFilename"
				kind="captions"
				srclang="en"
				default
				:src="captionsFilename"
			/>
		</video>
		<!-- progressbar w/markers -->
		<div class="progress-holder"
				v-show="showProgressbar"
				ref="progressHolder"
		>
			<div class="progressbar"
				:style="{
					width: progress+'%'
				}"
			></div>
			<div ref="markers" id="markers"></div>
		</div>
	</div>
</template>

<script>
	/**
	 * videoFilename will play till the end then trigger the Scene
	 * adjust the volume if the LMS sends the volumeUpdated message
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/TextTrack
	 * https://developer.mozilla.org/en-US/docs/Web/API/VTTCue
	 * cueEn = new VTTCue(2.6, 4, 'Subtitles will display between 2.6 and 4 seconds');
	 * cueEn.id = 'element type';
	 * cueEn.text = JSON.stringify(content to pass to element)
	 *
	 * Not IE? use currentTime?
	 */

	export default {
		name: 'Video',

		props: {
			videoFilename: {
				type: String,
				default: ''
			},
			captionsFilename: {
				type: String,
				default: ''
			},
			vttCues: {
				type: Array,
				default() { return[]; }
			},
			ccEnabled: {
				type: Boolean,
				required: false,
				default: false
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
			videoFilename: {
				immediate: true,
				handler(n) {
					if (this.vidPlayer) {
						// console.log('filepath n:', n);// video file path/name
						// console.log('Video Player:', this.vidPlayer);//, this.vidPlayer.textTracks);
						// console.log('track:', this.cueTrack);
						// console.log('filename:', this.videoFilename);
						// console.log('volume:', this.audioVolume);
						// console.log('playbackRate:', this.audioPlaybackRate);

						// start the player if new filename
						if (n) {
							this.vidPlayer.src = n;//this.videoFilename;
							this.vidPlayer.volume = this.audioVolume;
							this.vidPlayer.playbackRate = this.audioPlaybackRate;

							if (this.jumpTo > 0) {
								this.vidPlayer.currentTime = this.jumpTo;
								this.jumpTo = 0;// reset
							}

							var playPromise = this.vidPlayer.play();
							if (playPromise !== undefined) {
								playPromise.then(_ => {
									// Automatic playback started!
								})
										.catch(error => {
											console.error('play video error:', error);
											// Auto-play was prevented, may not be loaded yet, Show paused UI.
										});
							}
						}
					}
				}
			},
			vttCues: {
				immediate: true,
				handler(n) {
					var comp = this;

					// Remove completed cues
					if (this.cueTrack) {
						var old = Array.from(this.cueTrack.cues);
						//console.log('Old cues:', old);
						old.forEach(function (cue) {
							comp.cueTrack.removeCue(cue);
						});
						// remove old markers
						this.$refs.markers.innerHTML = '';
					}

					// Add new cues
					//console.log('New vttCues:', n);
					n.forEach(function(cueData) {
						comp.cueTrack.addCue(cueData);
					});
				}
			},
			/**
			 * ccEnabled, audio volume and playbackRate are passed from App
			 */
			ccEnabled: {
				immediate: true,
				handler(n) {
					if (this.$refs.vid && this.captionsFilename) {
						//var trackMode =  n ? 'showing' : 'hidden';
						this.$refs.vid.textTracks[0].mode = n ? 'showing' : 'hidden';//trackMode;
						// ToDo: metadata track should be 0, there could be multiple captions tracks
					}
				}
			},
			audioVolume: {
				immediate: true,
				handler(n) {
					if (this.$refs.vid) {
						this.$refs.vid.volume = n;
					}
				}
			},
			audioPlaybackRate: {
				immediate: true,
				handler(n) {
					if (this.$refs.vid) {
						this.$refs.vid.playbackRate = n;
					}
				}
			}
		},
		data() {
			return {
				vidPlayer: null,
				cueTrack: null,
				showProgressbar: true,
				progressHolder: null,// add markers to outer progressbar element
				progress: 0,
				jumpTo: 0,
			}
		},
		mounted() {
			this.$nextTick(function () {
				var comp = this;
				if (this.showProgressbar) {
					this.progressHolder = this.$refs.progressHolder;
				}

				// method to add cues to track
				this.vidPlayer = this.$refs.vid;// <video>
				this.cueTrack = this.vidPlayer.addTextTrack('metadata', 'cueTrack', 'en');
				this.cueTrack.mode = 'hidden';// default=showing like captions

				// Only listen to this track
				this.cueTrack.addEventListener('cuechange', comp.cueChangeEvent);

				if (this.vidPlayer) {
					// console.log('Video Player:', this.vidPlayer, this.vidPlayer.textTracks);
					// console.log('track:', this.cueTrack);
					// console.log('filename:', this.videoFilename);// missing!
					// console.log('volume:', this.audioVolume);
					// console.log('playbackRate:', this.audioPlaybackRate);
					if (window.location.href.indexOf('CourseAsset') > -1) {
						this.vidPlayer.style.height = '97vh';
					}

					// if (this.captionsFilename && this.ccEnabled) {
					// 	this.vidPlayer.textTracks[0].mode = 'showing';
					// 	console.log('Captions showing');
					// }

					this.$root.$on('playing', function(status) {
						//console.log('AV root playing:', status);
						status ? comp.vidPlayer.play() : comp.vidPlayer.pause();
					});
					/**
					 * Scene can set video currentTime
					 * listener fires before video plays
					 * set jumpTo then handle in watch.videoFilename
					 */
					this.$root.$on('jumpTo', function(time) {
						//console.log('AV jump to time:', time);
						comp.jumpTo = time;
					});

					this.vidPlayer.addEventListener('canplaythrough', function (e) {
						//console.log('canplaythrough:', e);// is this a problem when progressive download?
						if (comp.showProgressbar) {
							comp.addMarkers();// duration is available now
						}
					});
					this.vidPlayer.addEventListener('timeupdate', function () {
						comp.progress = Math.round((comp.vidPlayer.currentTime / comp.vidPlayer.duration) * 100);
					});
					this.vidPlayer.addEventListener('ended', function() {
						comp.$emit('videoEnded');
					});

					// onResize rebuild the progressbar and markers
					window.addEventListener('resize', function () {
						if (comp.showProgressbar) {
							comp.$refs.markers.innerHTML = '';// remove and rebuild markers
							comp.addMarkers();
						}
					});

					/**
					 * Utility: get currentTime if Control key is down
					 * to find where I could put interactive cues
					 */
					document.addEventListener('keydown', (event) => {
						if (event.key === 'Control') {
							// only Control key is pressed.
							console.log('-->Mark Time:', comp.vidPlayer.currentTime);
						}
					}, false);
				}
			});
		},
		methods: {
			/**
			 * listen for cuechange, check if video needs to pause
			 * emit activeCues for interactions layer
			 *
			 * @param e - cuechange event
			 */
			cueChangeEvent: function (e) {
				var activeCues = Array.from(e.target.activeCues);
				// console.log('cuechange:', e);
				//console.log('activeCues:', activeCues);

				// if activeCues.length == 0 a cue.endTime fired
				// if > 0 a cue.startTime fired

				if (activeCues && activeCues.length > 0) {
					// check if video should pause
					var data = JSON.parse(activeCues[0].text);
					//console.log('cue.text:', data);

					if (data.hasOwnProperty('pauseVideo') && data.pauseVideo) {
						this.vidPlayer.pause();
					}

					// emit cues for interaction layer to handle
					this.$root.$emit('activeCues', activeCues);
				}
			},
			addMarkers: function() {
				// place markerBtn on progressbar for each cue
				if (!this.showProgressbar) { return; }
				var comp = this;
				var vidBounds = document.querySelector('video').getBoundingClientRect();
				this.progressHolder.style.left = Math.round(vidBounds.left+5) + 'px';
				this.progressHolder.style.width = Math.round(vidBounds.width-20) + 'px';
				this.progressHolder.style.top = Math.floor(vidBounds.bottom-20) + 'px';
				var barWidth = Math.round(this.progressHolder.clientWidth);
				var duration = this.vidPlayer.duration;
				var cues = Array.from(this.cueTrack.cues);// not IE

				// console.log('addMarkers: cues:', cues);
				// console.log('vidBounds:', vidBounds.width, 'barWidth:', barWidth);
				// console.log(this.progressHolder);

				cues.forEach(function(cue, index) {
					var char = cue.id.substring(0, 1);
					var mark = document.createElement('div');
					mark.id = 'marker' + index;
					mark.classList.add('marker');// * comp.size.width
					mark.style.left = (((cue.startTime / duration) * barWidth)-18) + 'px';
					mark.setAttribute('data-time', cue.startTime);
					mark.innerText = char.toUpperCase();//first Character
					comp.$refs.markers.appendChild(mark);

					if (comp.showProgressbar) { // || config.layout.clickButtons?
						//console.log(cue.id);
						mark.style.cursor = 'pointer';
						mark.addEventListener('mousedown', function() {
							comp.vidPlayer.currentTime = parseFloat(this.getAttribute('data-time'));
							// console.log('marker clicked:', this.getAttribute('data-time'));
							// if builder mode, jump to the marker.time
						});
					}
				});
			}
		}
	}
</script>

<style>
	.video-container {
		margin: auto;
	}
	.video-element {
		max-width: 100%;
		height: 90vh;
		margin: 0 auto;
		border-radius: 13px;
	}
	.progress-holder {
		position: absolute;
		left: 9%;
		top: 80%;
		width: 80%;
		padding: 3px;
		/*z-index: 10;*/
		border-radius: 8px;
		/*border-radius: 0 0 8px 8px;*/
		/*background-color: rgba(100, 100, 100, 0.6);*/
		background-color: #888888;
	}
	.progressbar {
		width: 8%;
		height: 12px;
		border-radius: 8px;
		background-color: rgba(255,255,255, 0.6);
		/*background-color: #ffffff;*/
	}
	.progress-text {
		position: absolute;
		top: 15px;
		width: 90%;
		color: #ffffff;
		text-align: center;
	}
	#markers{
		position: absolute;
		top: 0;
		/*bottom: 25px;*/
	}
	.marker {
		position: absolute;
		width: 18px;
		height: 18px;
		color: #ffffff;
		text-align: center;
		font-size: 12px;
		line-height: 1.6;
		border-radius: 50%;
		background-color: rgba(0, 116, 106, 0.6);
	}
	@media (max-width: 1024px) {
		.video-element {
			height: 73vh;
		}
	}
	/* mini tablet landscape */
	/*@media (max-width: 900px) and (max-height: 420px) {}*/
	/* Pixel2 XL */
	@media (max-width: 830px) and (max-height: 420px) {
		.video-element {
			height: 98vh;
		}
	}
	/* tablet portrait */
	@media (max-width: 768px) and (max-height: 1024px) {
		.video-element {
			height: 40vh;
		}
	}
	/* Pixel2 iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 740px) and (max-height: 420px) {
		.video-element {
			height: 99vh;
		}
	}
	/* iPhone 6/7/8 */
	/*@media (max-width: 670px) {}*/
	/* iPhone 5 SE*/
	/*@media (max-width: 570px) {*/
	/*	.video-element {*/
	/*		height: 95.15vh;*/
	/*	}*/
	/*}*/
</style>
