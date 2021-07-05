<template>
	<div class="main-class">
		<div class="card-position"
			:style="{
				width: mcData.cardWidth
			}"
		>
			<vue-flash-card
					:header-front="mcData.headerFront"
					:front="mcData.textFront"
					:color-front="mcData.colorFront"
					:color-text-front="mcData.colorTextFront"
					:imgFront="mcData.imgFront"
					:footer-front="mcData.footerFront"
					:header-back="mcData.headerBack"
					:back="mcData.textBack"
					:color-back="mcData.colorBack"
					:color-text-back="mcData.colorTextBack"
					:imgBack="mcData.imgBack"
					:footer-back="mcData.footerBack"
					@click.native="showButton = true"
			>
			</vue-flash-card>
			<div class="info-button"
				v-if="showButton"
				@click="$emit('continue', mcData)"
			>
				<span v-html="mcData.buttonText"></span>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * https://github.com/cuduy197/vue-flashcard
 */
import vueFlashCard from 'vue-flashcard';

export default {
	name: 'FlashCard',
	components: {
		vueFlashCard
	},
	props: {
		mcData: {
			type: Object,
			default() {
				return {
					cardWidth: '30%',
					buttonText: 'Continue',
					textFront: '',
					textBack: '',
					imgFront: '',
					imgBack: '',
					colorFront: '',
					colorBack: '',
					colorTextFront: '',
					colorTextBack: '',
					textSizeFront: '',
					textSizeBack: '',
					headerFront: '',
					headerBack: '',
					footerFront: '',
					footerBack: ''
				};
			}
		},
	},
	data() {
		return {
			showButton: false
		}
	},
	// mounted() {
	// },
	// watch: {},
	// methods: {}
}
</script>

<style>
	.main-class {
		position: absolute;
		width: 100%;
	}
	.card-position {
		margin: 5% auto;
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
		background-color: #ffffff;
		cursor: pointer;
	}
	.info-button:hover {
		color: #000000;
		border-color: #000000;
	}
</style>
