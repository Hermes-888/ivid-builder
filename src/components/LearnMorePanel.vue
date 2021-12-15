<template>
	<div class="learn-more-panel">
		<div class="learn-more-header">
			Learning Extras
			<div class="close-button" @click="$emit('closeRepo')">
				<span>X</span>
			</div>
		</div>
		<div class="learn-more-description">
			<div>Select an item below to<br>learn more about this topic.</div>
		</div>
		<div class="learn-more-container">
			<div class="item-holder"
				v-for="item in learningExtras"
				:key="item.id"
			>
				<div class="item-name"
					v-text="item.itemText"
					:data-index="item.id"
					@click="itemSelected"
				>
				</div>
			</div>
		</div>
		<div class="overlay-holder"
			v-if="showLearnMoreContent"
		>
			<div class="learn-more-video-container">
				<div class="close-video-button" @click="closeVideoModal">
					<span>X</span>
				</div>
				<video id="learnMoreVideo" playsInline autoplay controls crossorigin="anonymous"></video>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	/**
	 * small animated screen drawer overlay
	 * each learningExtra item:
	 * {id: 0, itemText: 'Fish Allergies', filepath: ''}
	 */
	name: "LearnMorePanel",
	props: {
		learningExtras: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			showLearnMoreContent: false,
		}
	},
	// mounted() {},
	methods: {
		itemSelected: function(event) {
			// index = repoImages[index] = filename
			let index = event.target.getAttribute('data-index');
			// simulated display selected w/overlay
			this.showLearnMoreContent = true;
			this.$nextTick(function() {
				// console.log('learn more item selected:', index, this.learningExtras[index]);// , event.target);
				// console.log('video:', document.getElementById('learnMoreVideo'));
				document.getElementById('learnMoreVideo').src = this.learningExtras[index].filepath;
				// post event to LMS to display learning extra
				parent.postMessage({'type':'showLearningExtra', 'version':1, 'item':this.learningExtras[index]}, '*');
			});
		},
		closeVideoModal: function() {
			this.showLearnMoreContent = false;
		}
	}
}
</script>

<style scoped>
.learn-more-panel {
	position: absolute;
	top: 30px;
	left: 0;
	width: 20vw;
	z-index: 10;
	user-select: none;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	border: 2px solid #333333;
	border-left: none;
	/*background-color: rgba(240, 240, 240, 0.8);*/
	background-color: #f0f0f0;
	box-sizing: border-box;
	-ms-touch-action: none;
	touch-action: none;
}

.learn-more-header {
	width: 99%;
	padding: 1% 0;
	text-align: center;
	font-size: 22px;
	font-weight: 600;
}

.close-button {
	cursor: pointer;
	float: right;
	width: 20px;
	line-height: 20px;
	font-size: 14px;
	font-weight: 800;
	color: #666666;
	border-radius: 50%;
	border: 1px solid #666666;
	background-color: #efefef;
}
.close-button:hover {
	color: #000000;
	border-color:  #333333;
	background-color: #ffffff;
}

.learn-more-description {
	padding: 10px;
	font-size: smaller;
}

.learn-more-container {
	margin-left: 5px;
}

.item-holder {
	width: 90%;
	margin: 8px;
	padding: 5px;
	cursor: pointer;
	color: #333333;
	border-radius: 5px;
	border: 1px solid #333333;
	background-color: #ffffff;
}
.item-holder:hover {
	color: #ffffff;
	background-color: #888888;
}
.item-name {
	width: 100%;
	text-align: center;
	font-size: smaller;
}

.overlay-holder {
	position: absolute;
	top: -32px;
	left: 0;
	z-index: 12;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.8);
}
.close-video-button {
	cursor: pointer;
	float: right;
	margin-bottom: 5px;
	width: 30px;
	line-height: 30px;
	font-size: 24px;
	font-weight: 800;
	color: #666666;
	border-radius: 50%;
	border: 1px solid #666666;
	background-color: #efefef;
}
.close-video-button:hover {
	color: #000000;
	border-color:  #333333;
	background-color: #ffffff;
}

.overlay-holder video {
	max-width: 100%;
}
.learn-more-video-container {
	width: 70%;
	padding: 0;
	margin: 3% auto;
}
</style>
