<template>
	<div id="app" class="noselect">
		<div class="titlebar"
			v-text="introContent.titleText"
		>
		</div>
		<div class="portrait-warning">
			<div class="rotate-icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 99.31 100.5"><title>rotate-phone</title><path d="M39.1,1.06H6.91a5.14,5.14,0,0,0-5.3,5V81.64a5.14,5.14,0,0,0,5.3,5H39.1a5.14,5.14,0,0,0,5.3-5V6A5.14,5.14,0,0,0,39.1,1.06Zm-21,4.69H28.77V6.83H18.14Zm4.65,77.89a4.3,4.3,0,1,1,4.3-4.3A4.3,4.3,0,0,1,22.79,83.64ZM39.71,72.7H6.42V10.55H39.71Z" transform="translate(-1.61 -1.06)" style="fill:#787878"/><rect x="15.72" y="60.22" width="80.98" height="38.11" style="fill:#fff"/><path d="M100.92,96.26V64.06a5.14,5.14,0,0,0-5-5.3H20.34a5.14,5.14,0,0,0-5,5.3v32.2a5.14,5.14,0,0,0,5,5.3H96A5.14,5.14,0,0,0,100.92,96.26Zm-4.69-21V85.93H95.15V75.3ZM18.34,80a4.3,4.3,0,1,1,4.3,4.3A4.31,4.31,0,0,1,18.34,80ZM29.28,96.87V63.57H91.43v33.3Z" transform="translate(-1.61 -1.06)"/><polygon points="72.22 55.12 84.57 42.77 59.88 42.77 72.22 55.12"/><path d="M49,17v6.25s21-2.08,21.43,21.5h6.8S79.77,17.39,49,17Z" transform="translate(-1.61 -1.06)"/></svg>
			</div>
		</div>
		<div class="warning-message"
			v-if="showWarning"
		>
			<h3 v-text="warnings[language]"></h3>
		</div>
		<Introduction
			v-if="showIntroduction"
			:introData="introContent"
			:introductionText="introContent.text"
			:introductionAudio="introContent.audio"
			:introductionImage="introContent.image"
			:audioVolume="audioVolume"
			:audioPlaybackRate="audioPlaybackRate"
			@startClicked="displayScene"
		/>
		<Scene
			v-if="showScene"
			:sceneVisible="showScene"
			:sceneData="sceneData"
			:language="language"
			:audioVolume="audioVolume"
			:audioPlaybackRate="audioPlaybackRate"
			@announceCompleted="announceCompleted"
		/>
		<Builder
			:sceneVisible="showScene"
			:language="language"
			:allData="allData"
      @restart="showScene=false;showIntroduction=true"
			@updateData="updateData"
		/>
	</div>
</template>

<script>
	import Introduction from "./components/Introduction.vue";
	import Scene from './components/Scene.vue';
	import Builder from "./builder/Builder.vue";
	import rawdata from '../public/scenedata.json';

	export default {
		name: 'app',
		components: {
			Introduction,
			Scene,
			Builder
		},
		data () {
			return {
				/**
				 * controls which component is visible
				 * showIntroduction is set when the app is mounted
				 */
				showIntroduction: false,
				showScene: false,
				showConclusion: false,
				showWarning: false,

				/**
				 * timeSpent is sent to LMS to measure how long the viewer viewed this lesson
				 * timeCounter to clearInterval
				 * userScore defaults to 100%, can be used during scene
				 */
				timeSpent: 0,
				timeCounter: null,
				userScore: 100,
				/**
				 * variables initialized by the LMS
				 * audioVolume, audioPlaybackRate, updated if changed in media player controls
				 * ccEnabled to turn on Closed Captions
				 * firstName to personalize Introduction or Scene
				 * languageId sent from LMS default 1=English
				 */
				audioVolume: 1,
				audioPlaybackRate: 1,
				ccEnabled: false,
				firstName: '',
				languageId: 1,// sets language, set manually outside the LMS
				/**
				 * Languages: [1 English, 2 Spanish, 7 Mandarin, 8 Korean, 9 Vietnamese, 10 ASL, 12 Tagalog, 13 Serbo-Croatian]
				 * language = languages.indexOf(languageId) the data[index]				
				 */
				languages: [1, 2, 7, 8, 9, 10, 12, 13],
				language: 0,// default to English

				// full screen warning translations
				warnings: [
					'Turn on full screen mode',// en
					'Activa el modo de pantalla completa',// sp
					'开启全屏幕模式',// ma
					'전체 화면 모드 켜기',// ko
					'Bật chế độ toàn màn hình',// vt
					'Turn on full screen mode',// ASL
					'I-on ang mode na full screen',// tg
					'Uključite način rada preko cijelog zaslona'// sc
				],
				/**
				 * App titleText,
				 * Introduction text, audio and image for this language
        		 * Scene sceneData[scenes] cueData must include the same languages in the same order
				 * allData=rawdata for Builder, filled at mounted()
				 */
				introContent: {},
				sceneData: [],
				allData: {}
			}
		},
		mounted() {
			/**
			 * if this interactive is being display in the LMS, hide the title bar
			 * the interactive loads into an iframe with the url of .../CourseAsset/...
			 * you can also use this in the Scene if you need to adjust elements
			 */
			if (window.location.href.indexOf('CourseAsset') > -1) {
				document.querySelector('.titlebar').style.display = 'none';
				document.querySelector('#app').style.height = '97.7vh';

				/**
				 * if the LMS sends a postMessage for volumeUpdated, adjust the volume of the audioplayer
				 */
				var me = this;
				window.addEventListener("message", function(e) {
					if (e.data) {
						switch (e.data.type) {
							case 'initializeContent':
								me.languageId = e.data.languageId;// Scene
								me.language = me.languages.indexOf(e.data.languageId);
								if (me.language === -1) {
									me.language = 0;// fallback to English if not found
								}

								me.firstName = e.data.firstName;// Intro & Scene
								me.ccEnabled = e.data.ccEnabled;// video
								me.audioPlaybackRate = e.data.playbackRate;
								me.audioVolume = e.data.volume;

								// set data from external json file
								me.updateData();
								me.displayIntro();
								break;
							case 'volumeUpdated':
								me.audioVolume = e.data.volume;
								break;
							case 'playbackRateUpdated':
								me.audioPlaybackRate = e.data.playbackRate;
								break;
						}
					}
				}, false);

				/**
				 * Start a timer that updates timeSpent in seconds
				 * timeSpent is sent to the lMS for elapsedTime
				 * timeSpent starts at Introduction and ends after Conclusion
				 */
				this.timeCounter = setInterval(function() {
					me.timeSpent += 1;
				}, 1000);
			} else {
				/**
				 * set default language to English for local/offline
				 * show the introduction
				 */
				this.language = this.languages.indexOf(this.languageId);
				if (this.language === -1) {
					this.language = 0;// fallback to English if not found
				}

				// set data from external json file
				this.updateData();
				this.displayIntro();
			}
		},
		methods: {
			/**
			 * set data from external json file or from Builder (_data)
			 */
			updateData: function(_data) {
				// console.log('rawdata:', rawdata, ' data:', _data);
				if (_data) {
					this.introContent = _data.introContent[this.language];
					this.sceneData = _data.sceneLanguage[this.language].sceneData;
					this.allData = _data;
          console.log('App _data:', _data);
				} else {
					// console.log('introData:', rawdata.introContent[this.language]);
					// console.log('sceneData:', rawdata.sceneLanguage[this.language].sceneData);
					this.introContent = rawdata.introContent[this.language];
					this.sceneData = rawdata.sceneLanguage[this.language].sceneData;
					this.allData = rawdata;
				}
			},
			/**
			 * if screen is not tall enough to display content
			 * show the fullscreen warning for 3 seconds before showing the introduction
			 */
			displayIntro: function() {
				if (window.innerHeight <= 310) {
					var me = this;
					this.showWarning = true;

					setTimeout(function() {
						me.showWarning = false;
						me.showIntroduction = true;
					}, 3000);
				} else {
					this.showIntroduction = true;
				}
			},
			/**
			 * Called when play button in the Introduction is clicked
			 * hides introduction and shows the scene
			 */
			displayScene: function() {
				this.showIntroduction = false;
				this.showScene = true;
				// console.log('rawdata:', rawdata);
				/**
				 * send 'started' event to LMS
				 */
				parent.postMessage({'type':'started', 'version':1}, '*');
			},
			/**
			 * When the viewer completes all scenes,
			 * Scene emits a announceCompleted event and sends a score
			 * The LMS is listening for the completed event
			 * currently (9/2019) the LMS only uses timeSpent
			 * NOTE: if autoNext is on in the LMS, the course player will advance to the next slide.
			 * 		if you want to review scenes in the conclusion, call sceneCompleted instead.
			 *
			 * @parm score - default = 100%
			 */
			announceCompleted: function(score) {
				if (score) {
					this.userScore = score;// update default score if different
				}
				// stop the timer
				clearInterval(this.timeCounter);
				//console.log('announceCompleted: userScore:', this.userScore, 'timeSpent:', this.timeSpent, 'seconds');
				parent.postMessage({'type':'completed', 'version':1, 'time':this.timeSpent}, '*');
				//this.sceneCompleted();// show conclusion
			},
			/**
			 * When the viewer completes a scene, show the Conclusion
			 */
			sceneCompleted: function() {
				this.showScene = false;
				this.showConclusion = true;
			}
		}
	}
</script>

<style>
	body {
		margin: 0;
		padding: 0;
		background-color: #f5f5f5;
		overflow: hidden;
	}
	#app {
		font-family: 'Arimo', Arial, Helvetica, sans-serif;
		font-size: 20px;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #000000;
		width: 99vw;
		height: 96vh;
		background-color: #f5f5f5;
	}

	.noselect {
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}

	.titlebar {
		width: 100%;
		padding-bottom: 10px;
		text-align: center;
		color: #525252;
		font-size: 30px;
	}

	.portrait-warning {
		display:none;
	}
	.warning-message {
		padding-top: 15%;
		color: #333333;
	}
	.rotate-icon {
		width: 70%;
		margin: auto;
		padding-top: 33%;
	}

	@media (max-width: 1024px) {
		#app {
			font-size: 18px;
		}
		.titlebar {
			font-size: 24px;
		}
	}
	@media (max-width: 900px) {
		.titlebar {
			font-size: 19px;
		}
	}
	@media (max-width: 830px) {
		#app {
			height: 100vh;
			font-size: 14px;
			border-width: 0;
		}
		.titlebar {
			display: none;
		}
	}
	@media (max-width: 768px) and (max-height: 1024px) {
		#app {
			height: 96vh;
		}
		.titlebar {
			display: block;
			font-size: 24px;
		}
	}
	@media (max-width: 740px) {
		#app {
			height: 100vh;
		}
		.titlebar {
			display: none;
		}
	}
	@media (max-width: 670px) {
		#app {
			width: 97.5vw;
		}
		.titlebar {
			display: none;
		}
	}
	/* mobile device is in portrait mode */
	@media (max-width: 480px) {
		.portrait-warning {
			display: block;
		}
		.introduction, .scene, .conclusion {
			display: none;
		}
	}
</style>
