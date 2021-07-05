<template>
	<div class="hello">
		<h1></h1>
		<p>
			For a guide and recipes on how to configure / customize this project,<br>
			check out the
			<a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
		</p>
		<h3>Installed CLI Plugins</h3>
		<ul>
			<li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
			<li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
		</ul>
		<h3>Essential Links</h3>
		<ul>
			<li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
			<li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
			<li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
			<li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
			<li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
		</ul>
		<h3>Ecosystem</h3>
		<ul>
			<li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
			<li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
			<li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
			<li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
			<li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
		</ul>
	</div>
</template>

<script>
	/**
	 * Velocity 2 docs:
	 * https://github.com/julianshapiro/velocity/wiki
	 */
	import Velocity from 'velocity-animate';
	//import "velocity-animate/velocity.ui.min.js";

	export default {
		name: 'VelocityExample',
		props: {
			msg: String
		},
		mounted() {
			var elements = document.querySelectorAll('ul');
			var vimg = document.querySelector('img');

			// Velocity animate example
			Velocity(elements, {
				opacity: [1, 0],// [to, from]
				height: ['10px', '90px']
			}, {
				duration: 800,
				drag: 200,
				complete: function() {
					console.log('animation completed');
				}
			});

			Velocity(vimg, {
				opacity: [1, 0],// [to, from]
				height: ['320px', '10px']
			}, {
				duration: 1000
			});
			Velocity(vimg, {height: ['200px', '320px']}, {duration: 250, delay: 300});
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h3 {
		margin: 40px 0 0;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		display: inline-block;
		margin: 0 10px;
	}
	a {
		color: #42b983;
	}
</style>
