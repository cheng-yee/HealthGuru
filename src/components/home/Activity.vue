<template>
  <div class="activity-widget">
    <div class="title">
      <p>
          ACTIVITY PROGRESS
      </p>
    </div>
    <div class="stats">
      <div class="stat" id="steps">
        <span class="label">STEPS: {{ stepsGoal === 0 ? 0 : (steps / stepsGoal * 100).toFixed(0) }}%</span>
        <span>{{ steps }} / {{ stepsGoal }}</span>
      </div>
      <div class="stat" id="exercise_duration">
        <span class="label">DAILY EXERCISE: {{ exerciseDurationGoal === 0 ? 0 : (exerciseDuration / exerciseDurationGoal * 100).toFixed(0) }}%</span>
        <span>{{ exerciseDuration }} / {{ exerciseDurationGoal }} MINUTES</span>
      </div>
      <div class="stat" id="exercises_completed">
        <span class="label" >TOTAL EXERCISES COMPLETED: {{exerciseAttemptedGoal === 0 ? 0 :  (exerciseAttempted / exerciseAttemptedGoal * 100).toFixed(0) }}%</span>
        <span>{{ exerciseAttempted }} / {{ exerciseAttemptedGoal }} EXERCISES COMPLETED</span>
      </div>
    </div>
    <Doughnut 
      id="activityWidget"
      :data="progress" 
      :options="options" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { db } from '@/firebase'; // Import your firebase configurations
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseApp from '@/firebase';

// Register the required components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

 // Get a reference to the auth service
 const auth = getAuth(firebaseApp);

export default {
  name: 'activityWidget',
  components: {
    Doughnut
  },

  computed: {
    progress() {
      return {
        datasets: [
          {
            label: 'Steps',
            data: [
              this.steps,
              (this.stepsGoal - this.steps > 0 ? this.stepsGoal - this.steps : 0)
            ], // Remaining percentage to complete the circle
            backgroundColor: ['rgba(255, 49, 98, 0.8)', 'rgba(255, 49, 98, 0.3)'], 
            borderWidth: 0, // No borders
          },
          {
            label: 'Daily Exercise',
            data: [
              this.exerciseDuration, 
              (this.exerciseDurationGoal - this.exerciseDuration > 0 ? this.exerciseDurationGoal - this.exerciseDuration : 0)
            ], // Remaining percentage to complete the circle
            backgroundColor: ['rgba(126, 217, 87, 1)', 'rgba(126, 217, 87, 0.3)'], 
            borderWidth: 0,
          },
          {
            label: 'Total Exercises Completed',
            data: [
              this.exerciseAttempted, 
              (this.exerciseAttemptedGoal - this.exerciseAttempted > 0 ? this.exerciseAttemptedGoal - this.exerciseAttempted : 0)
            ], // Remaining percentage to complete the circle
            backgroundColor: ['rgba(45,137,239,0.8)', 'rgba(45,137,239,0.3)'],
            borderWidth: 0,
          }
        ]
      };
    },
  }, 
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 100, // Increase this number to make the chart more like a ring
        legend: {
          display: false // Hides the legend
        },
      }
    };
  },
  setup() {
    const steps = ref(0);
    const stepsGoal = ref(0);
    const exerciseDurationGoal = ref(0);
    const exerciseDuration = ref(0);
    const exerciseAttempted = ref(0);
    const exerciseAttemptedGoal = ref(0);

    // Fetch user's current steps count and steps goal from Firestore
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Steps
          const stepsCollectionRef = collection(db, 'users', user.uid, 'steps');
          const stepDocIds = [];
          const snapshot = await getDocs(stepsCollectionRef);
          snapshot.forEach(doc => {
            stepDocIds.push(doc.id);
          });
          stepDocIds.sort((a, b) => b.localeCompare(a));

          const stepsDocRef = doc(db, 'users', user.uid, 'steps', stepDocIds[0] || 'default');
          const stepsGoalDocRef = doc(db, 'users', user.uid, 'goals', 'StepsGoal');

          // Exercise Duration
          const durationCollectionRef = collection(db, 'users', user.uid, 'exerciseDuration');
          const durationDocIds = [];
          const snapshot_duration = await getDocs(durationCollectionRef);
          snapshot_duration.forEach(doc => {
            durationDocIds.push(doc.id);
          });
          durationDocIds.sort((a, b) => b.localeCompare(a));
          const ExerciseDurationDocRef = doc(db, 'users', user.uid, 'exerciseDuration', durationDocIds[0] || 'default');
          const ExerciseDurationGoalDocRef = doc(db, 'users', user.uid, 'goals', 'ExerciseDuration');

          // Exercises Attempted
          const ExerciseAttemptedGoalDocRef = doc(db, 'users', user.uid, 'goals', 'ExerciseAttemptedGoal');

          const stepsDoc = await getDoc(stepsDocRef);
          const stepsGoalDoc = await getDoc(stepsGoalDocRef);
          const ExerciseDurationDoc = await getDoc(ExerciseDurationDocRef);
          const ExerciseDurationGoalDoc = await getDoc(ExerciseDurationGoalDocRef);
          const ExerciseAttemptedGoalDoc = await getDoc(ExerciseAttemptedGoalDocRef);

          // Apply default values if documents are missing
          steps.value = stepsDoc.exists() ? stepsDoc.data().steps : 0;
          stepsGoal.value = stepsGoalDoc.exists() ? stepsGoalDoc.data().StepsGoal : 15000;
          exerciseDuration.value = ExerciseDurationDoc.exists() ? ExerciseDurationDoc.data().duration : 0;
          exerciseDurationGoal.value = ExerciseDurationGoalDoc.exists() ? ExerciseDurationGoalDoc.data().ExerciseDurationGoal : 60;
          exerciseAttempted.value = ExerciseAttemptedGoalDoc.exists() ? ExerciseAttemptedGoalDoc.data().ExercisesAttempted : 0;
          exerciseAttemptedGoal.value = ExerciseAttemptedGoalDoc.exists() ? ExerciseAttemptedGoalDoc.data().ExercisesAttemptedGoal : 250;
          
        } catch (error) {
          console.error('Error fetching data:', error);
          // Set default values in case of error
          steps.value = 0;
          stepsGoal.value = 15000;
          exerciseDuration.value = 0;
          exerciseDurationGoal.value = 60;
          exerciseAttempted.value = 0;
          exerciseAttemptedGoal.value = 250;
        }
      }
    };
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchData();
        }
      });
    });

    // Return all the reactive properties and methods
    return { steps, stepsGoal, exerciseDurationGoal, exerciseDuration, exerciseAttemptedGoal, exerciseAttempted };
  }
};
</script>

<style scoped>
.activity-widget {
  background-color: #404b5a;
  border-radius: 15px;
  padding: 20px;
  color: whitesmoke;
  display: flex;
  justify-content: space-around; /*Add space between the stats and the doughnut */
  align-items: center;
  max-height: 80%;
}

.title {
  font-size: 1.3em; 
  font-weight: bold;
  margin-bottom: 20px; 
  margin-right: 20px;
  margin-left: 10px
  }
  
.stats {
  width: 100%; 
  padding-left: 5%; 
  padding-right: 5%;
  border-left: 1px solid rgba(255, 255, 255, 0.5); /* Separator line */
  font-size: 1em;
}

.stat {
  font-size: 1.2em;
  margin: 3% 0; /* Space between stat items */
}

#steps {
  color: rgb(221, 34, 78);

}

#exercise_duration {
  color: rgb(122, 212, 83);
}

#exercises_completed {
  color: rgba(45,137,239,0.8);
}

.label {
  font-weight: bold;
  display: block; 
  margin-bottom: 5px; 
}

#activityWidget {
  max-width: 30vh; /*Set a max-width to the doughnut chart for a smaller appearance */
  max-height: 30vh;
  margin-right: 30px;
  margin-bottom: 5px;
  width: 100%;
}

</style>