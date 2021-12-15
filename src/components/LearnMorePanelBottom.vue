<template>
	<div class="learn-more-panel-bottom">
		<div class="learn-more-header">
			Learn more about this topic
		</div>
		<div class="learn-more-container">
			<div class="item-holder"
				v-for="item in learningExtras"
				:key="item.id"
			>
				<div class="item-name"
					v-text="item.text"
					:data-index="item.id"
					@click="itemSelected"
				>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	/**
	 * small animated screen drawer overlay
	 * each learningExtra item:
	 * {id: 0, itemText: 'Fish Allergies', filepath: ''}
	 * ToDo: add media queries.
	 *      Are there multiple types of LE content that needs to be displayed by this component?
	 *      If EI created a function to display an LE, post the correct message to the LMS
	 */
	name: "LearnMorePanelBottom",
	// components: {},
	props: {
		learningExtras: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		itemSelected: function(event) {
			let itemId = event.target.getAttribute('data-index');
			// add(item-holder-viewed)
			event.target.parentNode.classList.add('item-holder-viewed');
			// simulated display selected w/overlay
			this.$emit('showLearnMoreContent', itemId);
		}
	}
}
</script>

<style scoped>
.learn-more-panel-bottom {
	position: absolute;
	bottom: 0px;
	left: 5px;
	width: 99vw;
	z-index: 10;
	user-select: none;
	box-sizing: border-box;
	-ms-touch-action: none;
	touch-action: none;
}

.learn-more-header {
	width: 40%;
	margin: 0 auto 50px auto;
	padding: 5px;
	text-align: center;
	font-size: 22px;
	font-weight: 600;
	border-radius: 10px;
	border: 2px solid #333333;
	background-color: #ffffff;
}

.learn-more-container {
	display: flex;
	flex-wrap: wrap;
	margin-left: 5px;
	padding-bottom: 10px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	border: 2px solid #333333;
	border-bottom: none;
	background-color: #f0f0f0;
}
.item-holder {
	width: 23.7%;
	margin: 8px;
	border-radius: 8px;
	border: 1px solid #333333;
	background-color: #ffffff;
}
.item-holder:hover {
	background-color: #888888;
}
.item-holder-viewed {
	background-color: #bddebd;
}
.item-name {
	width: 98%;
	padding: 5px;
	color: #333333;
	text-align: center;
	font-size: smaller;
	cursor: pointer;
}
.item-name:hover {
	color: #ffffff;
}
</style>
