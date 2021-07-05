<template>
	<div class="hotspot-container">
		<div ref="hsmessage" class="hotspot-message"
			v-if="mcData.instructions"
			:style="{
				color: mcData.txtcolor,
				top: dtop,
				left: dleft,
				width: dwidth,
				height: dheight
			}"
		>
			<span v-html="mcData.instructions"></span>
		</div>
		<div class="hotspot"
			v-for="(spot, index) in mcData.hotspots"
			:key="index"
			:data-index="index"
			:title="'Hotspot #'+index"
			:ref="'spot'+index"
			:style="{
				top: spot.location.top+'px',
				left: spot.location.left+'px',
				width: spot.location.width+'px',
				height: spot.location.height+'px',
				borderWidth: spot.bordersize+'px',
				borderColor: spot.bordercolor,
				backgroundColor: spot.bkgcolor
			}"
			@click="hotspotSelected(spot)"
		></div>
	</div>
</template>

<script>
/*
{
    "instructions":"Select your answer.",
    "txtcolor":"#000000",
    "selectOnce":false,
    "hotspots":[
        {"location":{"top":400,"left":278,"width":90,"height":90},
        "feedback":"Spot 1","fdbcolor":"#000000",
        "bkgcolor":"rgba(255,255,255, 0.2)",
        "bordercolor":"#ffffff","bordersize":2,
        "points":0
        }, ...
    ]
}
*/
export default {
	name: 'HotSpot',
	props: {
		mcData: {
			type: Object,
			default() {
				return {}
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
	mounted() {
		this.$nextTick(function () {
			var comp = this;

			// scale to viewport
			this.setPosition();
			window.addEventListener('resize', this.setPosition);

			// defined if dragImage
			//console.log('HotSpot.mcData:', this.mcData);
			if (this.mcData.dropzone) {
				// Only one or querySelectorAll?
				document.querySelector('.hotspot').classList.add('dropzone');
			}

			// if message, animate message slideUp fadeIn
			if (this.mcData.instructions) {
				var element = document.querySelector('.hotspot-message');
				element.style.opacity = 0;
				element.velocity({
					//transform: ['translateY(0px)', 'translateY(90px)'],
					top: [comp.mcData.messageTop, '40%'],
					opacity: [1, 0]
				}, {
					duration: 300
				});
			}
		});
	},
	methods: {
		hotspotSelected: function (spot) {
			// dragImage has a dropzone
			if (!this.mcData.dropzone) {
				var feedback = {
					text: spot.feedback,
					duration: 2,
					textcolor: spot.fdbcolor,
					bkgcolor: "#ffffff",
					internal: true
				};
				var messageCue = {
					id: 'message',
					text: JSON.stringify(feedback)
				};

				// mark as used, if all used, emit completed
				var complete = true;
				spot.used = true;

				this.mcData.hotspots.forEach(function (item) {
					if (!item.used) {
						complete = false;
					}
				});

				// remove component before sending feedback
				if (complete) {
					// all hotspots have been selected
					this.$emit('hotspotCompleted', spot.points);
				} else if (this.mcData.selectOnce) {
					// only one chance to select an answer
					this.$emit('hotspotCompleted', spot.points);
				}
				// show feedback, emit up to interactlayer to set ActiveCues
				this.$emit('cueChange', [messageCue]);
			}
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

<style>
.hotspot-container {
	width: 100%;
}
.hotspot-message {
	margin-top: 20px;
	text-align: center;
	font-size: 28px;
	font-weight: 600;
}
.hotspot {
	position: absolute;
	cursor: pointer;
	border: 1px solid #ffffff;
	border-radius: 8px;
	background-color: rgba(255, 255, 255, 0.2);
}

/* if dropzone add .dropzone */
.hotspot.dropzone {
	opacity: 0.01;
	background-color: #2c3e50;
	cursor: auto;
}
/* DragImage debug: true */
.hotspot.dropzone.drop-target {
	opacity: 0.5;
	background-color: #2299ee !important;
}
</style>
