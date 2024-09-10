<template> 
  <div class="featured-exercise-container"> 
    <div @click="clickedContainer"> 
      <h1>{{ "Featured Exercise: " + randomExercise.name }}</h1> 
    </div> 
    <div class="overlay" v-if="showWorkoutInfo"> 
      <WorkoutInfo  
        :showWorkout="showWorkoutInfo" 
        :exerciseName="randomExercise.name" 
        :exerciseDifficulty="randomExercise.difficulty" 
        :exerciseType="randomExercise.type" 
        :exerciseSteps="randomExercise.instructions" 
        @close="showWorkoutInfo = false" 
      /> 
    </div> 
  </div> 
</template> 


<script>
import WorkoutInfo from '@/components/workouts/WorkoutInfo.vue';
import axios from 'axios'

export default {
  name: 'FeaturedExercise',
  components: {
    WorkoutInfo
  },
  data() {
    return {
      randomMuscleType: "",
      randomExercise: "",
      showWorkoutInfo: false, // Controls the visibility of WorkoutInfo
    }
  },
  async beforeCreate() {
    const exerciseList = [
      "traps", "lats", "triceps", "forearms", "glutes", "hamstrings", "calves", "biceps",
      "chest", "abdominals", "quadriceps", "adductors"
    ]

    function selectRandomElement(list) {
      // Generate a random index within the range of the list length
      const randomIndex = Math.floor(Math.random() * list.length);

      // Return the element at the randomly generated index
      return list[randomIndex];
    }

    this.randomMuscleType = selectRandomElement(exerciseList);
    //console.log("the randomly selected muscleType is:", this.randomMuscleType)
    const apiURL = '';
    const apiKey = '';

    const retrieveMuscleGroupExercises = async (muscleGroup) => {
      try {
        //console.log('Calling API for muscle:', muscleGroup);
        const response = await axios.get(apiURL, {
          headers: {
            'X-Api-Key': apiKey
          }
        });
  
        //console.log('API response:', response.data);
        const exercises = response.data;
        return selectRandomElement(exercises);
      } catch (error) {
        console.error('Error: ', error.response ? error.response.data : error.message);
      }
    }

    this.randomExercise = await retrieveMuscleGroupExercises(this.randomMuscleType);
    this.randomExercise.name = this.$capitalizeFirstLetter(this.randomExercise.name);
    //console.log("the randomly selected exercise is:", this.randomExercise)
  },
  methods: {
    clickedContainer() {
      this.showWorkoutInfo = !this.showWorkoutInfo;
      //console.log("showWorkoutInfo is now:", this.showWorkoutInfo)
    },
  },
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.featured-exercise-container {
  display: flex;
  justify-content: center;
  background-color: #dfe2e7;
  border-radius: 10px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}
.featured-exercise-container:hover {
cursor: pointer;
}
</style>
