<template>
  <div class="container" :class="containerIntensity.class">
    <div id="top-row">
      <h1 id="routine-name">{{ routineName }}</h1>
      <div id="icon-row">
        <a @click="beginEdit" href="#" v-if="!isEditing" class="clickable-img-wrapper">
          <img src="@/assets/Edit-Icon.png" alt="Edit Routine" class="icon">
        </a>
        <a @click="endEdit" href="#" v-if="isEditing" class="clickable-img-wrapper">
          <img src="@/assets/Save-Icon.png" alt="Save Changes" class="icon">
        </a>
        <a @click="deleteRoutine" href="#" class="clickable-img-wrapper">
          <img src="@/assets/Cross-Icon.png" alt="Delete Routine" class="icon">
        </a>
      </div>
    </div>
    <img :src=containerIntensity.image :style="{width : '100%'}">
    <h3>
      Intensity: {{ containerIntensity.label }}
      <br>
      Duration: {{ totalDuration }} min
      <br>
      Date: {{ formattedDate }}
    </h3>
    <ul id="list-exercises">
      <li v-for="(exercise, index) in exercises" :key="index" @click="clickExerciseByName(exercise)">
        {{ exercise }}
        <a v-if="isEditing" @click.stop="deleteExercise(index)" class="delete-exercise">Delete</a>
      </li>
    </ul>

    <!-- Edit Interface -->
    <div v-if="isEditing" class="edit-interface">
      <input type="date" v-model="editingDate" placeholder="Select Date" />
      <select v-model="selectedExercise">
        <option disabled value="">Select an exercise</option>
        <option v-for="exercise in likedExercises" :key="exercise.id" :value="exercise.id">
          {{ this.$capitalizeFirstLetter(exercise.id) }}
        </option>
      </select>
      <button @click="addExercise">Add Exercise</button>
    </div>
    <div id="loading-msg" v-if="loading" class="overlay">Loading...</div>

    <!-- WorkoutInfo Pop-Up -->
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
import axios from 'axios';
import WorkoutInfo from '@/components/workouts/WorkoutInfo.vue';

import lowIntensityImage from '@/assets/Low-Intensity-Workout.webp';
import mediumIntensityImage from '@/assets/Medium-Intensity-Workout.webp';
import highIntensityImage from '@/assets/High-Intensity-Workout.webp';

export default {
  name: 'WorkoutContainer',
  components: {
    WorkoutInfo
  },
  data() {
    return {
      isEditing: false,
      selectedExercise: '',
      editingDate: '',
      refreshComp: 0,
      loading: false,
      error: null,
      showWorkoutInfo: false,
    }
  },
  props: {
    routineName: String,
    routineDate: String,
    routineDuration: String,
    exercises: {
      type: Array,
      default: () => ([]),
    },
    likedExercises: {
    type: Array,
    default: () => ([]),
    },
    isEditingActive: Boolean,
  },
  computed: {
    containerIntensity() {
      let result = {
        class: '',
        label: '',
        image: ''
      };

      if (this.totalDuration <= 20) {
        result.class = 'low-intensity';
        result.label = 'Low';
        result.image = lowIntensityImage;
      } else if (this.totalDuration <= 40) {
        result.class = 'medium-intensity';
        result.label = 'Medium';
        result.image = mediumIntensityImage;
      } else {
        result.class = 'high-intensity';
        result.label = 'High';
        result.image = highIntensityImage;
      }
      return result;
    },
    totalDuration() {
      return this.exercises.length * 10;
    },
    formattedDate() {
      if (!this.routineDate) return ""; // Return empty string if no date is set

      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
      const date = new Date(this.routineDate);

      const dayOfWeek = daysOfWeek[date.getDay()];
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      // Function to add suffix to date
      const suffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
      };

      return `${dayOfWeek}, ${day}${suffix(day)} ${months[monthIndex]} ${year}`;
    }
  },
  methods: {
    change() {
      this.refreshComp += 1
    },
    deleteRoutine() {
      this.$emit('delete-routine', this.routineName);
      console.log("routine delete event emitted");
    },
    async clickExerciseByName(name) {
      this.exerciseName = name;
      this.loading = true;
      this.$emit('exerciseSelected', this.exerciseName);
      this.$emit('loading', true);

      const apiURL = '';
      const apiKey = '';

      try {
        console.log('Calling API for exercise name:', name);
        const response = await axios.get(apiURL, {
          headers: {
            'X-Api-Key': apiKey
          }
        });

        console.log('API response:', response.data);
        if (response.data.length > 0) {
          this.selectedExercise = response.data[0];
          this.showWorkoutInfo = true;
        } else {
          this.error = "No exercise found.";
        }
        this.$emit('exerciseList', response.data);
        this.loading = false;
      } catch (error) {
        console.error('Error: ', error.response ? error.response.data : error.message);
        this.loading = false;
        this.error = error.response ? error.response.data : error.message;
      }
    },
    beginEdit() {
      if (this.isEditingActive) {
        // If editing is active elsewhere, log the attempt and stop the process
        alert("Another routine is already being edited. Please save or cancel the current changes before editing another routine.");
        return; // Stop the edit method from proceeding
      }
      this.isEditing = true;
      this.editingDate = this.routineDate;
      this.$emit('editing-changed', true);
      console.log("Edit state active");
    },
    endEdit() {
      this.isEditing = false;
      this.$emit('editing-changed', false);
      this.$emit('update-routine', this.routineName, this.exercises, this.editingDate);
      console.log("Edit state inactive");
    },
    addExercise() {
      if (this.selectedExercise) {
        this.exercises.push(this.selectedExercise);
        console.log("exercise added")
      } else {
        alert("You have not selected an exercise.")
      }
    },
    deleteExercise(index) {
      this.exercises.splice(index, 1);
      console.log("exercise deleted")
    }
  }
}
</script>

<style scoped>
.container {
  border-radius: 15px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 25%;
}

.low-intensity {
  background-color: #8ec58e; /* Green for low intensity */
}

.medium-intensity {
  background-color: #ffc272; /* Yellow for medium intensity */
}

.high-intensity {
  background-color: #ff9385; /* Red for high intensity */
}

#top-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

#routine-name {
  margin: 0px;
}

.routine-img {
  width: 100%;
}

li {
  font-size: 1em;
  cursor: pointer;
}

ul {
  margin-bottom: 0px
}

#loading-msg {
  font-size: 2em;
  font-weight: bold;
  color: #dfe2e7;
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
  z-index: 9999; /* Ensure popup is above other content */
}

#icon-row {
  display: flex;
  gap: 10px;
  justify-content: right;
}

.edit-interface {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

select {
  border-radius: 20px;
  border-width: 0px;
  padding: 5px 10px; 
  width: 100%;
}

button {
  text-wrap: nowrap;
  border-radius: 20px;
  border-width: 0px;
  padding: 5px 10px;
  background-color: white;
}

input {
  border-radius: 20px;
  border-width: 0px;
  padding: 5px 10px;
}

h3 {
  margin: 0px
}
</style>
