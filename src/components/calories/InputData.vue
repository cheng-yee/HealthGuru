<template>
  <div class="button-record" @click="showPopup = true">
    Record Data
  </div>
    
  <div v-if="showPopup" class="popup">
    <div class="popup-content">
      <h2>Record Daily Data</h2>

      <div class="form-group">
        <label for="weight">Weight (kg):</label>
        <input type="number" id="weight" v-model="formData.weight">

        <label for="steps">Step Count:</label>
        <input type="number" id="steps" v-model="formData.steps">

        <label for="duration">Exercise Duration:</label>
        <input type="number" id="duration" v-model="formData.duration">
      </div>

      <div class="button-group">
        <button @click="recordData">Submit</button>
        <button @click="showPopup = false">Cancel</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'InputDataPopup',
  setup() {
    const showPopup = ref(false);
    const formData = ref({
      weight: null,
      steps: null
    });

    const recordData = async () => {
      const auth = getAuth();
      const user = auth.currentUser; 
      if (user) {
        const today = new Date().toISOString().slice(0, 10);
        const weightDocRef = doc(db, 'users', user.uid, 'weights', today);
        const stepsDocRef = doc(db, 'users', user.uid, 'steps', today);
        const durationDocRef = doc(db, 'users', user.uid, 'exerciseDuration', today);
        const weightDataToWrite = {
          date: today,
          weight: formData.value.weight
        };

        const stepsDataToWrite = {
          date: today,
          steps: formData.value.steps
        };
        
        const durationDataToWrite = {
          date: today,
          duration: formData.value.duration
        };

        try {
          // Write the data to Firestore
          await setDoc(weightDocRef, weightDataToWrite);
          await setDoc(stepsDocRef, stepsDataToWrite);
          await setDoc(durationDocRef, durationDataToWrite);
          console.log('Data recorded successfully');
          
          // Close the popup and reset the form
          showPopup.value = false;
          formData.value = { weight: null, steps: null, exerciseDuration:  null };
        } catch (error) {
          console.error('Error recording data to Firestore:', error);
        }

      } else {
          console.log('No user signed in')
      }
    };
    // Return reactive properties and methods
    return { showPopup, formData, recordData };
  }
};
</script>

<style scoped>
.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Adjust as needed for spacing */
}

.form-group label {
  margin-right: 5px; /* Add margin for spacing */
}

.button-group {
  margin-top: 10px; /* Space from the inputs to the buttons */
  text-align: center; /* Center buttons if the container width is defined */
}

.button-record{
  display: flex;
  padding: 0px 20px;
  background-color: #0c457e; /* Dark blue color */
  color: white;
  border: none;
  border-radius: 15px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 1.75rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s;
  justify-content: center;
  align-items: center;
  text-wrap: nowrap;
}

.button-record:hover {
  background-color: #002244; /* A slightly darker blue on hover */
}

.button-record:active, .button-import:focus {
  outline: none; 
  box-shadow: 0 0 0 2px #002244; 
}
.popup {
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

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 2; /* Higher z-index to be above the overlay */
}

input {
  border-radius: 20px;
  border-width: 1px;
  padding: 0px 10px;
}

button {
  border-radius: 20px;
  border-width: 0px;
  margin: 0px 10px;
}

button:hover {
  cursor: pointer;
}
</style>