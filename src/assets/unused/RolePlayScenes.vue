<template>
	<div class="scene">
		<div class="scene-left">
			<div class="scene-content">
				<div class="instruct"
					v-show="showAnswers"
				>
					Select a response.
				</div>
				<transition-group
						v-on:before-enter="answerBefore"
						v-on:enter="answerEnter"
						v-on:leave="answerLeave"
						v-bind:css="false"
				>
					<Answer
						v-show="showAnswers"
						v-for="answer in currentStep.answers"
						:key="answer.id"
						:answerText="answer.foodworkerText"
						@click.native="answerSelected(answer)"
					/>
				</transition-group>
			</div>
		</div>
		<div class="scene-right">
			<div class="scene-content">
				<div class="wall-clock">
					<AnalogClock
						v-if="showSpecialItem"
					/>
				</div>

				<transition
					v-on:before-enter="speechBefore"
					v-on:enter="speechEnter"
					v-on:leave="speechLeave"
					v-bind:css="false"
				>
					<SpeechBubble
						class="customer-bubble"
						v-show="showQuestion"
						:bubbleText="currentStep.questionText"
						:bubbleStyle="currentStep.questionStyle"
					/>
				</transition>
				<transition
						v-on:before-enter="speechBefore"
						v-on:enter="speechEnter"
						v-on:leave="speechLeave"
						v-bind:css="false"
				>
					<SpeechBubble
							class="foodworker-bubble"
							v-show="showFoodworker"
							:bubbleText="currentStep.foodworkerText"
							:bubbleStyle="currentStep.foodworkerStyle"
					/>
				</transition>
				<transition
					v-on:before-enter="speechBefore"
					v-on:enter="speechEnter"
					v-on:leave="speechLeave"
					v-bind:css="false"
				>
					<SpeechBubble
						class="feedback-bubble"
						v-show="showFeedback"
						:bubbleText="feedbackText"
						:bubbleStyle="feedbackStyle"
					/>
				</transition>
				<transition
					v-on:before-enter="speechBefore"
					v-on:enter="speechEnter"
					v-on:leave="speechLeave"
					v-bind:css="false"
				>
					<div class="multiple-choice"
						v-if="showMultiChoice"
					>
						<MultiChoice
							:multipleChoice="multipleChoice"
							:audioVolume="audioVolume"
							@correctAnswer="multipleChoiceCorrect"
						/>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
	import Answer from './Answer.vue';
	import SpeechBubble from './SpeechBubble.vue';
	import AnalogClock from './AnalogClock.vue';
	import MultiChoice from './MultiChoice.vue';
	import Velocity from 'velocity-animate';

	export default {
		name: 'RolePlayScenes',
		components: {
			Answer,
			SpeechBubble,
			AnalogClock,
			MultiChoice
		},
		props:{
			sceneVisible: {
				type: Boolean,
				default: false
			},
			sceneNum: {
				type: Number,
				default: 0
			},
			mustComplete: {
				type: String, // all or one
				default: 'all'
			}
		},
		data () {
			return {
				/**
				 * audio element in index.html gets set an watch.sceneVisible
				 * audioVolume could be adjusted by LMS
				 */
				audioplayer: null,
				audioVolume: 1,

				/**
				 * userScore is sent to the LMS at the end of all scenes
				 * either set the default to 100(%) here or during progress
				 */
				userScore: 100,
				debug: false,// enable access to conclusion if only viewing one slide and mustComplete = 'all'

				/**
				 * slideSteps {Object} - contains scenes
				 * scene# {Array} - of objects for each step
				 *
				 * NOTE:
				 * questionText, foodworkerText, customerText and feedbackText can have html
				 * waitTime, specialItem, noAnswers are optional properties
				 * ...Audio is a path to an mp3 file
				 * ...Style is a css properties object
				 *
				 * TODO: scenes array has to be constructed from slideData, ReThink the slideData structure
				 * 		slideData is an Array of scenes
				 * 		each scene has an array of objects for each step
				 */
				slideData: {
					scene1: [
						{
							// scene 1 stepNum[0]
							sceneLeftBackground: 'images/scene1/DM72_110080_26a_01_green_background.png',// loaded when scene becomes visible
							sceneRightBackground: 'images/scene1/DM72_110080_26a_01_ice_cream_employee_customer_happy_allergies.png',
							questionText: 'Hi! Do you have any dairy-free<br>ice cream options?',
							questionAudio: 'audio/scene1/scene_1_level_1_customer.mp3', // path to audio/filename.mp3
							questionStyle: {
								borderColor: '#ffd02b',// yellow
								right: '30%',
								width: '200px'
							},
							answers: [
								{id: 0, nextStep: 1,
									foodworkerText: 'Huh?',
									foodworker: 'audio/scene1/scene_1_level_1_option_a_foodworker.mp3',
									customerText: 'Do you have any<br>DAIRY-FREE OPTIONS?',
									customerAudio: 'audio/scene1/scene_1_level_1_option_a_customer.mp3',
									feedbackText: 'Ooh. You\'re not off to the best start. Remember, you want the customer to feel confident that you\'re going to give her correct information. Let\'s try again.',
									feedbackAudio: 'audio/scene1/scene_1_level_1_option_a_feedback.mp3',
									background: 'images/scene1/DM72_110080_26a_01_ice_cream_employee_customer_concerned_allergies.png'
								},
								{id: 1, nextStep: 2,
									foodworkerText:'Yes, we have two flavors of sorbet that are dairy free: lemon and raspberry.',
									foodworker: 'audio/scene1/scene_1_level_1_option_b_foodworker.mp3',
									feedbackText: 'Nice response. She certainly feels confident that you understood her question and were able to respond correctly. Now what should happen?',
									feedbackAudio: 'audio/scene1/scene_1_level_1_option_b_feedback.mp3',
									background: ''
								},
								{id: 2, nextStep: 3,
									foodworkerText:'Oh, I\'m not sure. Let me check with my manager.',
									foodworker: 'audio/scene1/scene_1_level_1_option_c_foodworker.mp3',
									customerText: 'Oh. Okay... Thanks.',
									customerAudio: 'audio/scene1/scene_1_level_1_option_c_customer.mp3',
									feedbackText: 'Well, it’s certainly better to ask than to guess. But because you didn’t know what dairy-free options were on your menu, now the customer has to wait for you to find out.',
									feedbackAudio: 'audio/scene1/scene_1_level_1_option_c_feedback.mp3',
									background: 'images/scene1/DM72_110080_26a_01_ice_cream_employee_customer_allergies_no_foodworker.png',
									specialItem: 'AnalogClock'
								}
							]
						}, {
							//[1]: level_1_option_a
							questionText: 'Do you have any<br>DAIRY-FREE OPTIONS?',
							questionAudio: 'audio/scene1/scene_1_level_1_option_a_customer.mp3',
							questionStyle: {
								borderColor: '#ffd02b',
								right: '30%',
								width: '165px'
							},
							answers: [
								{id: 0, nextStep: 2,
									foodworkerText: 'Yes, we have two flavors of sorbet that are dairy-free; lemon and raspberry',
									foodworker: 'audio/scene1/scene_1_level_1_a_foodworker.mp3',
									feedbackText: 'Now that you’ve checked and been able to give her correct information, she clearly feels confident in ordering. Now what should happen?',
									feedbackAudio: 'audio/scene1/scene_1_level_1_a_feedback.mp3',
									background: 'images/scene1/DM72_110080_26a_01_ice_cream_employee_customer_happy_allergies.png'
								},
								{id: 1, nextStep: 3,
									foodworkerText:'Oh, I\'m not sure. Let me check with my manager.',
									foodworker: 'audio/scene1/scene_1_level_1_option_c_foodworker.mp3',
									feedbackText: 'Well, it’s certainly better to ask than to guess. But because you didn’t know what dairy-free options were on your menu, now the customer has to wait for you to find out.',
									feedbackAudio: 'audio/scene1/scene_1_level_1_option_c_feedback.mp3',
									background: 'images/scene1/DM72_110080_26a_01_ice_cream_employee_customer_allergies_no_foodworker.png',
									specialItem: 'AnalogClock'
								}
							]
						}, {
							//[2]: level_1_option_a part 2
							questionText: 'Great. We’ll take a small raspberry sorbet and I’ll have two scoops of Rocky Road.',
							questionAudio: 'audio/scene1/scene_1_level_1_option_b_customer.mp3',
							questionStyle: {
								borderColor: '#ffd02b',
								right: '25%',
								width: '380px'
							},
							answers: [
								{id: 0, nextStep: 4,
									foodworkerText: 'Sure! Let me scoop those up for you.',
									foodworker: 'audio/scene1/scene_1_level_2_option_a_foodworker.mp3',
									customerText: 'Thanks. Can you just make sure to use a clean scoop for the sorbet?',
									customerAudio: 'audio/scene1/scene_1_level_2_option_a_customer.mp3',
									feedbackText: 'She’s giving you some strong cues that there might be a milk allergy concern here. You should probably try to find out more.',
									feedbackAudio: 'audio/scene1/scene_1_level_2_option_a_feedback.mp3',
									background: ''
								},
								{id: 1, nextStep: 5,// end
									foodworkerText:'Sure! Now, is the dairy-free order for someone with a milk allergy?',
									foodworker: 'audio/scene1/scene_1_level_2_option_b_foodworker.mp3',
									feedbackText: '',
									feedbackAudio: '',
									background: ''
								}
							]
						}, {
							//[3]: level_1_option_c talk to my manager
							//
							foodworkerText: 'Yes, we have two flavors of sorbet that are dairy-free; lemon and raspberry',
							foodworkerAudio: 'audio/scene1/scene_1_level_1_a_foodworker.mp3',
							foodworkerStyle: {
								borderColor: '#5482b2',// foodworker autoplays
								top: '40%',
								left: '30%',
								width: '200px',
								textAlign: 'left'
							},
							nextStep: 2,
							waitTime: 5000,// wait 5 seconds for timer then play the audio, change background and goto nextStep
							background: 'images/scene1/DM72_110080_26a_01_ice_cream_employee_customer_happy_allergies.png'
						}, {
							//[4]: level_2
							// don't ask the question again just show answers
							answers: [
								{id: 0, nextStep: 4,
									foodworkerText: 'Sure! Let me scoop those up for you.',
									foodworker: 'audio/scene1/scene_1_level_2_option_a_foodworker.mp3',
									feedbackText: 'She’s giving you some strong cues that there might be a milk allergy concern here. You should probably try to find out more.',
									feedbackAudio: 'audio/scene1/scene_1_level_2_option_a_feedback.mp3',
									background: ''
								},
								{id: 1, nextStep: 5,// end
									foodworkerText:'Sure! Now, is the dairy-free order for someone with a milk allergy?',
									foodworker: 'audio/scene1/scene_1_level_2_option_b_foodworker.mp3',
									feedbackText: '',
									feedbackAudio: '',
									background: ''
								}
							]
						}, {
							//[5]: END Final Scene
							questionText: 'Yes! Thanks for asking.<br>My son is allergic to milk.',
							questionAudio: 'audio/scene1/scene_1_level_2_option_b_customer.mp3',
							questionStyle: {
								borderColor: '#ffd02b',
								right: '30%',
								width: '235px'
							},
							foodworkerText: 'That’s just fine.<br><br>If you don’t mind, I’ll serve up his sorbet first to avoid cross-contact with your Rocky Road.',
							foodworkerAudio: 'audio/scene1/scene_1_level_2_a_foodworker.mp3',
							foodworkerStyle: {
								borderColor: '#5482b2',// foodworker autoplays
								top: '40%',
								left: '30%',
								textAlign: 'left'
							},
							// ending plays customer before feedback
							customerText: 'Wow. Thank you so much!',
							customerAudio: 'audio/scene1/scene_1_level_2_a_customer.mp3',
							feedbackText: 'Nice work. This mother is very confident that you’ll take good care of her son’s order. Next time they go out for ice cream, she’ll certainly remember your excellent service and return.',
							feedbackAudio: 'audio/scene1/scene_1_level_2_a_feedback.mp3',
							isEndScene: true,
							nextStep: -1
						},
					],
					scene2: [
						{
							// Scene2 stepNum[0]
							sceneLeftBackground: 'images/scene2/DM72_110080_26b_00_red_color.png',
							sceneRightBackground: 'images/scene2/DM72_110080_26b_01_japanese_steakhouse_restaurant_employee_waitress_customers_ordering.png',
							questionText: 'What options do you have on the menu that would be safe for me to eat?',
							questionAudio: 'audio/scene2/scene_2_level_1_customer.mp3', // path to audio/filename.mp3
							questionStyle: {
								borderColor: '#ffd02b',// yellow
								right: '30%',
								width: '240px'
							},
							answers: [
								{
									id: 0, nextStep: 1,
									foodworkerText: 'Almost everything we make has fish in it. You can pick whatever you want and we’ll try to make it without fish, but I can’t make any promises.',
									foodworker: 'audio/scene2/scene_2_level_1_option_a_foodworker.mp3',
									customerText: 'Ok... maybe I’ll just get a drink then.',
									customerAudio: 'audio/scene2/scene_2_level_1_option_a_customer.mp3',
									feedbackText: 'Careful! You’re on your way to losing a customer. Clearly she doesn’t feel confident enough with your response to order off the menu. Try again.',
									feedbackAudio: 'audio/scene2/scene_2_level_1_option_a_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_01_japanese_steakhouse_restaurant_employee_customer_resigned.png'
								}, {
									id: 1, nextStep: 2,
									foodworkerText: 'As long as you avoid sushi, you should be fine.',
									foodworker: 'audio/scene2/scene_2_level_1_option_b_foodworker.mp3',
									customerText: 'Ok, I’ll get the tempura chicken.',
									customerAudio: 'audio/scene2/scene_2_level_1_option_b_customer.mp3',
									feedbackText: 'This situation could be very dangerous. You do not know enough about her allergy to be able to tell her whether the dish she has ordered will be safe for her to eat. What if your fryer has been cross-contacted with an allergen that could harm her, like shrimp? You need to find out more information. Try again.',
									feedbackAudio: 'audio/scene2/scene_2_level_1_option_b_feedback.mp3',
									background: ''
								}, {
									id: 2, nextStep: 3,
									foodworkerText: 'It would help us better serve you if you explained your allergy a little bit. Are you allergic to shellfish or fin fish like salmon or halibut? Or both?',
									foodworker: 'audio/scene2/scene_2_level_1_option_c_foodworker.mp3',
									customerText: 'I have had severe allergic reactions to shrimp and lobster in the past.<br><br>A few months ago I think I had a slight reaction to some fish tacos.',
									customerAudio: 'audio/scene2/scene_2_level_1_option_c_customer.mp3',
									feedbackText: 'Great job. Learning as much as you can about the customer’s allergy will help you find an entree that is safe for her to eat. ',
									feedbackAudio: 'audio/scene2/scene_2_level_1_option_c_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_01_japanese_steakhouse_restaurant_employee_waitress_customers_ordering.png'
								}
							]
						},
						{
							// stepNum[1] level_1_option_a
							// questionText: 'Ok... maybe I’ll just get a drink then.',
							// questionAudio: 'audio/scene2/scene_2_level_1_option_a_customer.mp3',
							questionStyle: {
								borderColor: '#ffd02b',// yellow
								right: '30%',
								width: '240px'
							},
							answers: [
								{
									id: 0, nextStep: 2,
									foodworkerText: 'As long as you avoid sushi, you should be fine.',
									foodworker: 'audio/scene2/scene_2_level_1_option_b_foodworker.mp3',
									customerText: 'Ok, I’ll get the tempura chicken.',
									customerAudio: 'audio/scene2/scene_2_level_1_option_b_customer.mp3',
									feedbackText: 'This situation could be very dangerous. You do not know enough about her allergy to be able to tell her whether the dish she has ordered will be safe for her to eat. What if your fryer has been cross-contacted with an allergen that could harm her, like shrimp? You need to find out more information. Try again.',
									feedbackAudio: 'audio/scene2/scene_2_level_1_option_b_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_01_japanese_steakhouse_restaurant_employee_waitress_customers_ordering.png'
								}, {
									id: 1, nextStep: 3,
									foodworkerText: 'It would help us better serve you if you explained your allergy a little bit. Are you allergic to shellfish or fin fish like salmon or halibut? Or both?',
									foodworker: 'audio/scene2/scene_2_level_1_option_c_foodworker.mp3',
									customerText: 'I have had severe allergic reactions to shrimp and lobster in the past.<br><br>A few months ago I think I had a slight reaction to some fish tacos.',
									customerAudio: 'audio/scene2/scene_2_level_1_option_c_customer.mp3',
									feedbackText: 'Great job. Learning as much as you can about the customer’s allergy will help you find an entree that is safe for her to eat. ',
									feedbackAudio: 'audio/scene2/scene_2_level_1_option_c_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_01_japanese_steakhouse_restaurant_employee_waitress_customers_ordering.png'
								}
							]
						},
						{
							// stepNum[2] level_1_option_b
							// questionText: 'Ok, I’ll get the tempura chicken.',
							// questionAudio: 'audio/scene2/scene_2_level_1_option_b_customer.mp3', // path to audio/filename.mp3
							questionStyle: {
								borderColor: '#ffd02b',// yellow
								right: '30%',
								width: '200px'
							},
							answers: [
								{
									id: 0, nextStep: 1,
									foodworkerText: 'Almost everything we make has fish in it. You can pick whatever you want and we’ll try to make it without fish, but I can’t make any promises.',
									foodworker: 'audio/scene2/scene_2_level_1_option_a_foodworker.mp3',
									customerText: 'Ok... maybe I’ll just get a drink then.',
									customerAudio: 'audio/scene2/scene_2_level_1_option_a_customer.mp3',
									feedbackText: 'Careful! You’re on your way to losing a customer. Clearly she doesn’t feel confident enough with your response to order off the menu. Try again.',
									feedbackAudio: 'audio/scene2/scene_2_level_1_option_a_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_01_japanese_steakhouse_restaurant_employee_customer_resigned.png'
								}, {
									id: 1, nextStep: 3,
									foodworkerText: 'It would help us better serve you if you explained your allergy a little bit. Are you allergic to shellfish or fin fish like salmon or halibut? Or both?',
									foodworker: 'audio/scene2/scene_2_level_1_option_c_foodworker.mp3',
									customerText: 'I have had severe allergic reactions to shrimp and lobster in the past.<br><br>A few months ago I think I had a slight reaction to some fish tacos.',
									customerAudio: 'audio/scene2/scene_2_level_1_option_c_customer.mp3',
									feedbackText: 'Great job. Learning as much as you can about the customer’s allergy will help you find an entree that is safe for her to eat.',
									feedbackAudio: 'audio/scene2/scene_2_level_1_option_c_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_01_japanese_steakhouse_restaurant_employee_waitress_customers_ordering.png'
								}
							]
						},
						{
							// stepNum[3] level_1_option_c
							questionStyle: {
								borderColor: '#ffd02b',// yellow
								right: '30%',
								width: '330px'
							},
							answers: [
								{
									id: 1, nextStep: 4,
									foodworkerText: 'Ok, we should probably eliminate all dishes that have any type of fish, just to be safe.',
									foodworker: 'audio/scene2/scene_2_level_2_option_a_foodworker.mp3',
									customerText: 'The steak and rice bowl looks great. I’ll have that.',
									customerAudio: 'audio/scene2/scene_2_level_3_customer.mp3',
									feedbackText: 'Great choice! Remember, when it comes to food allergies, better safe than sorry! This customer seems unsure about the extent of her allergy, so it is best practice to avoid all types of fish.',
									feedbackAudio: 'audio/scene2/scene_2_level_2_option_a_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_02_japanese_steakhouse_menu_allergens.png'
								}, {
									id: 2, nextStep: 4,
									foodworkerText: 'Perfect. We will avoid shellfish. We have some great alternatives you can choose from.',
									foodworker: 'audio/scene2/scene_2_level_2_option_b_foodworker.mp3',
									customerText: 'The steak and rice bowl looks great. I’ll have that.',
									customerAudio: 'audio/scene2/scene_2_level_3_customer.mp3',
									feedbackText: 'Careful, it sounds like the customer may have additional fish allergies she’s unsure about. It would be safer to avoid all fish dishes.',
									feedbackAudio: 'audio/scene2/scene_2_level_2_option_b_feedback.mp3',
									background: 'images/scene2/DM72_110080_26b_02_japanese_steakhouse_menu_allergens.png'
								}
							]
						},
						{
							// stepNum[4] level_3 DM72_110080_26b_02_japanese_steakhouse_menu_allergens
							// questionText: 'The steak and rice bowl looks great. I’ll have that.',
							// questionAudio: 'audio/scene2/scene_2_level_3_customer.mp3', // path to audio/filename.mp3
							questionStyle: {
								borderColor: '#ffd02b',// yellow
								backgroundColor: '#ffffff',// opaque may need to reset in the next one
								right: '30%',
								width: '230px'
							},
							foodworkerText: 'Excellent choice. We’ll do our best to make sure your meal is kept separate from all fish and shellfish.<br><br>Everyone involved with preparing your meal will wash their hands and put on fresh gloves and use separate equipment to make sure your meal is kept safe from allergens.',
							foodworkerAudio: 'audio/scene2/scene_2_level_3_foodworker.mp3',
							foodworkerStyle: {
								borderColor: '#b23d21',// foodworker autoplays
								top: '10%',
								left: '32%',
								textAlign: 'left'
							},
							nextStep: 5
						},
						{
							// stepNum[5] special case let user select answers to see/hear feedback
							multipleChoice: {
								questionText: 'What do you do next?',
								questionAudio: 'audio/scene2/scene_2_level_3_question.mp3',
								options: [
									{
										optionText: 'Write “FOOD ALLERGY: FISH” on the order slip—the kitchen staff will probably see it and prepare her dish accordingly.',
										optionAudio: 'audio/scene2/scene_2_level_3_option_a.mp3',
										feedbackText: 'This could be dangerous. Notes on order slips are frequently overlooked. Plus, once you’ve written the directions down, it will be easy for you to assume someone else will take care of it and you might forget to follow up. Try again.',
										feedbackAudio: 'audio/scene2/scene_2_level_3_option_a_feedback.mp3',
										correct: false
									},
									{
										optionText: 'Inform your manager and any of your coworkers involved in handling or preparing her meal to ensure they know about her allergies. If possible, check that the cooks wash their hands and put on fresh gloves.',
										optionAudio: 'audio/scene2/scene_2_level_3_option_b.mp3',
										feedbackText: 'Great job. Make sure to explain this to the customer as well, so she feels comfortable with the whole process.',
										feedbackAudio: 'audio/scene2/scene_2_level_3_option_b_feedback.mp3',
										correct: true,// play conclusion
										nextStep: -1,
										nextStepText: 'Great job! Because you were willing to ask the customer a few more questions, you found out information that was critical for the customer’s health. You also did a good job following up with your manager and team and letting the customer know about your allergen control processes.',
										nextStepAudio: 'audio/scene2/scene_2_level_3_a_conclusion.mp3'
									},
									{
										optionText: 'Submit the order normally—since she didn’t order fish, her order should be fine.',
										optionAudio: 'audio/scene2/scene_2_level_3_option_c.mp3',
										feedbackText: 'Uh oh. Remember, even a tiny amount of fish could be dangerous for this customer. Even though she didn’t order a dish with fish in it, the kitchen staff must be aware of the allergies to avoid cross-contact with all fish and shellfish.',
										feedbackAudio: 'audio/scene2/scene_2_level_3_option_c_feedback.mp3',
										correct: false
									}
								]
							}
						}
						],
					scene3: [
						{
						// stepNum[0]
						sceneLeftBackground: 'images/scene3/DM72_110080_26c_00_orange_color.png',
						sceneRightBackground: 'images/scene3/DM72_110080_26c_03_customers_employee_ordering_restaurant.png',
						questionText: 'Hi. I’d like your chicken and berry salad.<br>But I need it without the crushed walnuts.',
						questionAudio: 'audio/scene3/scene_3_level_1_customer.mp3',
						questionStyle: {
							borderColor: '#ffd02b',// yellow
							right: '30%',
							width: '225px'
						},
						answers: [
							{
								id: 0, nextStep: 1,
								foodworkerText: 'Berry chicken salad. Hold the walnuts. Got it. What else?',
								foodworker: 'audio/scene3/scene_3_level_1_option_a_foodworker.mp3',
								feedbackText: 'Careful. You might want to slow down and get some more information about this customer’s order. Try again. ',
								feedbackAudio: 'audio/scene3/scene_3_level_1_option_a_feedback.mp3',
								background: 'images/scene3/DM72_110080_26c_02_customers_teens_employee_restaurant.png'
							},
							{
								id: 1, nextStep: 2,
								foodworkerText: 'No problem. The walnuts come in a separate package on the side, so you can throw them away if you want',
								foodworker: 'audio/scene3/scene_3_level_1_option_b_foodworker.mp3',
								customerText: 'Oh, okay. Well, does the dressing have nuts in it too?',
								customerAudio: 'audio/scene3/scene_3_level_1_option_b_customer.mp3',
								feedbackText: 'This customer is giving you some pretty strong cues about his order. Slow things down and try to get some more information.',
								feedbackAudio: 'audio/scene3/scene_3_level_1_option_b_feedback.mp3',
								background: 'images/scene3/DM72_110080_26c_02_customers_teens_employee_restaurant.png'
							},
							{
								id: 2, nextStep: 3,
								foodworkerText: 'Sure. Now, do you need me to hold the walnuts because you have a nut allergy?',
								foodworker: 'audio/scene3/scene_3_level_1_option_c_foodworker_1.mp3',
								customerText: 'I actually do. I’m allergic to walnuts, hazelnuts, and almonds... that I know of.',
								customerAudio: 'audio/scene3/scene_3_level_1_option_c_customer_1.mp3',
								feedbackText: '',
								feedbackAudio: '',
								background: 'images/scene3/DM72_110080_26c_03_customers_employee_ordering_restaurant.png',
							}
						]
					}, {
						//stepNum[1]
						// questionText: '',
						// questionAudio: '', // path to audio/filename.mp3
						questionStyle: {
							borderColor: '#ffd02b', // yellow
							right: '30%',
							width: '260px'
						},
						answers: [
							{
								id: 0, nextStep: 2,
								foodworkerText: 'No problem. The walnuts come in a separate package on the side, so you can throw them away if you want',
								foodworker: 'audio/scene3/scene_3_level_1_option_b_foodworker.mp3',
								customerText: 'Oh, okay. Well, does the dressing have nuts in it too?',
								customerAudio: 'audio/scene3/scene_3_level_1_option_b_customer.mp3',
								feedbackText: 'This customer is giving you some pretty strong cues about his order. Slow things down and try to get some more information.',
								feedbackAudio: 'audio/scene3/scene_3_level_1_option_b_feedback.mp3',
								background: 'images/scene3/DM72_110080_26c_02_customers_teens_employee_restaurant.png'
							},
							{
								id: 1, nextStep: 3,
								foodworkerText: 'Sure. Now, do you need me to hold the walnuts because you have a nut allergy?',
								foodworker: 'audio/scene3/scene_3_level_1_option_c_foodworker.mp3',
								customerText: 'I actually do. I’m allergic to walnuts, hazelnuts, and almonds... that I know of.',
								customerAudio: 'audio/scene3/scene_3_level_1_option_c_customer_1.mp3',
								feedbackText: '',
								feedbackAudio: '',
								background: ''
							}
						]
					}, {
						//stepNum[2]
						// questionText: '',
						// questionAudio: '',
						questionStyle: {
							borderColor: '#ffd02b', // yellow
							right: '30%',
							width: '260px'
						},
						answers: [
							{
								id: 0, nextStep: 1,
								foodworkerText: 'Berry chicken salad. Hold the walnuts. Got it. What else?',
								foodworker: 'audio/scene3/scene_3_level_1_option_a_foodworker.mp3',
								feedbackText: 'Careful. You might want to slow down and get some more information about this customer’s order. Try again. ',
								feedbackAudio: 'audio/scene3/scene_3_level_1_option_a_feedback.mp3',
								background: '',//'images/scene3/DM72_110080_26c_02_customers_teens_employee_restaurant.png'
							},
							{
								id: 1, nextStep: 3,
								foodworkerText: 'Sure. Now, do you need me to hold the walnuts because you have a nut allergy?',
								foodworker: 'audio/scene3/scene_3_level_1_option_c_foodworker_1.mp3',
								customerText: 'I actually do. I’m allergic to walnuts, hazelnuts, and almonds... that I know of.',
								customerAudio: 'audio/scene3/scene_3_level_1_option_c_customer_1.mp3',
								feedbackText: '',
								feedbackAudio: '',
								background: ''
							}
						]
					}, {
						//stepNum[3]
						// questionText: '',
						// questionAudio: '',
						questionStyle: {
							borderColor: '#ffd02b', // yellow
							right: '30%',
							width: '260px'
						},
						foodworkerText: 'No problem. We’ll put together your salad separate from the others so it’s not cross-contacted by any tree nuts.<br><br>I suggest getting the vinaigrette dressing, since it’s nut-free.',
						foodworkerAudio: 'audio/scene3/scene_3_level_1_option_c_foodworker_2.mp3',
						foodworkerStyle: {
							borderColor: '#dd8e3c', // foodworker autoplays
							bottom: '15%',
							left: '32%',
							width: '340px'
						},
						customerText: 'That would be great! Thanks so much.',
						customerAudio: 'audio/scene3/scene_3_level_1_option_c_customer_2.mp3',
						noAnswers: true,
						nextStep: 4,
						// background: 'images/scene3/DM72_110080_26c_04_manager_employee_restaurant_customers.png'
					}, {
						//stepNum[4] Manager
						sceneRightBackground: 'images/scene3/DM72_110080_26c_04_manager_employee_restaurant_customers.png',
						questionStyle: {
							borderColor: '#ffd02b', // yellow
							right: '30%',
							width: '260px'
						},
						foodworkerText: 'I’m sorry to have kept you waiting. I’ve just been informed you have a nut allergy. My whole team should have already known that we can easily make your order without nuts.<br><br>We’ll just prepare it separately from the other salads. I’ll follow up with everyone behind the counter to make sure hands are washed and they put on fresh gloves.',
						foodworkerAudio: 'audio/scene3/scene_3_level_2_manager.mp3',
						foodworkerStyle: {
							borderColor: '#ca4933', // Manager
							bottom: '15%',
							right: '10%',
							width: '600px'
						},
						customerText: 'Okay, thanks.',
						customerAudio: 'audio/scene3/scene_3_level_2_customer.mp3',
						noAnswers: true,
						nextStep: 5,
						feedbackText: 'Well, you made it through the ordering process and your customer will be safe, but it doesn\'t seem like you’ve built up much trust with the customer. Why don’t you replay this activity and try again from the beginning?',
						feedbackAudio: 'audio/scene3/scene_3_level_2_feedback.mp3'
					}, {
						//stepNum[5] Manager conclusion
						sceneRightBackground: 'images/scene3/DM72_110080_26c_05_customer_employee_compliment_praise_good_job_teach.png',
						foodworkerText: 'I just finished walking around the dining room and a young man with a nut allergy told me that you were very careful about taking his order. He said he’ll be back again because his experience was so positive. Keep up the good work!',
						foodworkerAudio: 'audio/scene3/scene_3_level_2_a_manager.mp3',
						foodworkerStyle: {
							borderColor: '#ca4933', // Manager
							bottom: '15%',
							right: '10%',
							width: '600px'
						},
						noAnswers: true,
						nextStep: -1, // End of all scenes, trigger Conclusion
						feedbackText: 'What more can I say? You did a great job!',
						feedbackAudio: 'audio/scene3/scene_3_level_2_a_feedback.mp3'
					}]
				},

				/**
				 * scenes {Array} = [this.slideData.scene1, this.slideData.scene2, this.slideData.scene3]
				 * sceneNum {int} - prop: array index of the scene to display
				 * currentScene: = sceneNum. increments to the next scene
				 * stepNum: {int} - index of the slideData and determines what to display in the scene-right panel
				 * currentStep {Object} - the object at slideData.currentScene[stepNum] displayed by the template
				 */
				scenes: [],
				currentSene: 0,
				stepNum: 0,
				currentStep: null,// this.scenes[this.currentScene][this.stepNum];

				/**
				 * showFeedback toggles fadeIn/fadeOut for the feedback SpeechBubble
				 * isFeedback: determines if the feedback audio was played, check at audioEnded
				 * noFeedback: this answer has no feedback
				 * background: answer[selectedAnswer].background image
				 * sceneLeft & sceneRight: DOM element to change background image on
				 * specialItem: show the AnalogClock
				 * showSpecialItem: true to display the clock on the wall (or any other special item)
				 * customerQue: plays before feedback
				 * customerText: displays before feedback
				 * feedbackQue: if set to a filename, play it when the current audio has ended
				 * feedbackTimer: wait for feedback fadeOut before switching text
				 * feedbackStyle: is the same for all feedback SpeechBubble
				 */
				showFeedback: false,
				isFeedback: false,
				noFeedback: false,
				background: '',
				sceneLeft: null,
				sceneRight: null,
				specialItem: false,// AnalogClock
				showSpecialItem: true,
				multipleChoice: {}, // MultiChoice object
				showMultiChoice: false,
				customerQue: null,
				customerText: '',
				feedbackQue: null,
				feedbackTimer: null,
				feedbackText: '',
				feedbackStyle: {
					borderColor: '#000000',
					bottom: '60px',
					width: '70%',
					textAlign: 'left'
				},

				/**
				 * showQuestion: toggles the fadeIn for customer SpeechBubble
				 * showAnswers: toggles the fadeIn for foodworker answer buttons
				 * buttonsDisabled: disables the buttons while the audio plays. (doesn't affect hover)
				 * stepTimer: waits for fadeOut animation before advancing the currentStep
				 * waitTimer: a setTimeout for displaying the specialItem (clock) and wait to display foodworker answer
				 * selectedAnswer: slideData[#].answer.id
				 * nextStep: slideData[#].answer.nextStep to use in audioEnded()
				 */
				showQuestion: false,
				showFoodworker: false,
				foodworkerQue: null, // play after questionAudio
				isFoodworker: false, // foodworker audio just ended
				showAnswers: false,
				buttonsDisabled: false,
				stepTimer: null,
				waitTimer: null,
				selectedAnswer: 0,
				nextStep: 0
			}
		},
		watch: {
			/**
			 * when the Scene becomes visible,
			 * add an audio element, not attached to the DOM
			 * listen for 'ended' event to handle progress
			 * listen to the LMS for volume changes and sets the audio volume
			 * play the first audio file
			 */
			sceneVisible: {
				immediate: true,
				handler(newstate) {
					//console.log('--- sceneVisible:', newstate, 'sceneNum:', this.sceneNum);
					// this.currentScene = 2;// TEST start at scene
					// this.debug = true;// show conclusion when done
					this.currentScene = this.sceneNum;
					if (newstate) {
						if (this.scenes.length === 0) {
							var keys = Object.keys(this.slideData);
							var me = this;
							keys.forEach(function(key) {
								me.scenes.push(me.slideData[key]);
							});
							//console.log('scenes:', this.scenes);
							//console.log('currentScene:', this.currentScene, 'stepNum:', this.stepNum);
							//console.log('currentScene:', this.scenes[this.currentScene][this.stepNum]);
						}

						// create an audio element in memory, not attached to the DOM
						this.audioplayer = document.createElement('audio', {id: 'audioplayer222', ref: 'audioplayer', crossdomain: 'anonymous'});
						this.audioplayer.addEventListener('ended', this.audioEnded);
						// add the LMS postMessage listener to set the audioplayer.volume
						window.addEventListener("message", this.adjustAudioVolume, false);
						// test postMessage to set volume
						// var testobj = {
						// 	origin: 'https://statefoodsafety.com',
						// 	data: {volume: 0.2}
						// };
						// this.adjustAudioVolume(testobj);

						this.$nextTick(function () {
							// sceneLeft and Right background images are loaded when the scene becomes visible
							this.sceneLeft = document.getElementsByClassName('scene-left')[0];
							this.sceneRight = document.getElementsByClassName('scene-right')[0];
						});
					}
				}
			},
			stepNum: {
				immediate: true,
				handler(n) {
					//console.log('--- watch stepNum:', n);
					if (n !== -1) {
						// set currentStep to get answers for template
						this.currentStep = this.scenes[this.currentScene][this.stepNum];
						//console.log('--- currentScene:', this.currentScene, 'currentStep:', this.stepNum, this.currentStep);

						this.$nextTick(function () {
							if (!this.currentStep.waitTime) {
								this.showSpecialItem = false;// hide the clock
								this.specialItem = null;
							}

							// Fix: /dist/ is having problems obtaining css background images.
							if (this.currentStep.sceneLeftBackground) {
								this.sceneLeft.style.backgroundImage = "url('" + this.currentStep.sceneLeftBackground + "')";
							}
							if (this.currentStep.sceneRightBackground) {
								this.sceneRight.style.backgroundImage = "url('" + this.currentStep.sceneRightBackground + "')";
							}

							if (n === 0) {
								// play the first customer questionAudio and animate text
								this.playAudioFile(this.currentStep.questionAudio);
								this.showAnswers = this.showQuestion = true;
							}
						});
					}
				}
			}
		},
		created() {
			this.$nextTick(function () {
				/**
				 * cache each background image so it will be displayed faster
				 * @var temp - add paths to an array and check if they were cached already
				 */
				//console.log('--- Scene created');
				var temp = [];
				//console.log('scenes', this.scenes);
				this.scenes.forEach(function(scene) {
					//console.log('scene:', scene);
					scene.forEach(function(step) {
						if (step.sceneRightBackground && !~temp.indexOf(step.sceneRightBackground)) {
							//console.log('preload:', step.sceneRightBackground);
							var cacheimg = new Image(50, 50);
							cacheimg.src = step.sceneRightBackground;
						}
						if (step.answers) {
							step.answers.forEach(function(answer) {
								if (answer.background && !~temp.indexOf(answer.background)) {
									temp.push(answer.background);
									//console.log('preload:', answer.background);
									var cacheimg = new Image(50, 50);
									cacheimg.src = answer.background;
								}
							});
						}
					});
				});
				temp = null;
			});
		},
		methods: {
			/**
			 * When the user selects an answer in the scene-left panel
			 * use nextStep to determine next slideData.scene[stepNum].question and answers
			 * hide the feedback triggers fadeOut animation
			 * play the foodworker audio
			 * setup the feedback audio in a Que to play when foodworker is 'ended'
			 * feedbackTimer waits to set the feedbackText until fadeOut is complete
			 * answer.id determines the feedbackText when it re-appears
			 * pause to trigger the fadeIn animation on the feedback
			 *
			 * @param answer {object} - id, nextStep, foodworker (audio filename)
			 * @var me - this inside the function
			 */
			answerSelected: function(answer) {
				//console.log('answerSelected: id:', answer.id, 'nextStep', answer.nextStep);
				if (this.buttonsDisabled) {
					return;
				}

				if (!answer.feedbackText) {
					//console.log('set noFeedback');
					this.noFeedback = true;
				}

				// if customerAudio, play the customer audio before the feedback
				if (answer.customerAudio) {
					this.customerQue = answer.customerAudio;
					this.customerText = answer.customerText;
					this.showQuestion = false;// fadeOut
				}

				this.showFeedback = false;
				this.buttonsDisabled = true;
				this.nextStep = answer.nextStep;

				// setup feedback for audioEnded()
				this.feedbackText = answer.feedbackText;
				this.feedbackQue = answer.feedbackAudio;
				this.playAudioFile(answer.foodworker);

				// mark non-selected answers until done with this answer
				//console.log('answers:', this.$children[0].$children);
				this.$children[0].$children.forEach(function(btn, index) {
					if (index !== answer.id) {
						btn.$el.classList.add('answer-disabled');
					} else {
						btn.$el.classList.add('answer-selected');
					}
				});

				// setup background image change if needed
				this.background = answer.background ? answer.background : '';
				this.specialItem = answer.specialItem ? answer.specialItem : '';
				//console.log('setup: bkg:', this.background, 'spcl:', this.specialItem);

				// wait until fadeOut is completed before changing feedback text
				var me = this;
				this.feedbackTimer = setTimeout(function() {
					me.selectedAnswer = answer.id;
					clearTimeout(me.feedbackTimer);
				}, 1000);
			},

			/**
			 * When the correct answer is selected
			 * hide the MultiChoice component
			 * set nextStep and isFeedback
			 * show the feedback text and play its audio
			 */
			multipleChoiceCorrect: function(item) {
				//console.log('multipleChoiceCorrect:', item);
				// set nextStep, set isFeedback, play conclusion
				if (item.correct && item.nextStep) {
					this.showMultiChoice = false;
					this.nextStep = item.nextStep;
					this.isFeedback = true;
					this.feedbackText = item.nextStepText;
					this.showFeedback = true;
					this.playAudioFile(item.nextStepAudio);
				}
			},

			/**
			 * set the audio element src = filename and play it
			 */
			playAudioFile: function(filename) {
				//console.log('playAudioFile:', filename);
				this.audioplayer.src = filename;
				this.audioplayer.volume = this.audioVolume;
				this.audioplayer.play();
			},

			/**
			 * if the LMS sends a postMessage for volume, adjust the volume of the audioplayer
			 */
			adjustAudioVolume: function(e) {
				//console.log('postMessage origin:', e.origin);
				if (e.data && e.origin === 'https://statefoodsafety.com') {
					//console.log('data:', e.data);
					this.audioVolume = parseFloat(e.data['volume']);
					this.audioplayer.volume = parseFloat(e.data['volume']);
				}
			},

			/**
			 * When an audio file ends, play the next file in the que
			 * use this.nextStep to determine which slideData to display
			 */
			audioEnded: function() {
				//console.log('audio ended: stepNum:', this.stepNum, 'nextStep:', this.nextStep, 'file:', this.audioplayer.src);
				var me = this;// scope for timeout function

				if (this.specialItem) {
					//console.log('show SPECIALITEM', this.specialItem);
					this.showSpecialItem = true;
				}

				// change the background for answer feedback
				if(this.background) {
					//console.log('CHANGE background:', this.background);
					this.sceneRight.style.backgroundImage = "url('"+this.background+"')";
					this.background = '';
				}

				if (this.isFoodworker) {
					//console.log('hide foodworker');
					this.isFoodworker = false;
					this.foodworkerQue = null;
					this.showFoodworker = false;// fadeOut
					this.showSpecialItem = false;// hide the clock hack, needs work
					this.specialItem = null;
					this.isFeedback = true;// so feedback completed will fire?
				}
				if (this.foodworkerQue) {
					//console.log('play foodworkerQue');
					this.showQuestion = false;
					this.showFoodworker = true;// fadeIn
					this.isFoodworker = true;
					this.playAudioFile(this.currentStep.foodworkerAudio);
					this.foodworkerQue = null;

					return;
				}

				// change the background for answer feedback
				if(this.background) {
					//console.log('CHANGE background:', this.background);
					this.sceneRight.style.backgroundImage = "url('"+this.background+"')";
					this.background = '';
				}
				if (this.customerQue) {
					//console.log('play customerQue', this.customerQue);
					this.currentStep.questionText = this.customerText;
					this.showQuestion = true;// fadeIn
					this.playAudioFile(this.customerQue);
					this.customerQue = null;
					this.customerText = null;

					return;
				}


				/**
				 * if this answer has feedbackText play the audio
				 * set isFeedback to true so audioEnded knows when it can advance
				 */
				if (this.feedbackQue) {
					//console.log('play feedback:', this.feedbackQue);
					this.showFeedback = true;// fadeIn
					this.showQuestion = false;// fadeOut

					// hide the clock
					if (!this.specialItem) {
						//console.log('hide SPECIALITEM:',this.specialItem);
						this.showSpecialItem = false;
					}

					if (this.currentStep.waitTime) {
						//console.log('Wait for ', this.currentStep.waitTime);
						this.showAnswers = false;
					}

					this.playAudioFile(this.feedbackQue);
					this.feedbackQue = null;
					this.isFeedback = true;

					return;
				}

				/**
				 * handle special case, no feedbackText
				 */
				if (this.noFeedback) {
					//console.log('-- NO feedback:', this.stepNum, this.nextStep);
					this.noFeedback = false;
					this.buttonsDisabled = false;
					this.showAnswers = false;
					this.showFeedback = false;// fadeOut

					// change the background
					if(this.background) {
						//console.log('CHANGE background:', this.background);
						this.sceneRight.style.backgroundImage = "url('"+this.background+"')";
					}

					// hide the clock
					if (!this.specialItem) {
						//console.log('hide SPECIALITEM:',this.specialItem);
						this.showSpecialItem = false;
					}

					if (this.stepNum !== this.nextStep) {
						// wait to fadeIn the next answer
						//console.log('- Case: stepNum !== nextStep');
						this.stepTimer = setTimeout(function() {
							me.stepNum = me.nextStep;
							me.$nextTick(function () {
								me.resetAnswers();
								me.currentStep = me.scenes[me.currentScene][me.stepNum];

								/**
								 * the multipleChoice question with answers will display in the right panel
								 * select an answer to see the feedback
								 * if correct ...
								 */
								if (me.currentStep.multipleChoice) {
									//console.log('show Multiple Choice');
									me.showMultiChoice = true;
									me.multipleChoice = me.currentStep.multipleChoice;

									return;
								}

								if (me.currentStep.questionAudio) {
									//console.log('play questionAudio', me.currentStep.questionAudio);
									me.showQuestion = true;// fadeIn
									me.playAudioFile(me.currentStep.questionAudio);
								}
								if (me.currentStep.foodworkerAudio) {
									//console.log('- setup foodworkerQue', me.currentStep.foodworkerAudio);
									me.foodworkerQue = me.currentStep.foodworkerAudio;
									if (!me.currentStep.questionAudio) {
										//console.log('-- play foodworker Now because there is no question --');
										me.showQuestion = false;
										me.showFoodworker = true;// fadeIn
										me.isFoodworker = true;
										me.foodworkerQue = null;
										me.playAudioFile(me.currentStep.foodworkerAudio);
									}
								}
								if (me.currentStep.customerAudio) {
									//console.log('- setup customerQue', me.currentStep.customerAudio);
									me.customerText = me.currentStep.customerText;
									me.customerQue = me.currentStep.customerAudio;
								}
								if (me.currentStep.feedbackAudio) {
									//console.log('- setup feedbackQue', me.currentStep.feedbackAudio);
									me.feedbackText = me.currentStep.feedbackText;
									me.feedbackQue = me.currentStep.feedbackAudio;
								}

								if (me.currentStep.nextStep) {
									me.nextStep = me.currentStep.nextStep;
								}

								if (me.currentStep.answers) {
									me.showAnswers = true;
								}

								/**
								 * special case, there are no answers but need to play another audio file after this one is done.
								 * que up the customer and feedback audio if they exist
								 * customer will play before feedback
								 */
								if (me.currentStep.noAnswers) {
									//console.log('- noAnswers Setup - NO feedback -');
									if (me.currentStep.customerAudio) {
										me.customerText = me.currentStep.customerText;
										me.customerQue = me.currentStep.customerAudio;
									}
									if (me.currentStep.feedbackAudio) {
										me.feedbackText = me.currentStep.feedbackText;
										me.feedbackQue = me.currentStep.feedbackAudio;
									}
									if (me.currentStep.background) {
										me.background = me.currentStep.background;
									}
									// always include a next step to advance to
									me.nextStep = me.currentStep.nextStep;
								}
								//console.log('-- end NO feedback:', me.currentStep);
							});
							clearTimeout(me.waitTimer);
						}, 1000);
					}

					return;
				}

				/**
				 * if feedback audio just ended we can advance to the nextStep
				 * reset isFeedback and hide the feedback SpeechBubble
				 *
				 *
				 * reset the classList on answer buttons
				 * advance stepNum to the next step
				 * change the background-image if needed
				 * play the question audio
				 * enable the answer buttons
				 */
				if (this.isFeedback) {
					//console.log('feedback completed');
					this.isFeedback = false;
					this.showFeedback = false;// fadeOut
					this.showAnswers = false;// fadeOut
					this.buttonsDisabled = false;

					// reset answer classList
					this.resetAnswers();

					// hide the clock
					if (!this.specialItem) {
						//console.log('hide SPECIALITEM:',this.specialItem);
						this.showSpecialItem = false;
					}

					this.$nextTick(function () {
						/**
						 * handle END of Scene
						 * send the sceneCompleted event to App.vue
						 */
						if (this.nextStep === -1) {
							//console.log('END OF SCENE: currentScene:', this.currentScene, 'stepNum:', this.stepNum, 'nextStep:', this.nextStep);

							this.currentScene += 1;// next scene
							this.nextStep = 0;// first step
							if (this.mustComplete === 'one' || this.debug) {
								this.$emit('sceneCompleted');
								return;
							}
							if (this.currentScene === this.scenes.length) {
								//console.log('Done with all scenes');
								this.$emit('announceCompleted', this.userScore);
								return;
							}
							// fall through and continue playing next scene
						}

						/**
						 * Advance to the next slide
						 * set currentStep, show the next question and play next questionAudio
						 * stepTimer waits for animations to complete before advancing to nextStep
						 */
						this.stepTimer = setTimeout(function() {
							me.stepNum = me.nextStep;
							me.currentStep = me.scenes[me.currentScene][me.stepNum];
							//console.log('feedback completed: currentScene:', me.currentScene, me.stepNum);

							// start MultiChoice component
							if (me.currentStep.multipleChoice) {
								//console.log('show Multiple Choice');
								me.showMultiChoice = true;
								me.multipleChoice = me.currentStep.multipleChoice;

								return;
							}

							/**
							 * special case, there are no answers but need to play another audio file after this one is done.
							 * que up the customer and feedback audio if they exist
							 * customer will play before feedback
							 */
							if (me.currentStep.noAnswers) {
								//console.log('- noAnswers Setup -', me.currentStep.nextStep);
								if (me.currentStep.customerAudio) {
									me.customerText = me.currentStep.customerText;
									me.customerQue = me.currentStep.customerAudio;
								}
								// Had problems here but maybe re-visit
								// when the manager text is blue and the customer needs to be yellow again
								// if (me.currentStep.customerStyle) {
								// 	me.currentStep.questionStyle = me.currentStep.customerStyle;
								// }
								if (me.currentStep.feedbackAudio) {
									me.feedbackText = me.currentStep.feedbackText;
									me.feedbackQue = me.currentStep.feedbackAudio;
								}
								if (me.currentStep.background) {
									me.background = me.currentStep.background;
								}
								// always provide a next step to advance to
								me.nextStep = me.currentStep.nextStep;
							}

							if (me.currentStep.questionAudio) {
								//console.log('play next question');
								if (me.currentStep.foodworkerAudio) {
									//console.log('- setup foodworkerQue');
									me.foodworkerQue = me.currentStep.foodworkerAudio;
								}
								// play next question
								me.showQuestion = true;// fadeIn
								me.playAudioFile(me.currentStep.questionAudio);
							} else if (me.currentStep.foodworkerAudio) {
								//console.log('play foodworker');
								me.showQuestion = false;
								me.showFoodworker = true;// fadeIn
								me.isFoodworker = true;
								me.playAudioFile(me.currentStep.foodworkerAudio);
							}

							if (me.currentStep.nextStep) {
								me.nextStep = me.currentStep.nextStep;
							}

							if (me.currentStep.waitTime) {
								// fadeIn answers after times up
								me.waitTimer = setTimeout(function() {
									me.showAnswers = true;
									//console.log('waitTimer done', me.currentStep);

									// change background and advance to next step
									if (me.currentStep.background) {
										me.sceneRight.style.backgroundImage = "url('"+me.currentStep.background+"')";
										me.background = '';
										//me.background = me.currentStep.background;
									}
									me.nextStep = me.currentStep.nextStep;
									me.isFeedback = true;
									me.audioEnded();
									clearTimeout(me.waitTimer);
								}, me.currentStep.waitTime);
							} else {
								if (me.currentStep.answers) {
									// fadeIn answers now
									me.showAnswers = true;
								}
							}
							clearTimeout(me.stepTimer);
						}, 800);// END stepTimer timeout
					});// END nextTick
				}
			},

			/**
			 * reset the classList on the answer buttons before the next question
			 */
			resetAnswers: function() {
				//console.log('resetAnswers:', this.currentStep.answers);
				this.$children[0].$children.forEach(function(btn) {
					//console.log(btn);
					btn.$el.classList.remove('answer-disabled');
					btn.$el.classList.remove('answer-selected');
					btn.$el.style.display = 'block';
				});
			},

			/**
			 * Velocity v2 - animate the fadIn/fadeOut and answer buttons
			 * https://github.com/julianshapiro/velocity/wiki
			 * https://github.com/julianshapiro/velocity/wiki/Advanced---Forcefeeding
			 * transform: ["to", "from"]
			 * https://github.com/julianshapiro/velocity/wiki/Option---Stagger
			 * stagger won't work on answers because (el) is the specific element not a group
			 * speech transition is used for MultipleChoice, customer and feedback
			 */
			speechBefore: function(el) {
				el.style.opacity = 0;
			},
			speechEnter: function(el, done) {
				Velocity(el, {
					opacity: 1,
					transform: ["translateY(0px)", "translateY(30px)"]
				}, {
					duration: 500,
					delay: 300
				}, { complete: done });
			},
			speechLeave: function(el, done) {
				Velocity(el, {
					opacity: 0
				}, { duration: 300 }, { complete: done });
			},
			// animate the answer buttons fade and slide
			answerBefore: function(el) {
				el.style.opacity = 0;
			},
			answerEnter: function (el, done) {
				//console.log('what is done:', done);
				Velocity(el, {
					opacity: 1,
					transform: ["translateY(0px)", "translateY(30px)"]
				}, {
					duration: 500// fadeIn slower
				}, { complete: done });
			},
			answerLeave: function (el, done) {
				Velocity(el, {
					opacity: 0,
					transform: ["translateY(60px)", "translateY(0px)"]
				}, {
					duration: 300// fadeOut quickly
				}, { complete: done });
			}
		}
	}
</script>

<style>
	.scene {
		display: flex;
		width: 97.7vw;
		height: 90.7vh;
	}

	.scene-left {
		width: 20vw;
		height: 89vh;
		float: left;
		margin: 5px;
		border-radius: 12px;
		border: 5px solid black;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center center;
	}

	.scene-right {
		width: 76.7vw;
		height: 89vh;
		float: left;
		margin: 5px;
		border-radius: 12px;
		border: 5px solid black;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center center;
	}

	.scene-content {
		padding: 2.5%;
		width: 95%;
	}

	.feedback-bubble {
		font-size: larger;
	}

	.instruct {
		font-weight: bold;
	}

	/* added at answerSelected  */
	.answer-disabled {
		color: #a3a3a3;
	}
	.answer-disabled:hover {
		color: #a3a3a3;
		border: 3px solid #606060;
	}
	.answer-selected {
		color: #000000;
		border: 3px solid #000000;
	}

	.wall-clock {
		position: absolute;
	}
	.multiple-choice {
		padding: 6.5% 10%;
	}

	@media (max-width: 1024px) {
		.customer-bubble {
			right: 20% !important;
		}
		.feedback-bubble {
			width: 68% !important;
		}
	}
	@media (max-width: 830px) {
		.scene-left, .scene-right {
			height: 89vh;
			border-width: 2px;
		}
		.scene-left {
			width: 25vw;
		}
		.customer-bubble {
			bottom: 20%;
			right: 10% !important;
		}
		.foodworker-bubble {
			max-width: 390px;
		}
		.feedback-bubble {
			font-size: medium;
			width: 66% !important;
		}
		.answer-button {
			margin: 4px 0;
			border-width: 2px;
		}
		answer-disabled:hover {
			border-width: 2px;
		}
		answer-selected {
			border-width: 2px;
		}
		.multiple-choice {
			transform: translate(-20px, -35px) !important;
		}
	}
	@media (max-width: 670px) {
		.scene-left, .scene-right {
			height: 92vh;
			border-width: 2px;
		}
		.scene-left {
			width: 36vw;
		}
		.customer-bubble {
			right: 3% !important;
			max-width: 58%;
		}
		.foodworker-bubble {
			left: 35% !important;
			max-width: 330px;
		}
		.feedback-bubble {
			font-size: medium;
			width: 57% !important;
		}
		.multiple-choice {
			padding: 3%;
			transform: translate(-20px, -20px) !important;
		}
	}
</style>
