<template>
<div class="scene">
	<div class="scene-full">
		<div class="scene-content">
			<ActiveVideo class="video-background"
				:videoFilename="currentStep.videoBackground"
				:vttCues="currentCues"
				:audioVolume="audioVolume"
				:audioPlaybackRate="audioPlaybackRate"
				@videoEnded="videoEnded"
			></ActiveVideo>
			<ActiveInteractions
				@playVideo="resumePlayback"
			/>
<!--			<div class="overlay-background">Interaction holder</div>-->
			<transition
				v-on:before-enter="speechBefore"
				v-on:enter="speechEnter"
				v-on:leave="speechLeave"
				v-bind:css="false"
			>
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
	import ActiveInteractions from "@/components/ActiveInteractions";
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
			// sceneNum: {
			// 	type: Number,
			// 	default: 0
			// },
			// mustComplete: {
			// 	type: String, // all or one
			// 	default: 'all'
			// },
			firstName: {
				type: String,
				default: ''
			},
			language: {
				type: Number,
				default: 0
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
				 */
				currentScene: 0,// current sceneData[index]
				stepNum: 0,// current sceneData[index]
				currentStep: {},// the data to display
				/**
				 * sceneData is an array of scene objects
				 * each scene object describes what is visible on the screen
				 * set currentStep to the this.sceneLanguage[this.language].sceneData[this.stepNum];
				 * bind the template elements to currentStep
				 *
				 * Languages: [1 English, 2 Spanish, 7 Mandarin, 8 Korean, 9 Vietnamese, 10 ASL, 12 Tagalog, 13 Serbo-Croatian]
				 * language = sceneLanguage[index]
				 * App calculates the language index and passes it to Scene
				 * Scene must include the same languages as App
				 */
				isASL: false,// if true, there is no audio

				sceneLayer: null,// DOM element to change background image on
				currentCues: [],// convert cueData to VTTCue, bound to ActiveVideo VTTCues
				branches: [],// if length > branchCount then completed
				branchCount: 0,// set by step 0 at watch.stepNum
				sceneLanguage: [
					{// English
						sceneData: [
							{
								// Step 0: main video with 3 branches
								videoBackground: 'audio/english/FoodHazards_hb.mp4',
								returnTime: 18.31,// watch: stepNum, checks if played, jumps to returnTime if true
								branchCount: 3,// check if all done
								played: false,// also in each branch video, true if viewed
								cueData: [
									{
										// manually set the time to pause at. this will get converted to a vttCue
										start: 6.6,// seconds: set Manually for now
										type: 'MultipleChoice',
										useOverlay: true,
										animateIn: true,
										animateOut: true,
										animateTo: '35%',
										pauseVideo: true,
										resumePlayback: true,
										questionText: 'If I over cook my food, does that make it unsafe to eat?',
										questionAudio: 'audio/english/silence3sec.mp3',
										randomizeAnswers: false,
										answers: [
											{
												id: 0,
												answerText: 'Yes',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'Sorry, you still have to eat your vegetables.',
												feedbackAudio: ''
											},
											{
												id: 1,
												answerText: 'No',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'Correct. Over cooking food does not make it unsafe to eat.',
												feedbackAudio: ''
											},
										]
									},
									{
										// display Instructions & 3 ImageButton without animation or overlay
										start: 18.8,// seconds
										type: 'ImageButton',
										useOverlay: false,
										animateIn: false,
										animateOut: false,
										pauseVideo: false,
										resumePlayback: false,// wait here
										branchTo: 1,// another step
										imagePath: 'images/physical_btn.png',
										location: {
											top: 160,
											left: 200,
											width: 223,
											height: 154
										}
									},
									{
										start: 19.15,// seconds
										type: 'ImageButton',
										useOverlay: false,
										animateIn: false,
										animateOut: false,
										pauseVideo: false,
										resumePlayback: false,// wait here
										branchTo: 2,// another step
										imagePath: 'images/chemical_btn.png',
										location: {
											top: 105,
											left: 790,
											width: 242,
											height: 141
										}
									},
									{
										start: 20.6,// seconds
										type: 'ImageButton',
										useOverlay: false,
										animateIn: false,
										animateOut: false,
										pauseVideo: false,
										resumePlayback: false,// wait here
										branchTo: 3,// another step
										imagePath: 'images/biological_btn.png',
										location: {
											top: 390,
											left: 710,
											width: 262,
											height: 161
										}
									},
									{
										start: 21.12,// audio is done Total dur: 22.15
										type: 'AnimatedMessage',
										useBlur: false,
										useOverlay: false,
										animateIn: true,// control In and Out separately?
										animateOut: false,
										animateTo: '40%',
										pauseVideo: true,// NOW pause video
										resumePlayback: false,// wait here
										// animateTop,Bottom ? not available at AI addComponents()
										removeMessage: false,// use as instructions
										messageText: 'Choose an image to learn more',
										// messageAudio: '',
										// textColor: ?,
										// backgroundColor: rgba(255,255,255, 0.8);
										duration: 6// seconds
									}
								]
							},
							// step 1: branchTo physical hazards video
							{
								// step 1: physical hazards video with cues
								videoBackground: 'audio/english/PhysicalHazards_hb.mp4',
								returnTo: 0,// at ended go to step 0
								played: false,// in each branch video?
								cueData: [
									{
										start: 20.8,
										type: 'AnimatedMessage',
										useBlur: false,
										useOverlay: false,
										animateIn: true,
										animateOut: true,
										animateTo: '35%',
										pauseVideo: true,
										resumePlayback: true,
										removeMessage: true,
										messageText: 'Obviously, avocado pits are too big to worry about',
										//messageAudio: ''// maybe?
										duration: 3// seconds
									},
									{
										// manually set the time-range to pause at. this will get converted to a vttCue
										start: 28.8,// seconds: set Manually for now
										type: 'MultipleChoice',
										useOverlay: true,
										animateIn: true,
										animateOut: true,
										animateTo: '35%',
										pauseVideo: true,
										resumePlayback: true,// continue playing same video when done
										questionText: 'Have you ever found bones in your fish dinner?',
										questionAudio: 'audio/english/silence3sec.mp3',
										randomizeAnswers: false,
										answers: [
											{
												id: 0,
												answerText: 'Yes',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'Be careful eating fish, it could contain small bones.',
												feedbackAudio: ''
											},
											{
												id: 1,
												answerText: 'No',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'You must be lucky.',
												feedbackAudio: ''
											}
										]
									}
								]
							},
							// step 2: branchTo chemical hazards video
							{
								// step 2: chemical hazards video with cues
								videoBackground: 'audio/english/ChemicalHazards_hb.mp4',
								returnTo: 0,// at ended go to step 0
								played: false,
								cueData: [
									{
										start: 15.85,// seconds: set Manually for now
										type: 'AnimatedMessage',
										useBlur: true,// blur while viewing message?
										useOverlay: false,
										animateIn: true,// animates onto then off of screen
										animateOut: true,
										animateTo: '20%',
										pauseVideo: true,
										resumePlayback: true,// continue playing same video
										removeMessage: true,// remove when completed
										messageText: 'Have your manager explain how to <br>prevent chemical hazards',
										duration: 6,// seconds
										// textColor: ?,
										// backgroundColor: ?
									}
								]
							},
							// step 3: branchTo biological hazards
							{
								// step 3: biological hazards video with cues
								videoBackground: 'audio/english/BiologicalHazards_hb.mp4',
								returnTo: 0,// at ended go to step 0
								played: false,
								cueData: [
									{
										start: 9.1,// seconds: set Manually for now
										type: 'MultipleChoice',
										useOverlay: true,
										animateIn: true,
										animateOut: true,
										animateTo: '30%',
										pauseVideo: true,
										resumePlayback: true,// continue to next step
										questionText: 'What is Dr. Tim\'s last name?',
										questionAudio: 'audio/english/silence3sec.mp3',
										randomizeAnswers: true,
										answers: [
											{
												id: 0,
												answerText: 'Grupto',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'Sorry, that is not it.',
												feedbackAudio: ''
											},
											{
												id: 1,
												answerText: 'Snarr',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'Yep, I remember that guy.',
												feedbackAudio: ''
											},
											{
												id: 2,
												answerText: 'Wiggins',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'Sorry, wrong Tim.',
												feedbackAudio: ''
											}
										]
									},
									{
										start: 44.30,// seconds: set Manually for now
										type: 'InfoPanel',
										useOverlay: true,
										animateIn: true,
										animateOut: true,
										animateTo: '35%',
										pauseVideo: true,
										resumePlayback: true,
										// can be html
										infoTitle: 'Our Microbiome',
										infoText: 'The microbiome is the genetic material of all the microbes - bacteria, fungi, protozoa and viruses - that live on and inside the human body. The number of genes in all the microbes in one person\'s microbiome is 200 times the number of genes in the human genome. The microbiome may weigh as much as five pounds.',
										//infoAudio: '',// ToDo: add audio or video?
										buttonText: 'Continue'
									},
									{
										start: 47.1,
										useOverlay: true,
										animateIn: true,
										animateOut: true,
										animateTo: '35%',
										pauseVideo: true,
										resumePlayback: true,
										type: 'MultipleChoice',
										questionText: 'Do you remember what they are called?',
										questionAudio: 'audio/english/silence3sec.mp3',
										answers: [
											{
												id: 0,
												answerText: 'Organic-pathogens',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'Sorry, they are called micro organisms.',
												feedbackAudio: ''
											},
											{
												id: 1,
												answerText: 'Micro-organisms',
												answerAudio: 'audio/english/foundit.mp3',
												feedbackText: 'You got it!',
												feedbackAudio: ''
											}
										]
									},
									{
										start: 88.14,// seconds: 01:28:12 = 88.12
										type: 'AnimatedMessage',//'MultipleChoice',// wont get paused
										useBlur: true,// blur while viewing message?
										useOverlay: false,
										animateIn: true,// animates onto then off of screen
										animateOut: true,
										animateTo: '35%',
										pauseVideo: true,// TEST: wait for message to complete?
										resumePlayback: true,// continue playing same video
										removeMessage: true,// remove when completed
										messageText: 'Cook poultry to an internal temperature of 165° F to be sure all pathogens are killed',
										duration: 6,// seconds
										// textColor: ?,
										// backgroundColor: ?
									}
								]
							},// All Done? Add a final conclusion video that doesn't returnTo
								// videoEnded() will conclude activity
						],
					},
					{// Spanish
						sceneData: []
					},
					{// Mandarin
						sceneData: []
					},
					{// Korean
						sceneData: []
					},
					{// Vietnamese
						sceneData: []
					},
					{// ASL
						sceneData: []
					},
					{// Tagalog
						sceneData: []
					},
					{// Serbo-Croatian
						sceneData: []
					}
				],

				/**
				 * showFeedback toggles fadeIn/fadeOut for the feedback SpeechBubble
				 * isFeedback: determines if the feedback audio was played, check at audioEnded
				 * feedbackQue: if set to a filename, play it when the current audio has ended
				 * feedbackTimer: wait for feedback fadeOut before switching text
				 * feedbackStyle: is the same for all feedback SpeechBubble
				 */
				showFeedback: false,
				isFeedback: false,
				feedbackQue: null,
				feedbackTimer: null,
				feedbackText: 'This is the feedback for a selected answer',
				feedbackStyle: {},
				/**
				 * showQuestion: toggles the fadeIn for SpeechBubble
				 * showAnswers: toggles the fadeIn for answer buttons
				 * buttonsDisabled: disables the buttons while the audio plays. (doesn't affect hover)
				 * stepTimer: waits for fadeOut animation before advancing the currentStep
				 * selectedAnswer: sceneData[currentScene].sceneSteps[stepNum].answer
				 */
				// showQuestion: false,
				// showAnswers: false,
				// buttonsDisabled: false,
				stepTimer: null,
				selectedAnswer: 0,
				nextStep: 0
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

						// UNUSED: feedback is only used for altConclusion
						// this.audioplayer = document.createElement('audio');
						// this.audioplayer.setAttribute('id', 'sceneaudioplayer');
						// this.audioplayer.setAttribute('crossorigin', 'anonymous');
						// this.audioplayer.volume = this.audioVolume;
						// this.audioplayer.playbackRate = this.audioPlaybackRate;
						// this.audioplayer.addEventListener('ended', this.audioEnded);

						this.$nextTick(function () {
							/**
							 * if not in the LMS display the titlebar
							 * if in the LMS adjust the height
							 */
							document.querySelector('.titlebar').style.display = 'none';
							// if (window.location.href.indexOf('CourseAsset') === -1) {
							// 	document.querySelector('.titlebar').style.display = 'block';
							// } else {
							// 	document.querySelector('.scene').style.height = '96vh';
							// 	document.querySelector('.scene-left').style.height = '93vh';
							// 	document.querySelector('.scene-right').style.height = '93vh';
							// }
							// sceneLeft and Right background images are loaded when the scene becomes visible
							// this.sceneLayer = document.querySelector('.scene-full');

							/**
							 * if language is ASL there is no audio to end (language = 5)
							 * add pointer to feedback-bubble and click it to advance to the next word
							 */
							// if (this.language === 5) {
							// 	this.isASL = true;
							// 	document.querySelector('.feedback-bubble').style.cursor = 'pointer';
							// }
						});
					}
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
						this.currentStep = this.sceneLanguage[this.language].sceneData[num];
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
								var cue = new VTTCue(data.start,data.start+0.1, '');
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
						//console.log('branch status:', this.branches);// [true, empty, false]

						// play the first questionAudio and animate text
						// this.playAudioFile(this.currentStep.questionAudio);
						// this.showAnswers = this.showQuestion = true;
					});
				}
			},
			/**
			 * if the LMS sends a postMessage for volume or playbackRate,
			 * the listener in App will update the props.
			 * watch the props to update the audio element in Scene
			 * OBSOLETE: DONT NEED TO WATCH IN SCENE
			 */
			audioVolume: {
				immediate: true,
				handler(n) {
					// if (this.audioplayer) {
					// 	this.audioplayer.volume = n;
					// }
				}
			},
			audioPlaybackRate: {
				immediate: true,
				handler(n) {
					// if (this.audioplayer) {
					// 	this.audioplayer.playbackRate = n;
					// }
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
				console.log('resumePlayback:', status, 'currentScene:', this.currentScene, this.stepNum);
				if (branch) {
					if (this.debug) {
						console.log('hasBranchTo:', branch);// a stepNum
					}
					this.stepNum = branch;
				} else {
					this.$root.$emit('playing', status);
				}
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
			 * if language is ASL there is no audio to end (language = 5)
			 * click the feedback-bubble to advance
			 */
			checkASL: function() {
				if (this.isASL) {
					this.audioEnded();
				}
			},

			/** UNUSED
			 * set the audio element src = filename and play it
			 */
			// playAudioFile: function(filename) {
			// 	this.audioplayer.src = filename;
			// 	this.audioplayer.volume = this.audioVolume;
			// 	this.audioplayer.playbackRate = this.audioPlaybackRate;
			//
			// 	var playPromise = this.audioplayer.play();
			//
			// 	if (playPromise !== undefined) {
			// 		playPromise.then(_ => {
			// 			// Automatic playback started! Show playing UI.
			// 		})
			// 			.catch(error => {
			// 				//console.log('playAudioFile error:', error);
			// 				// Auto-play was prevented, may not be loaded yet, Show paused UI.
			// 			});
			// 	}
			// },

			/**
			 * if this interactive does not have a clear conclusion and you need to display something
			 * show a SpeechBubble with text: The course continues on the next slide.
			 */
			alternateConclusion: function() {
				var altText = [
					'The course continues on the next slide.',// english
					'El curso continúa en la siguiente presentación.',// spanish
					'课程在下一张幻灯片继续。',// mandarin
					'다음 슬라이드에서 과정이 계속됩니다.',// korean
					'Khóa học tiếp tục ở trang chiếu tiếp theo.',// vietnamese
					'The course continues on the next slide.',// ASL
					'Magpapatuloy ang kurso sa susunod na slide.',// tagalog
					'Tečaj se nastavlja na sljedećoj sličici.'// serbo-croatian
				];
				this.feedbackText = altText[this.language];
				this.showFeedback = true;
			},
			/**
			 * Velocity v2 - animate the fadIn/fadeOut and answer buttons using
			 * https://vuejs.org/v2/api/#transition
			 * https://github.com/julianshapiro/velocity/wiki
			 * https://github.com/julianshapiro/velocity/wiki/Advanced---Forcefeeding
			 * transform: ["to", "from"]
			 * https://github.com/julianshapiro/velocity/wiki/Option---Stagger
			 * stagger won't work on answers because (el) is the specific element not a group
			 * speech transition is used for customer and feedback
			 */

			speechBefore: function(el) {
				el.style.opacity = 0;
			},
			speechEnter: function(el) {
				Velocity(el, {
					opacity: 1,
					top: ['65%', '80%']
				}, {
					duration: 500,
					// delay: 300
				});
			},
			speechLeave: function(el) {
				Velocity(el, {
					opacity: 0
				}, {
					duration: 300
				});
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
		padding: 1%;
		border-radius: 15px;
		background-color: #888888;
	}

	.feedback-bubble {
		top: 65%;
		margin: 0 15%;
		font-size: larger;
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
			background-color: #f5f5f5;
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
			background-color: #888888;
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
			background-color: #f5f5f5;
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
