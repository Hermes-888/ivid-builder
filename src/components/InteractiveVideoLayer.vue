<template>
	<div class="video-container">
	<!--oncontextmenu="return false">-->
		<video class="video-element"
			ref="vid"
			playsinline
			disablePictureInPicture="true"
			@ended="$emit('videoEnded')"
		>
			<track kind="captions"
				v-for="(track, index) in captions"
				:key="index"
				:label="track.label"
				:srclang="track.language"
				:src="track.file"
			/>
		</video>
		<!-- progressbar w/markers -->
		<div class="progress-holder"
			ref="progressHolder"
			v-show="progressbarOptions.showProgressbar"
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
				required: true,
				default: ''
			},
			vttCues: {
				type: Array,
				required: false,
				default() { return[]; }
			},
			progressbarOptions: {
				type: Object,
				required: false,
				default() { return {}; }
			},
			captions: {
				type: Array,
				default() { return[]; }
			},
			ccEnabled: {
				type: Boolean,
				required: false,
				default: false
			},
			ccLanguage: {
				type: String,
				required: false,
				default: null// = off, else the Captions.vtt language to display
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
						// console.log('--watch videoFilename: cueTrack:', this.cueTrack);
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
									// Auto-play was prevented, may not be loaded yet
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
					}

					// Add new cues
					// console.log('--watch vttCues:', n);
					// console.log('--watch cueTrack:', this.cueTrack);
					if (this.cueTrack) {
						n.forEach(function(cueData) {
							comp.cueTrack.addCue(cueData);
						});

						// update markers
						if (this.progressbarOptions.showMarkers) {
							this.addMarkers();
						}
					}
				}
			},
			/**
			 * ccEnabled, ccLanguage, volume and playbackRate are passed from Scene
			 */
			ccEnabled: {
				immediate: true,
				handler(n) {
					if (this.$refs.vid && this.captions) {
						//var trackMode =  n ? 'showing' : 'hidden';
						// this.$refs.vid.textTracks[0].mode = n ? 'showing' : 'hidden';
						// var tracks = this.ccTracks;// Array.from(this.vidPlayer.textTracks);
						var ccLanguage = this.ccLanguage;
						// console.log('--watch ccEnabled:', n, this.ccLanguage, this.captions, this.ccTracks);// too soon

						if (this.ccTracks) {
							this.ccTracks.forEach(function(track, index) {
								track.mode = 'hidden';
								if (n && ccLanguage === track.language) {
									track.mode = 'showing';
								}
							});
						}
					}
				}
			},
			ccLanguage: {
				immediate: true,
				handler(n) {
					// console.log('ccLanguage:', n);// null=off else language
					// change which captions file to show : null = off
					if (this.captions && this.vidPlayer) {
						// var tracks = this.ccTracks;// Array.from(this.vidPlayer.textTracks);
						var ccEnabled = this.ccEnabled;// user can't turn captions on by selecting CC btn
						// console.log('--watch ccLanguage: captionTracks:', n, this.ccTracks);
						this.ccTracks.forEach(function(track, index) {
							track.mode = 'hidden';
							if (ccEnabled && n === track.language) {
								track.mode = 'showing';
							}
						});
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
				cueTrack: null,// metadata track
				ccTracks: null,// closed caption tracks
				progressHolder: null,// add markers to outer progressbar element
				progress: 0,
				jumpTo: 0,
			}
		},
		mounted() {
			this.$nextTick(function () {
				var comp = this;
				var language = this.ccLanguage;
				// progressbar and markers
				this.progressHolder = this.$refs.progressHolder;
				// add cues to track
				this.vidPlayer = this.$refs.vid;// <video>

				if (this.vidPlayer) {
					/**
					 * listen for playing event, comes from interactions
					 */
					this.$root.$on('playing', function(status) {
						status ? comp.vidPlayer.play() : comp.vidPlayer.pause();
					});

					/**
					 * Scene can set video currentTime
					 * listener fires before video plays
					 * set jumpTo then handle at watch.videoFilename
					 */
					this.$root.$on('jumpTo', function(time) {
						//console.log('AV jump to time:', time);
						comp.jumpTo = time;
					});

					// if ccLanguage is not null, set the textTrack .mode='showing'
					this.vidPlayer.addEventListener('loadeddata', function() {
						
						//comp.ccTracks = Array.from(comp.vidPlayer.textTracks);
						comp.ccTracks = Array.prototype.slice.call(comp.vidPlayer.textTracks);
						// console.log('loadeddata: ccTracks', comp.ccTracks);

						// add metadata track
						comp.cueTrack = comp.vidPlayer.addTextTrack('metadata', 'cueTrack', 'en');
						comp.cueTrack.mode = 'hidden';// default=showing like captions

						if (comp.vttCues) {
							comp.vttCues.forEach(function(cueData) {
								comp.cueTrack.addCue(cueData);
							});
						}
						// console.log('loadeddata: cueTrack', comp.cueTrack);

						// Only listen to cue events on this track
						comp.cueTrack.addEventListener('cuechange', comp.cueChangeEvent);

						// if enabled, display the captions
						if (comp.ccEnabled && comp.ccTracks) {
							language = comp.captions[0].language;
						}
						// console.log('loadeddata: ccLanguage', comp.ccEnabled, comp.ccLanguage);
						
						if (language) {
							comp.ccTracks.forEach(function(track) {
								track.mode = 'hidden';
								if (track.language === language) {
									track.mode = 'showing';
									// track.setAttribute('default', true);
								}
								// console.log('AV show track:', track);
							});
						}

						if (comp.progressbarOptions.showMarkers) {
							comp.addMarkers();// duration is available now
							if (comp.progressbarOptions.enableMarkers) {
								comp.$refs.markers.style.zIndex = 2;
							}
						}
					});

					this.vidPlayer.addEventListener('timeupdate', function() {
						comp.progress = Math.round((comp.vidPlayer.currentTime / comp.vidPlayer.duration) * 100);
					});

					// onResize rebuild the progressbar and markers
					window.addEventListener('resize', function() {
						if (comp.progressbarOptions.showMarkers) {
							comp.addMarkers();
						}
					});

					/**
					 * Utility: get currentTime if Control key is down
					 * uncomment to find where to put interactive cues
					 * ToDo: add a debug: true, for this???
					 */
					document.addEventListener('keydown', function(event) {
						if (event.key === 'Control') {
							// only Control key is pressed.
							console.log('-->Mark Time:', comp.vidPlayer.currentTime);
							if (comp.vidPlayer.paused) {
								comp.vidPlayer.play();
							} else {
								comp.vidPlayer.pause();
							}
							console.log('paused?', comp.vidPlayer.paused);
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
			cueChangeEvent: function(e) {
				// var activeCues = Array.from(e.target.activeCues);
				var activeCues = Array.prototype.slice.call(e.target.activeCues);
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
				if (!this.progressbarOptions.showProgressbar) { return; }
				var comp = this;
				var vidBounds = document.querySelector('video').getBoundingClientRect();
				this.progressHolder.style.left = Math.round(vidBounds.left+5) + 'px';
				this.progressHolder.style.width = Math.round(vidBounds.width-20) + 'px';

				if (this.progressbarOptions.showMarkers) {
					var barWidth = Math.round(this.progressHolder.clientWidth);
					var duration = this.vidPlayer.duration;
					// var cues = Array.from(this.cueTrack.cues);// not IE?
					var cues = Array.prototype.slice.call(comp.cueTrack.cues);

					document.querySelector('#markers').innerHTML = '';// remove existing markers
					cues.forEach(function(cue, index) {
            if (cue.id === 'Event') { return; }
						var char = cue.id.substring(0, 1);
						var mark = document.createElement('div');
						mark.id = 'marker' + index;
						mark.classList.add('marker');// * comp.size.width
						mark.style.left = (((cue.startTime / duration) * barWidth)-18) + 'px';
						mark.setAttribute('title', cue.id);
						mark.innerText = char.toUpperCase();// first Character
						comp.$refs.markers.appendChild(mark);

						if (comp.progressbarOptions.enableMarkers) {
							mark.style.cursor = 'pointer';
							mark.setAttribute('data-time', cue.startTime);
							mark.addEventListener('mousedown', function() {
								comp.vidPlayer.currentTime = parseFloat(this.getAttribute('data-time'));
								// console.log('marker clicked:', this.getAttribute('data-time'));
							});
						}
					});
				}
			}
		}
	}
</script>

<style>
	.video-container {
		margin: auto;
	}
	.video-element {
		height: 90vh;
		max-width: 97vw;
		margin: 0 auto;
		border-radius: 8px;
	}
	.progress-holder {
		position: absolute;
		left: 9%;
		bottom: 1%;
		width: 80%;
		padding: 3px;
		border-radius: 8px;
		background-color: rgba(100, 100, 100, 0.6);
	}
	.progressbar {
		width: 8%;
		height: 12px;
		border-radius: 8px;
		background-color: rgba(255,255,255, 0.5);
	}
	.progress-text {
		position: absolute;
		top: 15px;
		width: 90%;
		color: #ffffff;
		text-align: center;
	}
	#markers {
		position: absolute;
		top: 0;
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

	/* iPhone 12 532 x 1,170 px */
	@media (max-width: 1170px) and (max-height: 532px) {
		.video-element {
			height: 95vh;
		}
		.progress-holder {
			bottom: 17%;
		}
	}
	/* tablet landscape */
	@media (max-width: 1024px) and (min-height: 740px) and (max-height: 768px) {
		.video-element {
			height: 72vh;
		}
		.progress-holder {
			bottom: 22%;
		}
	}

	/* Pixel2 XL */
	@media (max-width: 830px) and (max-height: 420px) {
		.video-element {
			height: 97vh;
		}
		.progress-holder {
			bottom: 15%;
		}
	}
	/* tablet portrait */
	@media (max-width: 768px) and (min-height: 1000px) and (max-height: 1024px) {
		.video-element {
			height: 40vh;
		}
		.progress-holder {
			bottom: 60%;
		}
	}
	/* Pixel2 iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 740px) and (max-height: 420px) {
		.video-element {
			height: 97vh;
		}
		.progress-holder {
			bottom: 15%;
		}
	}
	/* iPhone 6/7/8 */
	@media (max-width: 670px) and (max-height: 380px) {
		.video-element {
			height: 95vh;
		}
		.progress-holder {
			bottom: 16%;
		}
	}
	/* iPhone 5 SE*/
	/*@media (max-width: 570px) {*/
	/*	.video-element {*/
	/*		height: 95.15vh;*/
	/*	}*/
	/*}*/
</style>
