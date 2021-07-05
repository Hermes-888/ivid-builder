```vue
/**
 * selectedCard is set by selectedCardValue() when a radio card is selected
 * cards are an array of objects that define the content of each Radio Card
 *
 *   selected: true, signifies this card will be auto-selected when initialized 
 *   title: blue header
 *   value: must be unique for each card, gets emitted when selected
 *   uppertext: expandable top white content
 *   line1text: text for 1st line of expandable blue content
 *   line1amount: bolder text on 1st line of blue content
 *   line2text: text for 2nd line of blue content
 *   outside: text or html displayed below the selectable radio card. rendered once when initialized
 */
const selectedCard = null;
const cards =  [{
    title: 'Testing Center',
    value: 'center',
    uppertext: 'Monitored at a local testing center',
    line1text: 'Proctor Fee: ',
    line1amount: '$50.00',
    line2text: '+ $78.00 Training & Exam'
}, {
    selected: true,
    title: 'Online',
    value: 'online',
    uppertext: 'Monitored via webcam & microphone in a warm cozy place of your choosing',
    line1text: 'Proctor Fee: ',
    line1amount: '$46.00',
    line2text: '+ $78.00 Training & Exam unless you object to extra fees',
    outside: 'Details'
}, {
    title: 'Employer Provided',
    value: 'employer',
    uppertext: 'Monitored by an StateFoodSafey proctor',
    line1text: 'Proctor Fee: ',
    line1amount: 'Varies',
    line2text: 'For details, talk to your supervisor',
    outside: '<a href="https://www.statefoodsafety.com" target="blank" title="Opens in a new tab">Learn More</a>'
}];

/**
 * selecting a radio card will emit its value
 * listen for cardselected to set selectedCard
 *
 * @param value of the selected card defined in data.cards[]
 */
const selectedCardValue = function(value) {
    this.selectedCard = value;
    console.log('selected card value:', this.selectedCard);
}


<RadioCard
    name="RadioCardsGroup"
    :cards="cards"
    @cardselected="selectedCardValue"
/>
<!-- cardselected is emitted and sends the card value -->
```
