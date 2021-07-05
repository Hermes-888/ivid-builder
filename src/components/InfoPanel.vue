<template>
	<div class="info-panel">
		<div class="panel"
			:style="{
				width: mcData.panelWidth,
				backgroundColor: mcData.panelBkgColor
			}"
		>
			<div class="info-title"
				:style="{
				color: mcData.titleColor
			}"
			>
				<span v-text="mcData.infoTitle"></span>
			</div>
			<div class="info-text"
				v-html="mcData.infoText"
			>
			</div>
			<div class="info-button"
					@click="$emit('continue', mcData)"
			>
				<span v-text="mcData.buttonText"></span>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * display a panel of text with a continue button
 * mcData.infoTitle
 * mcData.infoText & mcData.infoAudio?
 * mcData.buttonText
 * ToDo: maybe an option to play audio or video?
 * import PlayAudioButton from "./PlayAudioButton.vue";
 */
export default {
	name: 'InfoPanel',
	props: {
		mcData: {
			type: Object,
			default() {
				return {};
			}
		}
	}
}
</script>

<style scoped>
.info-panel {
	position: absolute;
	width: 100%;
	text-align: center;
}
.panel {
	margin: 0 auto;
	width: 40%;
	padding: 20px;

	border-radius: 12px;
	border: 2px solid #333333;
	background-color: rgba(3,117,163, 0.6);/* manager blue*/
}
.info-title {
	color: #ffffff;
	margin: 10px;
	font-size: larger;
	font-weight: bold;
}
.info-text {
	width: 96%;
	padding: 10px;
	margin-bottom: 20px;
	border-radius: 8px;
	border: 2px solid #ffffff;
	background-color: rgba(255,255,255, 0.8);
}

.info-button {
	padding: 10px;
	margin: auto;
	width: 35%;
	color: #333333;
	text-align: center;
	text-transform: uppercase;
	border-radius: 10px;
	border: 2px solid #333333;
	background-color: white;
	cursor: pointer;
}

.info-button:hover {
	color: #000000;
	border-color: #000000;
}

	@media (max-width: 1024px) {
		.info-panel {
			margin: 120px 18% 0 18%;
			width: 60%;
		}
	}
@media (max-width: 830px) {
	.info-panel {
		margin-top: -50px;
	}
}
/* tablet portrait */
@media (max-width: 768px) and (max-height: 1024px) {
	.info-panel {
		margin: 90px 18% 0 18%;
		width: 60%;
	}
	.info-text {
		width: 95%;
	}
}
@media (max-width: 740px) {
	.info-panel {
		margin-top: -50px;
	}
}
@media (max-width: 670px) {
	.info-panel {
		margin-top: -80px;
	}
	.info-button {
		padding: 8px;
	}
}
@media (max-width: 570px) {
	.info-button {
		padding: 5px;
		font-size: 14px;
	}
}
</style>
