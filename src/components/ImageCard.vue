<template>
	<div class="image-card"
		v-bind:style="imageStyle"
	>
		<div class="bkg-image"
			:style="{ backgroundImage: `url(${imagePath})` }"
		></div>
	</div>
</template>

<script>
	export default {
		name: 'ImageCard',

		/**
		 * imagePath is the url to the file placed as background-image
		 * imageStyle is an object of css properties to change its default style
		 */
		props: {
			imagePath: {
				type: String,
				default: ''
			},
			imageStyle: {
				type: Object,
				default() {}
			}
		}
	}
</script>

<style>
	.image-card {
		margin: 0 2%;
		height: 95%;
	}
	.bkg-image {
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}
</style>
