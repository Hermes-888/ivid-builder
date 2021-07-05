<template>
	<div class="radio-card-container">
		<RadioCardItem
			v-for="card in cards"
			:key="card.value"
			v-bind="card"
			:selected="selectedValue === card.value"
			@click.native="onCardSelected(card.value)"
		/>
	</div>
</template>

<script>
	import RadioCardItem from './RadioCardItem.vue';

	/**
	 * Radio Card container
	 *
	 * Each card.value must be unique.
	 * selectedValue will be emitted when a card is selected
	 *
	 * listen for 'cardselected'
	 * auto-select the first card with config selected: true
	 */
	export default {
		name: 'RadioCard',

		components: {
			RadioCardItem
		},

		props: {
			/** Identifies this component */
			name: {
				type: String,
				required: true
			},

			/** Array of objects, a warning is displayed if duplicate card.values occur */
			cards: {
				type: Array,
				required: true
			}
		},

		data: () => ({
			/** Holds the unique value of the selected card */
			selectedValue: null
		}),

		created: function() {
			/** handle auto-selection, find config selected: true */
			this.onCreated();
		},

		methods: {
			/**
			 * listen for 'cardselected' to use selectedValue
			 * created() will auto-select the first card with config selected: true
			 *
			 * @param selectedValue is unique for each card
			 */
			onCardSelected: function(selectedValue) {
				this.selectedValue = selectedValue;
				this.$emit('cardselected', this.selectedValue);
			},

			onCreated: function() {
				let selectedCard = this.cards.find(function(card) {
					return card.selected;
				});

				if (selectedCard) {
					this.selectedValue = selectedCard.value;
					this.$emit('cardselected', this.selectedValue);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import 'styleGuide.scss';

	.radio-card-container {
		padding-top: 40px;
		background-color: $base-gray-background;
		font-family: $font-family;
		text-align: center;
	}
</style>
