<template>
	<div class="title-screen">
		<div class="title-content">
			<div class="title-row">
				<h1 class="title-big"
					:style="{
						color: mcData.textBigColor
					}"
				>
					<span v-text="mcData.textBig"></span>
				</h1>
			</div>
			<div class="title-row">
				<div class="title-small"
					:style="{
						width: mcData.textSmallWidth,
						color: mcData.textSmallColor,
						backgroundColor: mcData.textSmallBkgColor
					}"
				>
					<span v-html="mcData.textSmall"></span>
				</div>
			</div>
			<div class="title-buttons" ref="button">
				<Button
					:buttonText="mcData.btnText"
					:buttonTextColor="mcData.btnTextColor"
					:buttonBackgroundColor="mcData.btnBkgColor"
					@click.native="$emit('continue', mcData)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * Displays a header and info text
 * viewer selects the Continue button to advance
 */
import Button from './Button.vue';

export default {
	name: 'TitleScreen',
	components: {
		Button
	},
	props: {
		mcData: {
			type: Object,
			default() {
				return {
					textBig: '',
					textBigColor: '#000000',
					textSmall: '',
					textSmallColor: '#333333',
					textSmallWidth: '60%',
					textSmallBkgColor: '#aeeaec',
					btnText: 'CONTINUE',
					btnTextColor: '#333333',
					btnBkgColor: '#ffffff',
					//btnBorderColor: '#333333',// add btnbordercolor?
				};
			}
		}
	},
	data() {
		return {}
	},
	mounted() {
		// hide the continue button and fade in after pause
		var btn = this.$refs.button;
		btn.style.opacity = '0';
		Velocity(btn, {
			opacity: [1,0]
		}, {
			duration: 500,
			delay: 1500
		});
	}
}
</script>

<style scoped>
	.title-screen {
		position: absolute;
		width: 100%;
	}
	.title-row {
		width: 100%;
	}
	.title-content {
		position: relative;
	}
	.title-big {
		margin: 3% auto;
	}
	.title-small {
		text-align: left;
		padding: 20px;
		width: 60%;
		margin: 3% auto;
		border: 1px solid #0c0c0c;
		border-radius: 8px;
		background-color:rgba(255, 255, 255, 0.8);
	}
	.title-buttons {
		position: relative;
		width: 100%;
	}
</style>
