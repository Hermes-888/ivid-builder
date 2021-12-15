<template>
	<div class="overlay-holder">
		<div class="learn-more-video-container">
			<div class="learn-more-header" v-text="learnMoreItem && learnMoreItem.itemText"></div>
			<div class="close-video-button" @click="$emit('closeLearnMoreContent')">
				<span>X</span>
			</div>
			<video id="learnMoreVideo"
				v-show="learnMoreItem && learnMoreItem.filepath"
				playsInline autoplay controls crossorigin="anonymous"
				:src="learnMoreItem && learnMoreItem.filepath"
			></video>
		</div>
	</div>
</template>

<script>
/**
 * It would be best to show the content as if the LMS button was clicked
 * This is an alternative, video only example
 */
export default {
	name: 'LearnMoreVideo',
	props: {
		learnMoreItem: {
			type: Object,
			default() {
				return {
					id: 0,
					itemText: '',
					filepath: ''
				}
			}
		}
	}
}
</script>

<style scoped>
.overlay-holder {
	position: absolute;
	top: 0px;
	left: 0;
	z-index: 12;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.8);
}
.learn-more-header {
	width: 95%;
	color: #ffffff;
	font-size: larger;
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

#learnMoreVideo {
	max-width: 100%;
}
.learn-more-video-container {
	width: 70%;
	padding: 0;
	margin: 3% auto;
}
</style>
