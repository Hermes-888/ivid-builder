<template>
	<div class="drag-image">
		<div class="drag-message"
			v-if="mcData.message"
			:style="{color: mcData.textColor}"
		>
			<span v-html="mcData.message"></span>
		</div>
		<div class="drag-img"
			:style="{
				top: dtop,
				left: dleft,
				width: dwidth,
				height: dheight
			}"
		>
			<img
				:src="mcData.imageFile"
				:width="dwidth"
				:height="dheight"
			/>
		</div>
		<dropzone
			:mcData="mcData.dropzone"
		/>
	</div>
</template>

<script>
/**
 * Drag an image to a dropzone using Interactjs
 * https://interactjs.io/
 * addDragImage creates the hotspot component then displays the image
 * 
 * Example:
{"location":{"top":111,"left":197,"width":120,"height":120},
"imageFile":"uploads/scarab.png",
"textColor":"#000000",
"message":"Drop the image where it goes",
"feedback":"<b>Correct</b> <p>Good Job</p>",
"wrongFeedback":"","points":5,"oneChance":false,
"oneChance":true,
"dropzone": {
    "dropzone":true,
    "hotspots": [
			{
				"location": {
					"top": 300,
					"left": 500,
					"width": 360,
					"height": 150
				}
			}
		]
	}
}
 */
import Dropzone from '@/components/HotSpot.vue';
import Interact from 'interactjs';
// hotspot = dropzone?

export default {
	name: 'DragImage',
	components: {
		Dropzone
	},
	props: {
		// the cue.text object
		mcData: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	computed: {
		// calculate top,left,width,height from mcData.location
		dtop() {
			if (this.vid) {
				return Math.round((this.mcData.location.top * this.hp) + this.scc.offsetTop + this.vid.offsetTop) + 'px';
			}
		},
		dleft() {
			if (this.vid) {
				return Math.round((this.mcData.location.left * this.wp) + this.scc.offsetLeft + this.vid.offsetLeft) + 'px';
			}
		},
		dwidth() {
			return Math.round(this.mcData.location.width * this.wp) + 'px';
		},
		dheight() {
			return Math.round(this.mcData.location.height * this.hp) + 'px';
		}
	},
	data() {
		return {
			debug: false,// show status on screen
			endLeft: 0,
			endTop: 0,
			dragStatus: '',
			scc: null,// interaction-overlay
			vid: null,// video-element
			wp: 1,// factor
			hp: 1
		}
	},
	mounted() {
		this.$nextTick(function () {
			var comp = this;

			// scale to viewport
			this.setPosition();
			window.addEventListener('resize', this.setPosition);

			// if message animate message slideUp fadeIn
			if (this.mcData.message) {
				var el = document.querySelector('.drag-message');
				el.style.opacity = 0;
				Velocity(el, {
					top: [comp.mcData.messageTop, '40%'],
					opacity: [1, 0]
				}, {
					duration: 500
				});
			}

			// on dropped/dragEnd, check if image is in dropzone
			Interact('.hotspot').dropzone({
				// only accept elements matching this CSS selector
				accept: '.drag-img',
				// Require a 75% element overlap for a drop to be valid
				overlap: 0.75,
				ondragenter: function (event) {
					//  valid drop feedback styles drop-target is in Hotspot
					if (comp.debug) {
						event.target.classList.add('drop-target');
						event.relatedTarget.classList.add('can-drop');
					}
					comp.dragStatus = 'valid';
				},
				ondragleave: function (event) {
					// remove the drop feedback styles
					if (comp.debug) {
						event.target.classList.remove('drop-target');
						event.relatedTarget.classList.remove('can-drop');
					}
					comp.dragStatus = 'outside';
				}
				// ,ondrop: function (e) {
				//     console.log('dropped:', e);
				//     // target = .hotspot
				//     // relatedTarget = .drag-img
				//     // check if valid drop
				//     // only if valid
				//     //comp.checkStatus();
				// }
			});

			Interact('.drag-img').draggable({
				modifiers: [
					Interact.modifiers.restrict({
						//restriction: 'parent',  //parent is small
						elementRect: {top: 0, left: 0, bottom: 1, right: 1}
					})
				],
				inertia: true,
				autoScroll: false,
				// call this function on every dragmove event
				//onmove: this.dragMoveListener,
				onmove: function (e) {
					e.target.style.top = Math.round(e.rect.top) + 'px';
					e.target.style.left = Math.round(e.rect.left) + 'px';
					// var target = e.target
					// // dragged position is in the data-x/data-y attributes
					// var x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx;
					// var y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

					// // update the posiion attributes
					// target.setAttribute('data-x', x);
					// target.setAttribute('data-y', y);

					// // translate the element
					// target.style.webkitTransform =
					//     target.style.transform =
					//     'translate(' + x + 'px, ' + y + 'px)';

					if (comp.debug) {
						comp.endLeft = e.target.getAttribute('data-x');
						comp.endTop = e.target.getAttribute('data-y');
					}
				},
				// call this function on every dragend event
				onend: function () {
					comp.checkStatus();
				}
			});
		});
	},
	methods: {
		checkStatus: function () {
			var message = '';
			// construct a message cue to display feedback
			var feedback = {
				type: 'AnimatedMessage',
				useBlur: false,
				useOverlay: false,
				animateIn: true,
				animateOut: true,
				animateTo: '20%',
				pauseVideo: false,
				resumePlayback: false,
				removeMessage: true,
				messageText: 'message',
				duration: 2
			};
			if (this.dragStatus === 'valid') {
				feedback.messageText = this.mcData.feedback;
				feedback.resumePlayback = this.mcData.resumePlayback;
			} else {
				feedback.messageText = this.mcData.wrongFeedback;
			}

			var cue = new VTTCue(this.mcData.start,this.mcData.start+0.1, '');
			cue.id = 'AnimatedMessage';
			cue.text = JSON.stringify(feedback);
			//console.log('feedback:', cue);

			// remove before sending feedback
			//console.log('status:', this.dragStatus, 'oneChance:', this.mcData.oneChance);
			if (!this.debug && this.dragStatus === 'valid') {
				this.$emit('dropCompleted', this.mcData);
			}
			else if (!this.debug && this.mcData.oneChance) {
				this.$emit('dropCompleted', this.mcData);
			}
			// up to InteractLayer to seActiveCues
			this.$emit('triggerMessage', [cue]);
		},
		setPosition: function() {
			this.scc = document.querySelector('.interaction-overlay');//('.scene');//('.scene-content');
			this.vid = document.querySelector('.video-element');
			// this.wp = this.vid.clientWidth / this.vid.naturalWidth;// Nan
			// this.hp = this.vid.clientHeight / this.vid.naturalHeight;// video has no naturalWidth
			this.wp = this.vid.clientWidth / 1280;//this.scc.clientWidth;// % of actual video
			this.hp = this.vid.clientHeight / 720;//this.scc.clientHeight;
		}
	}
}
</script>

<style scoped>
  .drag-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90vh;
    text-align: center;
  }
  .drag-message {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
  }
  /*.drag-msg {*/
	/*	position: absolute;*/
  /*}*/
  .drag-img {
    position: absolute;
  }
  .drag-output {
    position: absolute;
    top: 250px;
    left: 50px;
    color: #333333;
    font-size: 30px;
  }
  .can-drop {
    background-color: #13aa13;
  }
</style>
