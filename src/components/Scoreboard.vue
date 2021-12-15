<template>
  <div class="scoreboard-container">
    <div class="score-group"
      @click="hideScoreboard"
      :style="{
        width: mcData.panelWidth,
        color: mcData.textColor,
        backgroundColor: mcData.panelBkgColor
      }"
    >
      <div class="text" v-text="mcData.text"></div>
      <div class="score" v-text="scoreNum"></div>
      <div class="slash">/</div>
      <div class="possible" v-text="mcData.possible"></div>
    </div>
  </div>
</template>

<script>
/**
 * Velocity v2 - animate
 * https://github.com/julianshapiro/velocity/wiki
 * https://github.com/julianshapiro/velocity/wiki/Advanced---Forcefeeding
 * transform: ["to", "from"]
 */
// import Velocity from 'velocity-animate';// main.js

export default {
  /**
   * Scoreboard text: score / possible
   * animate internally?
   */
  name: "Scoreboard",
  components: {},
  props: {
    mcData: {
      type: Object,
      default() {
        return {
          start: 0,
          type: "Scoreboard",
          useBlur: false,
          useOverlay: false,
          animateIn: false,// comp internal?
          animateOut: false,
          animateTo: "10%",
          animateFrom: "-10%",
          pauseVideo: false,
          resumePlayback: true,
          removeMessage: true,// if clicked
          panelWidth: '25%',
          panelBkgColor: '#ffffffCC',
          textColor: '#333333',
          text: 'Found Score:',
          clickable: false,// true = hide scoreboard if clicked
          score: 0,
          possible: 0
        };
      }
    }
  },
  data () {
    return {
      scoreNum: 0,// animate to mcData.score
      interval: null,// timer
      board: null// DOM element
    }
  },
  mounted () {
    this.$nextTick(function() {
      var comp = this;
      this.showScoreboard();

      // increment/decrement the score from data and interactions layer
      this.$on('updateScore', function(data) {
        console.log('Scoreboard received data:', data);
        data += comp.scoreNum;// add to current score
        comp.incScoreNum(data);// data from interactions: comp.$emit(data.message, data.data); 
      });
    });
  },
  methods: {
    /**
     * https://github.com/julianshapiro/velocity/wiki/Option---Easing
     * 
     * animate score-group
     * easing: spring[tension,friction]
     */
    showScoreboard: function() {
      var comp = this;
      var tension = 800;
      var friction = 20;
      this.board = document.querySelector('.score-group');
      this.board.style.opacity = 0.3;
      this.board.style.top = this.mcData.animateFrom;
      // console.log('board:', this.board);
      Velocity(this.board, {
        opacity: [1, 0.3],
        top: [comp.mcData.animateTo, comp.mcData.animateFrom]
      }, {
        easing: [tension, friction],//"easeInOut",//"easeInSine"//
        duration: 600,
        complete: function() {
          // animate scoreNum 0 to score w/delay timer
          comp.incScoreNum(comp.mcData.score);
        }
      });
    },
    incScoreNum: function(score) {
      var comp = this;
      this.scoreNum = 0;
      this.interval = setInterval(function() {
        comp.scoreNum += 1;
        if (comp.scoreNum === score) {
          clearInterval(comp.interval);
        }
      }, 60);
    },

    // animate off screen if clicked?
    hideScoreboard: function() {
      if (!this.mcData.clickable) {return;}

      var comp = this;
      Velocity(this.board, {
        opacity: [0, 1],
        top: [comp.mcData.animateFrom, comp.mcData.animateTo]
      }, {
        easing: "easeInOut",
        duration: 500
      });
      if (this.mcData.removeMessage) {
        this.$emit('removeScoreboard', this.mcData);// to remove it
      }
    }
  }
}
</script>

<style scoped>
  .scoreboard-container {
    width: 100%;
  }
  .score-group {
    position: absolute;
    display: flex;
    justify-content: center;
    right: 5%;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #333333;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .score-group:hover {
    cursor: pointer;
    border-color: #ff3434;
  }
  .text {
    margin: 0 10px 0 0;
  }
  .score {
    font-weight: 600;
  }
  .slash {
    margin: 0 5px;
  }
  .possible {
    font-weight: 600;
  }
</style>
