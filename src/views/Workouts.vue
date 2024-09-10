<template>
  <div>
    <div id="muscle-view">
      <div id="select-muscle">
        <SelectMuscle 
          @muscleSelected="selectMuscle" 
          @exerciseList="updateExercises" 
          @loading="handleLoading" />
      </div>
      <div id="exercise-list">
        <ExerciseList 
          :muscle="muscleGroup" 
          :exercises="exercises"
          :loading="loading"
          @exerciseSelected="handleExerciseSelected"/>
      </div>
    </div>

    <div v-if="showWorkoutInfo && selectedExercise" class="overlay">
      <WorkoutInfo
        :showWorkout="showWorkoutInfo"
        :exerciseName="selectedExercise.name"
        :exerciseDifficulty="selectedExercise.difficulty"
        :exerciseType="selectedExercise.type"
        :exerciseSteps="selectedExercise.instructions"
        @close="showWorkoutInfo = false"
      />
    </div>
  </div>
</template>

<script>
import SelectMuscle from '@/components/workouts/SelectMuscle.vue';
import ExerciseList from '@/components/workouts/ExerciseList.vue';
import WorkoutInfo from '@/components/workouts/WorkoutInfo.vue';

export default {
  name: 'Workouts',
  components: {
    SelectMuscle,
    ExerciseList,
    WorkoutInfo, 
  },
  data() {
    return {
      muscleGroup: "",
      exercises: [],
      selectedExercise: null, 
      showWorkoutInfo: false, // Controls the visibility of WorkoutInfo
      loading: false,
    };
  },
  methods: {
    selectMuscle(muscle) {
      this.muscleGroup = muscle;
    },
    updateExercises(exercises) {
      this.exercises = exercises;
    },
    handleExerciseSelected(exercise) {
      this.selectedExercise = exercise;
      this.showWorkoutInfo = true;
    },
    getExerciseImage(exerciseName) {
      // Removed, replaced with youtube link to exercise
      return `src/assets/WorkoutImages/${exerciseName}.webp`;
    },
    handleLoading(loading) {
    this.loading = loading; 
    },
  },
};
</script>

<style scoped>  
  #muscle-view {
  display: flex;
  margin: 30px 0px;
  justify-content: center;
  overflow-x: visible; 
  gap: 30px;
}

  #select-muscle {  
    min-width: 55%;
  }

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
    z-index: 9999; /* Ensure popup is above content */
  }

  #displaySample {
    cursor: pointer;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.25s ease;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
</style>