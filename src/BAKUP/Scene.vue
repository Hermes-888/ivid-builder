<template>
<div class="scene">
	<div class="scene-full">
		<div class="scene-content">
			<ActiveVideo class="video-background"
				:videoFilename="currentStep.videoBackground"
				:captionsFilename="currentStep.captionsFile"
				:ccEnabled="currentStep.ccEnabled"
				:vttCues="currentCues"
				:audioVolume="audioVolume"
				:audioPlaybackRate="audioPlaybackRate"
				@videoEnded="videoEnded"
			></ActiveVideo>
			<ActiveInteractions
				:audioVolume="audioVolume"
				:audioPlaybackRate="audioPlaybackRate"
				@playVideo="resumePlayback"
				@showCaptions="toggleCaptions"
			/>
<!-- Bubble for Course continues on the next slide -->
			<transition name="showb">
				<SpeechBubble
					v-show="showFeedback"
					class="feedback-bubble"
					ref="feedbackBubble"
					:bubbleText="feedbackText"
					:bubbleStyle="feedbackStyle"
					@click.native="checkASL"
				/>
			</transition>
		</div>
	</div>
</div>
</template>

<script>
	import ActiveVideo from '@/components/ActiveVideo.vue';
	import ActiveInteractions from "@/components/ActiveInteractions.vue";
	import SpeechBubble from './SpeechBubble.vue';
	// import Velocity from 'velocity-animate';// anime.js

	export default {
		name: 'ActiveVideoScene',
		components: {
			ActiveVideo,
			ActiveInteractions,
			SpeechBubble// course continues on next slide
		},
		props: {
			sceneVisible: {
				type: Boolean,
				default: false
			},
			sceneData: {
				type: Array,
				default() {
					return []
				}
			},
			firstName: {
				type: String,
				default: ''
			},
			language: {
				type: Number,
				default: 0// used at alternateConclusion
			},
      isASL: {
        type: Boolean,
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
		data () {
			return {
				/**
				 * use debug to wrap console logs, exit early or other needs
				 * setting this to false will not do these things
				 */
				debug: true,
				/**
				 * audio element gets set at watch.sceneVisible
				 * audioVolume could be adjusted by LMS
				 */
				audioplayer: null,

				/**
				 * userScore is sent to the LMS at the end of all scenes
				 * either set the default to 100(%) here or during progress
				 */
				userScore: 100,
				/**
				 * NOTE: this is only an example. You can build your scene as needed
				 * sceneData is an array of scene objects
				 * each scene object describes what is visible on the screen
				 * set currentStep to the this.sceneData[this.stepNum];
				 * bind the template elements to currentStep
				 */
				currentScene: 0,// current sceneData[index]
				stepNum: 0,// current sceneData[index]
				currentStep: {},// the data to display

				currentCues: [],// convert cueData to VTTCue, bound to ActiveVideo VTTCues
				branches: [],// if length > branchCount then completed
				branchCount: 0,// set by step 0 at watch.stepNum
				/**
				 * showFeedback toggles fadeIn/fadeOut for the feedback SpeechBubble
				 * feedbackText: to display in speech bubble
				 * feedbackStyle: is the same for all feedback SpeechBubble
				 */
				showFeedback: false,
				feedbackText: 'This is the feedback text.',
				feedbackStyle: {},
			}
		},
		watch: {
			/**
			 * when the Scene becomes visible,
			 * create an audio element, not attached to the DOM
			 * listen for the 'ended' event to handle progress
			 */
			sceneVisible: {
				immediate: true,
				handler(newstate) {
					if (newstate) {
						if (this.debug) {
							console.log('currentScene:', this.currentScene, 'stepNum:', this.stepNum);
						}

						this.$nextTick(function () {
							/**
							 * if not in the LMS display the titlebar
							 * if in the LMS adjust the height
							 */
							const path = window.location.href.indexOf('CourseAsset');
							const newpath = window.location.href.indexOf('course-assets');

							if (path > -1 || newpath > -1) {
								document.querySelector('.scene').style.height = '97.7vh';
								document.querySelector('.scene-full').style.height = '97.7vh';
							}

							/**
							 * if language is ASL there is no audio to end
							 * add pointer to feedback-bubble, click calls audioEnded
							 */
							// if (this.isASL) {
							// 	document.querySelector('.feedback-bubble').style.cursor = 'pointer';
							// }
						});
					}
				}
			},
      sceneData: {
        immediate: true,
        handler(newdata) {
          console.log('- watch sceneData changed:', newdata);
          this.stepNum = 1000;// trigger refresh
        }
      },
			stepNum: {
				immediate: true,
				handler(num) {
					this.$nextTick(function () {
						/**
						 * set currentStep to the desired sceneData to display
						 * bind the template elements to currentStep
						 */
            if (num > this.sceneData.length) {
              this.stepNum = 0;
            } else {
              this.currentStep = this.sceneData[num];
              this.currentScene = num;// stepNum
              if (this.debug) {
                console.log('--- watch stepNum:', num);
                console.log('video file:', this.currentStep.videoBackground);
                // console.log('--- currentScene:', this.currentScene, 'currentStep:', this.currentStep);
              }

              // check if branches have all been viewed
              if (this.stepNum === 0 && this.currentStep.hasOwnProperty('branchCount')) {
                this.branchCount = this.currentStep.branchCount;
                if (this.debug) {
                  console.log('has branches:', this.currentStep.branchCount);
                }
              }
              /**
               * if cueData, construct a VTTCue and set the cue.id & cue.text
               * save cues to currentCues, bound to ActiveVideo VTTCues
               * which are added to the video.TextTrack
               */
              var comp = this;// scope
              if (this.currentStep.hasOwnProperty('cueData')) {
                comp.currentCues = [];// bound to ActiveVideo.vttCues
                this.currentStep.cueData.forEach(function(data) {
                  var cue = new VTTCue(data.start,data.start+0.5, '');
                  cue.id = data.type;
                  cue.text = JSON.stringify(data);
                  comp.currentCues.push(cue);// used by ActiveVideo
                  if (comp.debug) {
                    console.log('New Cue:', cue);
                  }
                });
              }

              // if played and has returnTime
              if (this.currentStep.hasOwnProperty('returnTime')) {
                if (this.currentStep.played) {
                  // tell video layer to jump to returnTime
                  this.$root.$emit('jumpTo', this.currentStep.returnTime);
                  if (this.debug) {
                    console.log('Emit jumpTo:', this.currentStep.returnTime);
                  }
                }
              }
              this.currentStep.played = true;
              this.branches[this.stepNum] = true;
              if (this.debug && this.branches) {
                console.log('branch status:', this.branches);// [true, empty, false]
              }
						}
					});
				}
			}
		},
		methods: {
			/**
			 * tell video to pause or play
			 * if optional branch is sent, set stepNum
			 *
			 * @param status - bool T/F play video
			 * @param branch - int stepNum to play (optional)
			 */
			resumePlayback: function (status, branch) {
				if (branch) {
					if (this.debug) {
						console.log('hasBranchTo:', branch);// a stepNum
					}
					this.stepNum = branch;
				} else {
					this.$root.$emit('playing', status);
				}
			},

			toggleCaptions: function(status) {
				if (this.debug) {
					//this.$emit('showCaptions', true);
					console.log('Scene toggleCaptions:', status);
				}
				this.currentStep.ccEnabled = status;
			},

			videoEnded: function () {
				if (this.debug) {
					console.log('Scene videoEnded:');
				}
				if (this.currentStep.hasOwnProperty('returnTo')) {
					// this is a branch, check if all branches have been viewed
					var count = 0;
					this.branches.forEach(function(item) {
						if (item) { count += 1; }
					});
					// if all branches completed, All Done
					if (count > this.branchCount) {
						if (this.debug) {
							console.log('should be all done', this.branchCount, this.branches);
						}

						// if no clear conclusion, show The course continues on the next slide.
						this.alternateConclusion();
						// tell the LMS
						this.$emit('announceCompleted', this.userScore);
						// ALL DONE
					} else {
						// return to a step
						this.stepNum = this.currentStep.returnTo;
					}

				} else {
					// single video ended, show The course continues on the next slide.
					this.alternateConclusion();
					this.$emit('announceCompleted', this.userScore);
					// ALL DONE
				}
			},

			/**
			 * if language is ASL there is no audio to end
			 * click feedback-bubble to advance manually
			 */
			checkASL: function() {
				if (this.isASL) {
					this.audioEnded();
				}
			},

			/**
			 * if this interactive does not have a clear conclusion and you need to display something
			 * show a SpeechBubble with text: The course continues on the next slide.
			 */
			alternateConclusion: function() {
				this.feedbackText = this.sceneData[0].altConclusion;
				this.showFeedback = true;
			}
		}
	}
</script>

<style>
	.scene {
		display: flex;
		width: 97.3vw;
		height: 95.7vh;
		overflow: hidden;
	}
	.scene-full {
		width: 97.7vw;
		height: 95vh;
		text-align: center;
	}
	.scene-content {
		padding: 0;
		/*padding: 1%;*/
		/*border-radius: 15px;*/
		/*background-color: #888888;*/
	}
	.feedback-bubble {
		top: 65%;
		margin: 0 25%;
		font-size: larger;
	}

	/* bottom animated <transition name="showb"> */
	.showb-leave-active,
	.showb-enter-active {
		transition: all .5s ease-in-out;
	}
	.showb-enter {
		transform: translate(0, 130px);
	}
	.showb-enter-to {
		transform: translate(0, 0);
	}
	.showb-leave-to {
		transform: translate(0, 130px);
	}

	/* Laptop landscape 1366x768 */
	/*@media (max-width: 1380px) {}*/
	/* iPad landscape */
	@media (max-width: 1024px) {
		.feedback-bubble {
			width: 68% !important;
		}
	}
	/* mini tablet landscape */
	@media (max-width: 900px) and (max-height: 420px) {
		.feedback-bubble {
			font-size: large;
			margin: -50px 10px !important;
		}
	}
	/* Pixel2 XL */
	@media (max-width: 830px) and (max-height: 420px) {
		.scene {
			height: 99vh;
		}
		.scene-content {
			padding: 0;
			/*background-color: #f5f5f5;*/
		}
		.feedback-bubble {
			font-size: medium;
			width: 66% !important;
		}
	}
	/* tablet portrait */
	@media (max-width: 768px) and (max-height: 1024px) {
		.scene {
			height: 95.7vh;
		}
		.scene-content {
			padding: 1%;
			/*background-color: #888888;*/
		}
		.feedback-bubble {
			font-size: larger;
			width: 97% !important;
			margin: 30px 0 !important;
		}
	}
	/* Pixel2 iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 740px) and (max-height: 420px) {
		.scene {
			height: 99vh;
		}
		.scene-content {
			padding: 0;
			/*background-color: #f5f5f5;*/
		}
		.feedback-bubble {
			font-size: medium;
			width: 47% !important;
			margin: -40px 10px !important;
		}
	}
	/* iPhone 6/7/8 */
	/*@media (max-width: 670px) {}*/
	/* iPhone 5 SE*/
	@media (max-width: 570px) {
		.feedback-bubble {
			font-size: medium;
			width: 57% !important;
		}
	}
</style>
