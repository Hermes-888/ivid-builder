<template>
	<div class="main">
		<div class="clockbox">
			<svg id="clock" xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 600 600">
				<g id="face">
					<circle class="circle" cx="300" cy="300" r="253.9"/>
					<path class="hour-marks" d="M300.5 94V61M506 300.5h32M300.5 506v33M94 300.5H60M411.3 107.8l7.9-13.8M493 190.2l13-7.4M492.1 411.4l16.5 9.5M411 492.3l8.9 15.3M189 492.3l-9.2 15.9M107.7 411L93 419.5M107.5 189.3l-17.1-9.9M188.1 108.2l-9-15.6"/>
					<circle class="mid-circle" cx="300" cy="300" r="16.2"/>
				</g>
				<g id="hour">
					<path class="hour-arm" d="M300.5 298V142"/>
					<circle class="sizing-box" cx="300" cy="300" r="253.9"/>
				</g>
				<g id="minute">
					<path class="minute-arm" d="M300.5 298V67"/>
					<circle class="sizing-box" cx="300" cy="300" r="253.9"/>
				</g>
				<g id="second">
					<path class="second-arm" d="M300.5 350V55"/>
					<circle class="sizing-box" cx="300" cy="300" r="253.9"/>
				</g>
			</svg>
		</div>
	</div>
</template>

<script>
	// converted to vue from https://codepen.io/mor10/pen/XjRVoY
	export default {
		name: 'AnalogClock',

		data () {
			return {
				HOURHAND: null,
				MINUTEHAND: null,
				SECONDHAND: null,
				hrPosition: 0,
				minPosition: 0,
				secPosition: 0,
				aclock: null
			}
		},
		mounted: function() {
			this.HOURHAND = document.querySelector("#hour");
			this.MINUTEHAND = document.querySelector("#minute");
			this.SECONDHAND = document.querySelector("#second");

			var date = new Date();
			let hr = date.getHours();
			let min = date.getMinutes();
			let sec = date.getSeconds();
			//console.log("Hour: " + hr + " Minute: " + min + " Second: " + sec);

			this.hrPosition = (hr*360/12)+(min*(360/60)/12);
			this.minPosition = (min*360/60)+(sec*(360/60)/60);
			this.secPosition = sec*360/60;

			this.aclock = setInterval(this.runTheClock, 1000);
		},
		methods: {
			runTheClock() {
				this.hrPosition = this.hrPosition+(3/360);
				this.minPosition = this.minPosition+(6/60);
				this.secPosition = this.secPosition+6;

				this.HOURHAND.style.transform = "rotate(" + this.hrPosition + "deg)";
				this.MINUTEHAND.style.transform = "rotate(" + this.minPosition + "deg)";
				this.SECONDHAND.style.transform = "rotate(" + this.secPosition + "deg)";
			}
		}
	}
</script>

<style scoped>
	.main {
		width: 300px;
		justify-content: center;
	}

	.clockbox, #clock {
		margin-left: 55px;
	}

	/* Clock styles */
	.circle {
		fill: #ffffff;
		stroke: #000;
		stroke-width: 9;
		stroke-miterlimit: 10;
	}

	.mid-circle {
		fill: #000;
	}

	.hour-marks {
		fill: none;
		stroke: #000;
		stroke-width: 9;
		stroke-miterlimit: 10;
	}

	.hour-arm {
		fill: none;
		stroke: #000;
		stroke-width: 17;
		stroke-miterlimit: 10;
	}

	.minute-arm {
		fill: none;
		stroke: #000;
		stroke-width: 11;
		stroke-miterlimit: 10;
	}

	.second-arm {
		fill: none;
		stroke: #000;
		stroke-width: 4;
		stroke-miterlimit: 10;
	}

	/* Transparent box ensuring arms center properly. */
	.sizing-box {
		fill: none;
	}

	/* Make all arms rotate around the same center point. */
	/* Optional: Use transition for animation. */
	#hour,
	#minute,
	#second {
		transform-origin: 300px 300px;
		transition: transform .5s ease-in-out;
	}

	@media (max-width: 1024px) {
		.clockbox, #clock {
			width: 160px;
			height: 160px;
			margin-top: 20px;
			margin-left: 10px;
		}
	}
	@media (max-width: 830px) {
		.clockbox, #clock {
			width: 90px;
			height: 90px;
			margin-top: 10px;
			margin-left: 15px;
		}
	}
	@media (max-width: 670px) {
		.clockbox, #clock {
			width: 80px;
			height: 80px;
			margin-top: 10px;
			margin-left: 10px;
		}
	}
</style>
