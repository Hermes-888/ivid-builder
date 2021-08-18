<template>
	<div class="image-button"
			ref="imagebtn"
			@click="$emit('imageSelected', mcData)"
			:style="{
				top: dtop,
				left: dleft,
				width: dwidth,
				height: dheight
			}"
	>
	</div>
</template>

<script>
/**
 * imagePath is the url to the file
 * style is calculated to retain its location
 */

export default {
		name: 'ImageButton',
		props: {
			mcData: {
				type: Object,
				default() {
					return {
            "start": 18.8,
            "type": "ImageButton",
            "useOverlay": false,
            "animateIn": false,
            "animateOut": false,
            "pauseVideo": true,
            "resumePlayback": true,
            "branchTo": null,// add if you branch
            "imagePath": "",
            "location": {
              "top": 0,
              "left": 0,
              "width": 223,
              "height": 154
            }
          };
				}
			}
		},
		data() {
			return {
				scc: null,// interaction-overlay
				vid: null,// video-element
				wp: 1,// factor
				hp: 1
			}
		},
		mounted() {
			this.$nextTick(function() {
				// console.log('ImageButton mounted:', this.mcData);
				this.setPosition();
				window.addEventListener('resize', this.setPosition);

				this.$refs.imagebtn.style.backgroundImage = "url('" + this.mcData.imagePath + "')";
			});
		},
		computed: {
			// calculate top,left,width,height from mcData.location
			dtop: function() {
				if (this.vid) {
					return Math.round((this.mcData.location.top * this.hp) + this.scc.offsetTop + this.vid.offsetTop) + 'px';
				}
			},
			dleft: function() {
				if (this.vid) {
					return Math.round((this.mcData.location.left * this.wp) + this.scc.offsetLeft + this.vid.offsetLeft) + 'px';
				}
			},
			dwidth: function() {
				return Math.round(this.mcData.location.width * this.wp) + 'px';
			},
			dheight: function() {
				return Math.round(this.mcData.location.height * this.hp) + 'px';
			}
		},
		methods: {
			// imageSelected: function () {
			// 	this.$emit('imageSelected', this.mcData);
			// },
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

<style>
	.image-button {
		position: absolute;
		padding: 8px;
		cursor: pointer;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		/*border-radius: 10px;*/
		/*border: 1px solid #333333;*/
	}
	.img-btn {
		width: 100%;
	}
	.image-button:hover {
		border-radius: 10px;
		border: 2px solid #333333;
	}
</style>
