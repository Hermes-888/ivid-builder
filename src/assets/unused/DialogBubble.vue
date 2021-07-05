<template>
	<div class="dialog-bubble"
		v-bind:style="dialogStyle"
	>
		<div class="dialog-header">
			<span class="close-btn"
				@click="$emit('closeDialog')"
			>X</span>
		</div>
		<div class="dialog-body">
			<span v-html="dialogBody"></span>
		</div>
	</div>
</template>

<script>
/**
 * dialog header and body can contain HTML
 */
	export default {
		name: 'DialogBubble',
		props: {
			dialogBody: {
				type: String,
				default: ''
			},
			dialogStyle: {
				type: Object,
				default() {}
			}
		}
	}
</script>

<style scoped>
	.dialog-bubble {
		position: absolute;
		left: 20%;
		width: 60%;
		color: #000000;
		text-align: left;
		/*padding: 10px;*/
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: #ffffff;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}
	.dialog-header {
		/*padding: 10px;*/
	}
	.close-btn {
		float: right;
		margin: 10px 10px 0 0;
		padding: 3px 6px;
		font-weight: 800;
		text-align: center;
		font-size: smaller;
		border-radius: 30%;
		border: 1px solid #333333;
		cursor: pointer;
	}
	.close-btn:hover {
		background-color: #d0d0d0;
	}
	.dialog-body {
		padding: 20px;
	}

	@media (max-width: 1024px) and (max-height: 768px) {
		.dialog-bubble {
			width: 65%;
		}
	}

	@media (max-width: 900px) {
		.dialog-bubble {
			width: 80% !important;
			left: 9% !important;
		}
	}

	@media (max-width: 830px) {
		.dialog-bubble {
			width: 80% !important;
			left: 9% !important;
		}
	}

	@media (max-width: 768px) and (max-height: 1024px) {
		.dialog-bubble {
			width: 80% !important;
			left: 9% !important;
		}
	}

	@media (max-width: 740px) {
		.dialog-bubble {
			width: 80% !important;
			left: 9% !important;
		}
	}

	/*@media (max-width: 670px) {}*/
</style>
