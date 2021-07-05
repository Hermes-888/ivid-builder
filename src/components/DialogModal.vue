<template>
	<div class="dialog-modal"
		v-bind:style="dialogStyle"
	>
		<div class="dialog-header">
			<span class="dialog-title"
					v-html="dialogHeader"
			></span>
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
		name: 'DialogModal',
		props: {
			dialogHeader	: {
				type: String,
				default: ''
			},
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
	.dialog-modal {
		position: absolute;
		left: 25%;
		width: 50%;
		color: #000000;
		text-align: left;
		padding: 10px;
		border-radius: 8px;
		border: 3px solid #333333;
		background-color: #ffffff;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}
	.dialog-header {
		font-weight: 600;
		padding: 5px;
		border-bottom: 2px solid #888888;
	}
	.dialog-title {
		width: 85%;
	}
	.close-btn {
		width: 20px;
		float: right;
		text-align: center;
		font-size: smaller;
		border-radius: 50%;
		border: 1px solid #333333;
	}
	.dialog-body {
		padding: 10px;
	}
</style>
