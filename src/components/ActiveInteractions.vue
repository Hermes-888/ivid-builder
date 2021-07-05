<template>
	<!--oncontextmenu="return false"-->
	<div class="interaction-overlay"
		oncontextmenu="return false"
		ref="interactionLayer"
		@playAudioFile="playAudioFile"
	>
		<!-- content added dynamically -->
	</div>
</template>

<script>
/**
 * Adds interactive components dynamically
 * display background overlay if data.useOverlay = true
 */
import AnimatedMessage from "@/components/AnimatedMessage.vue";
import DragImage from "@/components/DragImage.vue";
import FlashCard from "@/components/FlashCard.vue";
import HintButton from "@/components/HintButton.vue";
import ImageButton from "@/components/ImageButton.vue";
import InfoPanel from "@/components/InfoPanel.vue";
import MultiAnswer from "@/components/MultiAnswer.vue";
import MultiChoice from "@/components/MultiChoice.vue";
import TitleScreen from "@/components/TitleScreen.vue";

import Vue from 'vue';

export default {
	name: 'ActiveInteractions',
	// components: {},
	props: {
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
			audioPlayer: null,// added at mounted
			interactionLayer: null,// dom element to add to
			interactiveComponents: []// comps on screen
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.interactionLayer = this.$refs.interactionLayer;

			/**
			 * components emit('playAudioFile', filename)
			 * if a comp has audio, it should
			 * this.$emit('playAudioFile', this.mcData.hintAudio);
			 *
			 * a listener will call this player
			 * EX: mcInstance.$on('playAudioFile', function(file) {
							comp.playAudioFile(file);
						});
			 */
			this.audioPlayer = document.createElement('audio');
			this.audioPlayer.setAttribute('id', 'active-audio');
			this.audioPlayer.setAttribute('crossorigin', 'anonymous');
			//this.audioPlayer.addEventListener('ended', this.audioEnded);

			/**
			 * listener on root to receive activeCues directly from video
			 * @type {this} - scope for activeCues listener
			 */
			var comp = this;
			this.$root.$on('activeCues', function (activeCues) {
				//console.log('AI activeCues:', activeCues);
				comp.showActiveCues(activeCues);
			});
		});
	},
	methods: {
		showActiveCues: function(cues) {
			var comp = this;
			var mcClass, mcInstance;

			if (cues.length === 0) {
				//console.log('no active cues', this.interactiveComponents);
				this.removeComponents();// shouldn't be any
				// remove overlay-active
				//this.interactionLayer.classList.remove('overlay-active');
				//document.querySelector('.interaction-overlay').classList.remove('overlay-active');
				return;
			}

			for (var i=0; i<cues.length; i++) {
				// console.log('AI showActiveCues:', cues[i].id, cues[i].text);
				var data = JSON.parse(cues[i].text);

				if (data.hasOwnProperty('useOverlay') && data.useOverlay) {
					//this.interactionLayer.classList.add('overlay-active');
					document.querySelector('.interaction-overlay').classList.add('overlay-active');
				}
				// overlay color?
				// if useBlur: overlay-blur
				if (data.hasOwnProperty('useBlur') && data.useBlur) {
					//this.interactionLayer.classList.add('overlay-blur');
					document.querySelector('.interaction-overlay').classList.add('overlay-blur');
				}

				//console.log('AI data:', cues[i].id, data);

				switch(cues[i].id) {
					case 'AnimatedMessage':
						mcClass = Vue.extend(AnimatedMessage);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('messageCompleted', function(mcData) {
							if (mcData.removeMessage) {
								comp.removeComponents(mcData);
							}
						});
						break;
					case 'DragImage':
						mcClass = Vue.extend(DragImage);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						mcInstance.$on('triggerMessage', function (cues) {
							comp.showActiveCues(cues);
						});
						// listen for completion, remove and continue
						mcInstance.$on('dropCompleted', function(mcData) {
							// console.log('drop completed', mcData);
							// if (mcData.points) { console.log('points:', mcData.points); }
							comp.removeComponents(mcData);
						});
						break;
					case 'FlashCard':
						mcClass = Vue.extend(FlashCard);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('continue', function(mcData) {
							//console.log('Flash Card continue selected:', mcData);
							comp.removeComponents(mcData);
						});
						break;
					case 'HintButton':
						mcClass = Vue.extend(HintButton);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('hintUsed', function(mcData) {
							//console.log('HintButton used:', mcData);
							comp.removeComponents(mcData);
						});
						break;
					case 'ImageButton':
						mcClass = Vue.extend(ImageButton);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('imageSelected', function(mcData) {
							//console.log('BranchImage selected:', mcData);
							comp.removeComponents(mcData);
						});
						break;
					case 'InfoPanel':
						mcClass = Vue.extend(InfoPanel);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('continue', function(mcData) {
							comp.removeComponents(mcData);
						});
						break;
					case 'MultipleAnswer':
						mcClass = Vue.extend(MultiAnswer);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('submitAnswers', function(mcData) {
							//console.log('Multiple answers DONE:', mcData);
							comp.removeComponents(mcData);
						});
						break;
					case 'MultipleChoice':
						mcClass = Vue.extend(MultiChoice);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('answerSelected', function(mcData) {
							//console.log('MultipleChoice answer selected:', mcData);
							comp.removeComponents(mcData);
						});
						break;
					case 'TitleScreen':
						mcClass = Vue.extend(TitleScreen);
						mcInstance = new mcClass({
							propsData: {
								mcData: data
							}
						});

						this.addComponents(mcInstance);
						// listen for completion, remove and continue
						mcInstance.$on('continue', function(mcData) {
							//console.log('title continue:', mcData);
							comp.removeComponents(mcData);
						});
						break;
				}
			}
		},

		addComponents: function(instance) {
			var comp = this;
			// turn off captions if not an AnimatedMessage
			if (instance.mcData.type !== 'AnimatedMessage') {
				this.$emit('showCaptions', false);
			}
			// added to all interaction types, some could have audio to play
			instance.$on('playAudioFile', function(file) {
				//console.log('mcInstance.playAudioFile', file);
				comp.playAudioFile(file);
			});
			instance.$mount();
			this.interactiveComponents.push(instance);
			//console.log('interactionLayer:', this.$refs.interactionLayer);
			this.interactionLayer.appendChild(instance.$el);
			// animate onto screen
			if (instance.mcData.animateIn) {
				Velocity(instance.$el, {
					opacity: [1,0],
					top: [instance.mcData.animateTo, "60%"]
				}, {
					duration: 500
				});
			}
		},
		/**
		 * Remove elements from the screen
		 * original cue data is passed for
		 * data.branchTo: stepNum
		 * data.animateOut, animateTo, resumePlayback
		 * @param data Object - currently active component
		 */
		removeComponents: function(data) {
			var comp = this;
			//console.log('remove:data ', data.type);
			// console.log('remove components:', this.interactiveComponents.length, this.interactiveComponents);
			this.interactiveComponents.forEach(function(instance) {
				//console.log('remove:instance ', instance.mcData.type);
				// HintButton may not get used but must be removed too
				if (instance.mcData.hideOnResume) {
					//console.log('HintButton.hideOnResume', instance.mcData);
					comp.interactionLayer.removeChild(instance.$el);
					//comp.removeInteraction(instance.mcData);// don't change the array
				}
				if (instance.mcData.type === data.type) {
					// animate off screen then remove
					if (instance.mcData.animateOut) {
						Velocity(instance.$el, {
							opacity: [0,1],
							top: ["60%", instance.mcData.animateTo]
						}, {
							duration: 500, // delay: 200, stagger: 200,
							complete: function() {
								comp.interactionLayer.removeChild(instance.$el);
								comp.removeInteraction(data);
							}
						});
					} else {
						// remove immediately
						comp.interactionLayer.removeChild(instance.$el);
						comp.removeInteraction(data);
					}
				}
			});
		},
		/**
		 * After AnimateOut, remove overlay classes
		 * Remove component reference from array
		 * @param data Object - the component data that finished
		 */
		removeInteraction: function(data) {
			var comp = this;
			// turn ON captions if data says to?
			this.$emit('showCaptions', true);
			// console.log('remove:data ', data.type);
			// console.log('remove components:', this.interactiveComponents.length, this.interactiveComponents);
			this.interactiveComponents.forEach(function(instance, index) {
				// MAY GET REMOVED WHEN activeCues.length = 0
				// if (instance.mcData.hideOnResume) {
				// 	console.log('HintButton.hideOnResume', instance.mcData);
				// 	comp.interactiveComponents.splice(index, 1);
				// 	return;
				// }
				if (instance.mcData.type === data.type) {
					//console.log('remove:', data.type);
					comp.interactiveComponents.splice(index, 1);
				}
			});
			//console.log('removeInteraction:', this.interactiveComponents.length, this.interactiveComponents);
			// clear the overlay color and blur
			if (data.useBlur) {
				comp.interactionLayer.classList.remove('overlay-blur');
			}
			if (data.useOverlay) {
				comp.interactionLayer.classList.remove('overlay-active');
			}
			// calls ActiveVideoScene.resumePlayback()
			if (data.branchTo) {
				// remove all and start a new video
				comp.interactiveComponents = [];
				comp.interactionLayer.innerHTML = '';
				comp.$emit('playVideo', data.resumePlayback, data.branchTo);
			} else {
				comp.$emit('playVideo', data.resumePlayback);
			}
		},
		/**
		 * components emit('playAudioFile', filename)
		 * play audio file
		 */
		playAudioFile: function(filename) {
			this.audioPlayer.pause();
			this.audioPlayer.src = filename;
			this.audioPlayer.currentTime = 0;
			this.audioPlayer.volume = this.audioVolume;
			this.audioPlayer.playbackRate = this.audioPlaybackRate;
			this.audioPlayer.play();
		},
		audioEnded: function() {
			this.$emit('audioEnded');// UNUSED?
		}
	}
}
</script>

<style scoped>
.interaction-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 99.9vw;
	height: 99.9vh;
	text-align: center;
	/*border: 1px solid green;*/
}

.overlay-active {
	/* https://cssgradient.io/ */
	background-color: rgba(0, 0, 0, 0.6);/* IE 6 */
	background: radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%);
	/*background: rgba(3,117,163, 0.6); manager blue*/
}
.overlay-blur {
	backdrop-filter: blur(3px);
}
</style>
