<template>
  <div class="calorieGoalWidget">
    <div id="target-and-info">
      <!--Target Icon-->
      <img src="@/assets/Target-Icon.png" alt="Target Icon" class="goalIcon" />
      <!--Calorie Goal Info-->
      <div class="goalInfo">
        <div class="calories">
          <span>CURRENT CALORIE GOAL: </span>
          <span :class="['calories-value',{'goal-exceeded': goalExceeded }]">{{ netCalories.toFixed(1) }} / {{ userCalorieGoal }}</span>
        </div>
      </div>
    </div>
    <!--Calorie Goal Doughnut-->
    <div id="doughnut">
      <Doughnut 
      :data="progress" 
      :options="options" 
    />
    </div>
    <div id="percentage">
      <span>
        {{ userCalorieGoal === 0 ? 'Please set a valid calorie goal!' : `You have achieved ${(netCalories / userCalorieGoal * 100)
          .toFixed(1)}% of your goal!` }}
      </span>
    </div>
    <!--Edit Calorie Goal-->
    <img src="@/assets/Edit-Icon.png" alt="Edit Goal" class="clickable-img-wrapper edit-goal-icon" @click="showEditGoalPopup" />

    <div v-if="showEditPopup" class="overlay">
      <div class="popup">
      <h2>Edit Calorie Goal</h2>
      <form @submit.prevent="submitNewGoal">
        <label for="newGoal">Enter new calorie goal:</label>
        <input type="number" id="newGoal" v-model.number="newCalorieGoal" placeholder="">
        <div class="popup-buttons">
          <button @click="updateCalorieGoal">Update Goal</button>
          <button @click="showEditGoalPopup">Cancel</button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import { Doughnut } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  import { db } from '@/firebase';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';

  
  // Register the required components
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  export default {
    name: 'CalorieGoalDoughnut',

    components: {
      Doughnut
    },

    props: {
      netCalories: {
        type: Number,
        default: 0
      },
    },        

    computed: {
      goalExceeded() {
        return this.netCalories > this.userCalorieGoal;
      },
      progress() {
        const remainingCalories =  Math.max(this.userCalorieGoal - this.netCalories, 0);
        return {
          datasets: [
            {
              label: 'Calories',
              data: [this.netCalories, remainingCalories > 0 ? remainingCalories : 0],
              backgroundColor: [this.goalExceeded ? 'rgb(221, 34, 78, 0.8)' : 'rgba(126, 217, 87, 1)', 'rgba(126, 217, 87, 0.3)'], 
              borderWidth: 0,
            }
          ]
        };
      }
    },

    data() {
      return {
        options: {
          cutoutPercentage: 100, // Increase this number to make the chart more like a ring
          legend: {
            display: false // Hides the legend
          },
        },
        showEditPopup: false,
        calorieGoalInput: null,
      };
    },
    methods: {
      showEditGoalPopup() {
        // Here you would handle syncing with Firestore
        console.log('New Calorie Goal:', this.calorieGoalInput);
        this.showEditPopup = !this.showEditPopup;
      },
    },

    setup() {
      const auth = getAuth();
      const showEditPopup = ref(false);
      const newCalorieGoal = ref('');
      const userCalorieGoal = ref(0); // Default value, will be updated from Firestore

      // update user's calorie goal in firestore
      const updateCalorieGoal = async () => {
        const user = auth.currentUser; 
        if (user) {
          const calorieGoalDocRef = doc(db, 'users', user.uid, 'goals', 'CalorieGoal');
          try {
            // Write the new calorie goal to Firestore
            await setDoc(calorieGoalDocRef, { CalorieGoal: newCalorieGoal.value });
            console.log('Calorie goal updated successfully');
            
            // Close the popup and reset the input
            showEditPopup.value = false;
            // Update the local userCalorieGoal with the new value
            userCalorieGoal.value = newCalorieGoal.value;

            console.log('New Calorie Goal:', this.calorieGoalInput);
            // hide the popup after submitting
            this.showEditPopup = false;
            // Return reactive properties and methods
          } catch (error) {
            console.error('Error updating calorie goal:', error);
          }
        } else {
          console.log('No user signed in');
        }
      };

      // Fetch user's calorie goal from firestore
      const fetchCalorieGoal = async () => {
        const user = auth.currentUser;
        if (user) {
          const calorieGoalRef = doc(db, 'users', user.uid, 'goals', 'CalorieGoal');
          try {
            const calorieGoalDoc = await getDoc(calorieGoalRef);
            if (calorieGoalDoc.exists()) {
              userCalorieGoal.value = calorieGoalDoc.data().CalorieGoal;
            } else {
              console.log('No calorie goal found');
            }
          } catch (error) {
            console.error('Error fetching calorie goal:', error);
          }
        }
      };

      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            fetchCalorieGoal();
          }
        });
      });

      return { showEditPopup, newCalorieGoal, updateCalorieGoal, userCalorieGoal};
    }
  }
  </script>
  

<style scoped>
.calorieGoalWidget {
  background-color: #404b5a;
  border-radius: 15px;  
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: whitesmoke;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: fit-content;
}

#target-and-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goalInfo {
  display: flex;
  align-items: center;
}

.goalIcon {
  height: 10vh;
  margin: 0 30px;
}

.calories {
  font-weight: bold;
  white-space: nowrap; /* Keeps the text on a single line */
  font-size: 1.6em;
}

.calories-value {
  color: #76c442; /* Adjust color to match the progress ring */
  display: block; /* Makes the element a block to occupy its own line */
}

.goal-exceeded {
  color: rgb(221, 34, 78, 0.8); /* Ensures this color overrides other styles */
}

#percentage {
  margin: 0 20px;
}

#doughnut {
  height: 200px;
  margin: 0px 20px;
}

.edit-goal-icon {
  cursor: pointer;
  height: 2rem;
  width: 2rem; 
  align-self: flex-start;
  margin-left: 20px;
}

.overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 2; /* Higher z-index to be above the overlay */
  color: black;
}

label {
  margin-right: 5px; /* Add margin for spacing */
}

input[type="number"] {
  flex: 1; /* Take up remaining space */
  margin-bottom: 10px; /* Space before the next row */
}

input {
  border-radius: 20px;
  border-width: 1px;
  padding: 0px 10px;
}

span {
  text-wrap: wrap;
  font-size: 1.8em;
}

button {
  border-radius: 20px;
  border-width: 0px;
  margin: 0px 10px;
}

button:hover {
  cursor: pointer;
}

h2 {
  margin: 0px;
}

.popup-buttons {
  margin-top: 1em;
  display: flex;
  justify-content: center; /* Centers buttons horizontally */
  gap: 10px; /* Optional: adds space between the buttons */
}
</style>