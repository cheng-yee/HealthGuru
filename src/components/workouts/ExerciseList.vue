<template>
  <div class="exercise-list-container">
    <h1>{{ this.$capitalizeFirstLetter(muscle) }}</h1>
    <p v-if="loading">Loading...</p>
    <ul v-else>
      <h4>Click on an exercise to view its description:</h4>
      <li v-for="exercise in exercises" :key="exercise.id" @click="selectExercise(exercise)">
        {{ this.$capitalizeFirstLetter(exercise.name) }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ExerciseList',
  props: {
    muscle: String,
    exercises: Array,
    loading: Boolean, // Boolean to check if data from API call is loading
  },
  methods: {
    selectExercise(exercise) {
      this.$emit('exerciseSelected', exercise);
    }
  },
};
</script>

<style scoped>
.exercise-list-container {
  background-color: white;
  padding: 0px 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  min-height: 100%;
  min-width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

.exercise-list-container ul {
  list-style-type: none;
  padding: 0;
}

.exercise-list-container li {
  cursor: pointer;
}

h1 {
  text-wrap: nowrap;
}
</style>
