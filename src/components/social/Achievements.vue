<template>
  <div class="achievements-container">
    <h1 class="achievements-heading">Achievements</h1>
    <div class="progress-container">
      <h2 class="up-next">Up Next:</h2>
      <div class="progress-bar-container">
        <div class="progress-text">11.0% of achievements unlocked!</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressWidth }"></div>
        </div>
      </div>
    </div>
    <div class="achievement" v-for="(achievement, index) in achievements" :key="index">
      <div class="achievement-item">
        <img :src="getIconPath(achievement.title)" class="achievement-icon" alt="Icon">
        <div class="achievement-details">
          <div class="achievement-title">{{ achievement.title }}</div>
          <div class="achievement-description">{{ achievement.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FirstSteps from '@/assets/FirstSteps.png';
import ConsistencyChamp from '@/assets/ConsistencyChamp.png';
import SocialButterfly from '@/assets/SocialButterfly.png';
import GoalGetter from '@/assets/GoalGetter.png';
import NutritionNovice from '@/assets/NutritionNovice.png';

export default {
  name: 'Achievements',
  data() {
    return {
      achievements: [
        { title: 'First Steps:', description: 'Complete your first workout' },
        { title: 'Consistency Champ:', description: 'Complete 5 workouts in a week' },
        { title: 'Social Butterfly:', description: 'Make 10 friends on HeathGuru' },
        { title: 'Goal Getter:', description: 'Set and achieve your first calorie goal' },
        { title: 'Nutrition Novice:', description: 'Complete your first dietary challenge' }
      ],
      progressWidth: '11%'
    };
  },
  methods: {
    getIconPath(title) {
      switch (title) {
        case 'First Steps:':
          return FirstSteps;
        case 'Consistency Champ:':
          return ConsistencyChamp;
        case 'Social Butterfly:':
          return SocialButterfly;
        case 'Goal Getter:':
          return GoalGetter;
        case 'Nutrition Novice:':
          return NutritionNovice;
        default:
          return '';
      }
    }
  }
};
</script>

<style scoped>
.achievements-container {
  text-align: center;
  background-color: #335076;
  border-radius: 20px;
  padding: 20px;
}

.achievements-heading {
  color: #ffffff;
  margin-top: 10px;
}

.progress-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.up-next {
  color: #ffffff;
  margin-right: 10px;
}

.progress-text {
  font-size: 0.9em;
  font-weight: bold;
  color: #ffffff;
  white-space: nowrap;
  margin-right: 5px;
}

.progress-bar {
  height: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  width: 210px;
  margin-top: 5px;
  margin-bottom: 5px;
  position: relative; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  background-color: #007bff; /* Blue color for progress */
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 10px;
}

.achievement {
  background-color: #ffffff;
  border-radius: 30px;
  padding: 8px 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.achievement-item {
  display: flex;
  align-items: center;
}

.achievement-icon {
  width: 35px;
  height: 35px;
  margin-right: 15px;
}

.achievement-details {
  display: flex;
  align-items: center;
}

.achievement-title {
  font-weight: bold;
  text-align: left;
}

.achievement-description {
  font-size: 0.9em;
  text-align: left;
  margin-left: 5px;
}
</style>  