<template>
	<div class="animated-message">
		<span v-html="mcData.messageText"></span>
	</div>
</template>

<script>
/**
 * Message is displayed for a set amount of time
 * mcData.messageText
 * mcData.duration
 * mcData.textColor
 * mcData.backgroundColor
 */
export default {
	name: 'AnimatedMessage',
	props: {
		mcData: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	mounted() {
		var comp = this;
		setTimeout(function() {
			comp.timesUp();
		}, this.mcData.duration * 1000);// seconds
	},
	methods: {
		timesUp: function() {
			this.$emit('messageCompleted', this.mcData);
		}
	}
}
</script>

<style>
	.animated-message {
		position: absolute;
		margin-left: 33%;
		margin-right: 33%;
		width: 33%;
		padding: 20px;
		text-align: center;
		border-radius: 12px;
		border: 2px solid #333333;
		background-color: rgba(255,255,255, 0.8);
	}
	@media (max-width: 1024px) {
		.animated-message {
			margin-top: -60px;
		}
	}

	/* Pixel2 XL */
	@media (max-width: 830px) and (max-height: 420px) {
		.animated-message {
			margin-top: unset;
			padding: 10px;
		}
	}
	/* tablet portrait */
	@media (max-width: 768px) and (max-height: 1024px) {
		.animated-message {
			margin-top: 95px;
		}
	}
	/* Pixel2 iPhone 6/7/8 plus AND recover from tablet portrait */
	@media (max-width: 740px) and (max-height: 420px) {
		.animated-message {
			margin-top: unset;
		}
	}
	@media (max-width: 570px) {
		.animated-message {
			width: 35%;
			padding: 5px;
		}
	}
</style>
