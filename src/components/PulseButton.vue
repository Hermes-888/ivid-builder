<template>
	<div class="main-class">
		<button>pulse button</button>
	</div>
</template>

<script>
/**
 * button with on hover animated css
 * from: https://cssfx.netlify.app/
 */
export default {
	name: 'PulseButton',
	components: {},
	props: {},
	data() {
		return {}
	},
	mounted() {
	},
	watch: {},
	methods: {}
}
</script>

<style>
.main-class {}
	button {
		z-index: 1;
		position: relative;
		font-size: inherit;
		font-family: inherit;
		color: white;
		padding: 0.5em 1em;
		outline: none;
		border: none;
		background-color: hsl(236, 32%, 26%);
	}

	button:hover {
		cursor: pointer;
	}

	button::before {
		content: '';
		z-index: -1;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		border: 4px solid hsl(236, 32%, 26%);
		transform-origin: center;
		transform: scale(1);
	}

	button:hover::before {
		transition: all 0.75s ease-in-out;
		transform-origin: center;
		transform: scale(1.75);
		opacity: 0;
	}
</style>
