<template>
	<div class="radio-card">
		<div :class="radioClassObj" />
		<div :class="contentClassObj">
			<div class="radio-card-content-upper">
				<div
					class="header"
					v-text="title"
				/>
				<div v-text="uppertext" />
			</div>
			<div class="radio-card-content-lower">
				<span v-text="line1text" />
				<span
					class="radio-card-proctor-fee"
					v-text="line1amount"
				/>
				<br>
				<span v-text="line2text" />
			</div>
		</div>
		<div
			v-once
			class="radio-card-outside"
			@click.stop=""
			v-html="outside"
		/>
	</div>
</template>

<script>

	/**
	 * Radio Card Item
	 * CAUTION: outside uses v-html, to accommodate links, it is only rendered once.
	 *
	 * value is a unique identifier for each card, it can be a Number or a String.
	 * value is emitted when a card is selected.
	 */
	export default {
		name: 'RadioCardItem',

		props: {
			/** signifies if a card is selected Use config select: true to auto-select a card */
			selected: {
				type: Boolean,
				default: false
			},

			/** blue header for card */
			title: {
				type: String,
				default: ''
			},

			/**
			 * a unique number or string to identify the selected card
			 * gets emitted when selected
			 */
			value: {
				type: [Number, String],
				required: true
			},

			/** expandable top white content */
			uppertext: {
				type: String,
				default: ''
			},

			/** text on 1st line of expandable blue content */
			line1text: {
				type: String,
				default: ''
			},

			/**
			 * bolder text on 1st line of blue content
			 * may change to display fancier Number formatting
			 */
			line1amount: {
				type: [Number, String],
				default: ''
			},

			/** text on 2nd line of blue content */
			line2text: {
				type: String,
				default: ''
			},

			/**
			 * text or html displayed below the selectable radio card
			 * v-html is only rendered once when initialized
			 */
			outside: {
				type: String,
				default: ''
			}
		},

		computed: {
			contentClassObj: function() {
				return {
					'radio-card-content': true,
					'selected': !!this.selected
				};
			},

			radioClassObj: function() {
				return {
					'faux-radio': true,
					'selected': !!this.selected
				};
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import 'styleGuide.scss';

	.radio-card {
		width: 95%;
		text-align: left;
		vertical-align: top;

		@media(min-width: $screen-md) {
			display: inline-block;
			width: 280px;
		}

		.faux-radio {
			position: relative;
			top: 8px;
			left: 3px;
			width: 13px;
			height: 13px;
			border: 1px solid $disabled-text-color;
			border-radius: 50%;
			background-color: $header-light-text;
			cursor: pointer;

			&:hover {
				background-color: $food-manager-hover-color;
			}

			&.selected {
				background-color: $header-dark-text;
			}
		}

		.radio-card-content {
			width: 90%;
			height: 90%;
			margin: -10px 10px 5px 30px;
			background-color: $food-manager-color;
			color: $header-light-text;
			text-align: center;
			cursor: pointer;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;

			@media(min-width: $screen-md) {
				width: 230px;
			}

			&:hover {
				outline: 3px solid $food-manager-hover-color;
				outline-offset: -3px;
			}

			&.selected {
				outline: 3px solid $food-manager-color;
				outline-offset: -3px;
			}

			.radio-card-content-upper {
				height: 51%;
				padding: 5px;
				background-color: $header-light-text;
				color: $header-dark-text;
				line-height: 1.5;

				.header {
					padding: 5px 0;
					color: $food-manager-color;
					font-weight: 600;
				}
			}

			.radio-card-content-lower {
				padding: 10px 3px;
				font-weight: 300;
				line-height: 1.5;

				.radio-card-proctor-fee {
					font-weight: 600;
				}
			}
		}

		.radio-card-outside {
			height: 30px;
			padding-bottom: 10px;
			color: $header-dark-text;
			text-align: center;
		}
	}
</style>
