<template>
	<div class="hint-container">
		<div class="hint-button"
				v-show="!showHint"
				@click="hintClicked"
				:style="{
					color: mcData.buttonTextColor,
					backgroundColor: mcData.buttonBackgroundColor
				}"
		>
			<span></span>
		</div>
		<div class="hint-text"
			v-show="showHint"
			v-html="mcData.hintText"
		></div>
	</div>
</template>

<script>
export default {
	name: 'HintButton',
	props: {
		mcData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			showHint: false
		}
	},
	//mounted() {},
	methods: {
		hintClicked: function() {
			//console.log('hintClicked:');
			// show hintText
			if (this.mcData.hintText) {
				this.showHint = true;
			}
			if (this.mcData.hintAudio) {
				this.$emit('playAudioFile', this.mcData.hintAudio);
			}
		}
	}
}
</script>

<style scoped>
	.hint-container {
		position: absolute;
		left: 0;
		width: 100%;
	}
	.hint-text {
		width: fit-content;
		margin: 0 auto;
		padding: 10px;
		border-radius: 10px;
		border: 2px solid #333333;
		background-color: #ffffff;
	}
	.hint-button {
		padding: 10px;
		margin: 0 auto;
		width: fit-content;
		font-weight: 600;
		text-align: center;
		text-transform: uppercase;
		border-radius: 10px;
		border: 2px solid #333333;
		background-color: #ffffff;
		cursor: pointer;
	}

	.hint-button:hover {
		color: #000000;
		/*background-color: rgba(255,255,255, 1);*/
	}

	span {
		position: relative;
	}

	span::before {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 100%;
		height: 2px;
		background-color: #126774;
		transform-origin: center;
		transform: translate(-50%, 0) scaleX(0);
		transition: transform 0.3s ease-in-out;
	}

	span:hover::before {
		transform: translate(-50%, 0) scaleX(1);
	}

	/* tablet portrait */
	@media (max-width: 768px) and (max-height: 1024px) {
		.hint-container {
			margin-top: -20%;
		}
	}
	@media (max-width: 740px) {
		.hint-container {
			margin-top: unset;
		}
	}
	@media (max-width: 570px) {
		.hint-container {
			margin-top: 15px;
		}
	}
</style>
