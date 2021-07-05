<template>
	<div class="main-knob">
		<input id='p1' class="preset1" type="range"
			data-width="250" data-height="250"
			data-angleOffset="270"
			data-angleRange="180"
			data-labels="140,145,150,155,165"
		/>
		<svg>
			<filter id="dropshadow" height="150%" width="150%">
				<feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
				<feOffset dx="0" dy="5" result="offsetblur"/>
				<feMerge>
					<feMergeNode/>
					<feMergeNode in="SourceGraphic"/>
				</feMerge>
			</filter>
			<filter id='inner-shadow'>
				<!-- Shadow Offset -->
				<feOffset
						dx='0'
						dy='5'
				/>

				<!-- Shadow Blur -->
				<feGaussianBlur
						stdDeviation='5'
						result='offset-blur'
				/>

				<!-- Invert the drop shadow
						 to create an inner shadow -->
				<feComposite
						operator='out'
						in='SourceGraphic'
						in2='offset-blur'
						result='inverse'
				/>

				<!-- Color & Opacity -->
				<feFlood
						flood-color='black'
						flood-opacity='0.75'
						result='color'
				/>

				<!-- Clip color inside shadow -->
				<feComposite
						operator='in'
						in='color'
						in2='inverse'
						result='shadow'
				/>

				<!-- Put shadow over original object -->
				<feComposite
						operator='over'
						in='shadow'
						in2='SourceGraphic'
				/>
			</filter>
		</svg>
	</div>
</template>

<script>
/**
 * A radial dial to set a temperature
 */
import Knob from '@/assets.knob-min.js';
import Ui from '@/assets/p1.js';

export default {
	name: 'Knob',
	components: {},
	props: {},
	data() {
		return {}
	},
	mounted() {},
	watch: {},
	methods: {}
}
</script>

<style scoped>
	.main-knob {
		position: absolute;
	}
	.p1 rect {
		fill: #fefefe;
	}

	.p1 g polygon {
		opacity: 1;
	}

	.p1 circle {
		fill: #375d58;
		stroke: #bababa;
		stroke-width: 2;
		filter: url(#dropshadow);
	}

	.p1 text {
		font-size: 1rem;
		fill: #333333;
		font-family: 'Arimo', Arial, Helvetica, sans-serif;
		font-weight: 500;
		-webkit-transition: all .1s ease-in-out;
	}

	.p1 text.active {
		font-size: 1.5rem;
		font-weight: bold;
		-webkit-transition: all .3s ease-in-out;
	}
</style>
