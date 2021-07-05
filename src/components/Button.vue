<template>
	<div
			class="button-default"
			:style="{
				color: buttonTextColor,
				backgroundColor: buttonBackgroundColor
			}"
	>
		<span
			v-text="buttonText"
		></span>
	</div>
</template>

<script>
export default {
	name: 'Button',
	props: {
		buttonText: {
			type: String,
			default: 'SUBMIT'
		},
		buttonTextColor: {
			type: String,
			default() {
				return '#333333';
			}
		},
		buttonBackgroundColor: {
			type: String,
			default() {
				return '#ffffff';
			}
		}
	}
}
</script>

<style scoped>
	.button-default {
		padding: 10px 15px;
		margin: 0 auto;
		width: fit-content;
		font-weight: 600;
		text-align: center;
		text-transform: uppercase;
		border-radius: 10px;
		border: 1px solid #333333;
		cursor: pointer;
	}

	.button-default:hover {
		border: 2px solid #000000;
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

	/* iPhone 12 532 x 1,170 px */
	@media (max-width: 1170px) and (max-height: 532px) {
		.button-default {
			padding: 10px 15px;
		}
	}
	@media (max-width: 740px) and (max-height: 420px) {
		.button-default {
			padding: 10px 15px;
		}
	}
</style>
