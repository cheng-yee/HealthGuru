<template>
  <div class="calories-input-widget">
    <!-- Calories Input -->
    <div class="calories-input">

      <label for="meal-select" class="input-label">Calories Input</label>
      <div class="search-container">
        <input v-model="mealQuery" placeholder="e.g 1kg Steak" class="search-input" @input="clearMealError">
        <img src="@/assets/Search-Icon.png" alt="Search" class="clickable-img-wrapper search-icon" @click="fetchAndStoreMeal"> 
      </div>  
      <p v-if="mealError" class="error-message">{{ mealError }}</p>

      <ul>
        <li v-for="meal in meals" :key="meal.id" class="list-item">
          <span>{{ capitaliseWords(meal.name) }}: {{ meal.calories }} kcal</span>
          <img src="@/assets/Cross-Icon.png" alt="Delete" class="clickable-img-wrapper delete-icon" @click="removeMeal(meal)">
        </li>
      </ul>

      <div class="total-calories">Total: {{ totalInputCalories }} kcal</div>
    </div>

    <!-- Calories Burnt -->
    <div class="calories-burnt">
      <label for="workout-select" class="input-label">Calories Burnt</label>

      <div class="search-container">
        <input v-model="exerciseQuery" placeholder="Input Exercise" class="search-input" @input="clearExerciseError">
        <img src="@/assets/Search-Icon.png" alt="Search" class="clickable-img-wrapper search-icon" @click="fetchAndStoreExercise">
      </div>  
      <p v-if="exerciseError" class="error-message">{{ exerciseError }}</p> 

      <ul>
        <li v-for="exercise in exercises" :key="exercise.id" class="list-item">
          <span>{{ capitaliseWords(exercise.name) }}: -{{ exercise.calories }} kcal </span>
          <img src="@/assets/Cross-Icon.png" alt="Delete" class=" clickable-img-wrapper delete-icon" @click="removeWorkout(exercise)">
        </li>
      </ul>

      <div class="total-calories">Total: {{ totalBurntCalories }} kcal</div>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import firebaseApp from '@/firebase';
import { parse } from '@vue/compiler-dom';

export default {
  name: 'CalorieInput',
  data() {
    return {
      user: '',
      uid: '',
      mealQuery: '',
      meals: [],
      exerciseQuery: '',
      exercises: [],
      mealError: '',
      exerciseError: '',
    };
  },

  mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            this.user = user;
            this.uid = user.uid;
            const date = new Date().toISOString().slice(0, 10);
            const docRef = doc(db, 'users', this.uid, 'caloriesDate', String(date));
            this.fetchandUpdateData(docRef);
        }
        })
  },

  computed: {
    totalInputCalories() {
      const total = this.meals.reduce((total, meal) => total + meal.calories, 0);
      return parseFloat(total.toFixed(1));
    },

    totalBurntCalories() {
      const total = this.exercises.reduce((total, exercise) => total + exercise.calories, 0);
      return parseFloat(total.toFixed(1));
    },

    netCalories() {
      console.log("Calculating Input Calories:", this.totalInputCalories);
      console.log("Calculating Burnt Calories:", this.totalBurntCalories);
      const total = this.totalInputCalories - this.totalBurntCalories;
      return parseFloat(total.toFixed(1));
    }
  },

  methods: {

    clearMealError() {
      this.mealError = '';
    },

    clearExerciseError() {
      this.exerciseError = '';
    },

    capitaliseWords(string) {
      return string.replace(/\b\w/g, l => l.toUpperCase());
    },

    async ensureDocumentExists(docRef) {
      const docSnap = await getDoc(docRef);
       if (!docSnap.exists()) {
        await setDoc(docRef, { meals: [], exercises: [] }); // Initialize with empty arrays
        }
    },

    async fetchAndStoreMeal () {
      const mealAPIURL = '';
      const mealAPIKEY = ''

      try {
        console.log("Calling API for meal:", this.mealQuery)
        const response = await axios.get(mealAPIURL, {
          headers: {'X-Api-Key': mealAPIKEY}
        })

        const mealResult = response.data[0]
        console.log('Meal API response:', mealResult);

        const mealData = {
          name: mealResult.name,
          calories: mealResult.calories
        }

        const date = new Date().toISOString().slice(0, 10);
        const mealDocRef = doc(db, 'users', this.uid, 'caloriesDate', String(date));
        console.log("Saving to Firestore")

        await this.ensureDocumentExists(mealDocRef);
        await updateDoc(mealDocRef, { meals: arrayUnion(mealData) })
        console.log("Meal Saved in Firestore for user:" + this.uid)
        console.log("Refreshing Data for user:" + this.uid);
        await this.fetchandUpdateData(mealDocRef);
        console.log("Refreshed Data for user:" + this.uid);
      } catch (error) {
        this.mealError = 'Failed to find meal. Please try a different meal.';
        console.error('Error: ', error.response ? error.response.data : error.message);
      }
    },

    async fetchAndStoreExercise () {
      const exerciseAPIURL = '';
      const exerciseAPIKEY = ''

      try {
        console.log("Calling API for Exercise:", this.exerciseQuery)
        const response = await axios.get(exerciseAPIURL, {
          headers: {'X-Api-Key': exerciseAPIKEY}
        })

        const exerciseResult = response.data[0]
        console.log('Exercise API response:', exerciseResult);

        const exerciseData = {
          name: exerciseResult.name,
          calories: exerciseResult.total_calories
        }

        const date = new Date().toISOString().slice(0, 10);
        const exerciseDocRef = doc(db, 'users', this.uid, 'caloriesDate', String(date));
        console.log("Saving to Firestore")

        await this.ensureDocumentExists(exerciseDocRef);
        await updateDoc(exerciseDocRef, { exercises: arrayUnion(exerciseData) });
        console.log("Exercise Saved in Firestore for user:" + this.uid);
        console.log("Refreshing Data for user:" + this.uid);
        await this.fetchandUpdateData(exerciseDocRef);
        console.log("Refreshed Data for user:" + this.uid);
        
      } catch (error) {
        this.exerciseError = 'Failed to find exercise. Please try a different exercise.';
        console.error('Error: ', error.response ? error.response.data : error.message);
      }
    },

    async fetchandUpdateData(docRef) {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          this.meals = docSnap.data().meals || [];
          console.log(this.meals );
          this.exercises = docSnap.data().exercises || [];
          console.log(this.exercises);
          this.$emit('update-calories', {
            consumed: this.totalInputCalories,
            burnt: this.totalBurntCalories
          });
        } else {
          console.log("No such document!");
          this.meals = [];
          this.exercises = [];
        }
      } catch (error) {
        console.error("Error getting document:". error);
      }
    },

    async removeMeal(mealToRemove) {
      const date = new Date().toISOString().slice(0, 10);
      const docRef = doc(db, 'users', this.uid, 'caloriesDate', date);
      try {
        await updateDoc(docRef, {
          meals: arrayRemove(mealToRemove)
        });
        this.meals = this.meals.filter(meal => meal !== mealToRemove);
        await this.fetchandUpdateData(docRef);
        console.log("Meal removed successfully");
      } catch (error) {
        console.error("Error removing meal:", error);
      }
    },

    async removeWorkout(workoutToRemove) {
      const date = new Date().toISOString().slice(0, 10);
      const docRef = doc(db, 'users', this.uid, 'caloriesDate', date);
      try {
        await updateDoc(docRef, {
          exercises: arrayRemove(workoutToRemove)
        });
        this.exercises = this.exercises.filter(exercise => exercise !== workoutToRemove);
        await this.fetchandUpdateData(docRef);
        console.log("Workout removed successfully");
      } catch (error) {
        console.error("Error removing workout:", error);
      }
    }
    },
};
</script>

<style scoped>
.calories-input-widget {
  display: flex;
  border-radius: 10px;
  width: fit-content;
  gap: 30px;
  padding: 0px;
}

.calories-input, .calories-burnt {
  background-color: #dfe2e7;
  border-radius: 15px;       
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.input-label {
  font-weight: bold;
  font-size: 1.8em;
  color: #335076;
  margin-bottom: 0.5rem; 
  display: block; 
}

.search-container { 
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  margin: 0px;
}

.search-icon {
  height: 30px;
}

ul {
  list-style: circle;
  padding: 0; 
  margin: 0;
  width: fit-content;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  padding: 0.5rem; 
  margin: 8px 0; 
  background-color: #ffffff; 
  border-radius: 10px; 
  position: relative; 
  text-wrap: nowrap;
  gap: 10px;
}

ul li:last-child {
  border-bottom: none; /* Removes bottom border from the last item */
}

.delete-icon {
  width: 24px; 
  height: 24px;
  float: right;
}

.total-calories { 
  padding-top: 1rem;
  font-weight: bold;
  font-size: 1em;
}
</style>
  
