<template>
  <div class="vue-game-widget">
    <h2>Game Score Tracker (Vue Widget)</h2>
    <div class="score-container">
      <div class="team">
        <h3>Team A</h3>
        <div class="score">{{ teamAScore }}</div>
        <button @click="incrementTeamA">+1</button>
      </div>
      <div class="divider"></div>
      <div class="team">
        <h3>Team B</h3>
        <div class="score">{{ teamBScore }}</div>
        <button @click="incrementTeamB">+1</button>
      </div>
    </div>
    <div class="controls">
      <button @click="resetScores" class="reset-btn">Reset Scores</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameScoreWidget',
  data() {
    return {
      teamAScore: 0,
      teamBScore: 0
    }
  },
  methods: {
    incrementTeamA() {
      this.teamAScore++
    },
    incrementTeamB() {
      this.teamBScore++
    },
    resetScores() {
      this.teamAScore = 0
      this.teamBScore = 0
    }
  }
}
</script>

<style scoped>
body {
  height: auto;
  background-color: linear-gradient(to right, #4a2f80, #3a4780);;
}

.vue-game-widget {
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(to right, #4a2f80, #3a4780);
  height: auto;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.score-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.team {
  text-align: center;
}

h3 {
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.score {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 20px;
}

.divider {
  width: 2px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.3);
}

button {
  background-color: #6938b4;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #7d4ccc;
}

.controls {
  text-align: center;
  margin-top: 20px;
}

.reset-btn {
  background-color: #e64a4a;
}

.reset-btn:hover {
  background-color: #ff5a5a;
}
</style> 