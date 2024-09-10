<template>
  <div class="routines">
    <h2 id="create-routine-title">Create Routine:</h2>
    <div id="create-routine">
      <input id="name-field" type="text" v-model="newRoutineName" placeholder="Enter Routine Name" />
      <input type="date" v-model="newRoutineDate" placeholder="Select Date" />
      <select v-model="selectedExercise">
        <option disabled value="">Select an exercise</option>
        <option v-for="exercise in likedExercises" :key="exercise.id" :value="exercise.id">
          {{ this.$capitalizeFirstLetter(exercise.id) }}
        </option>
      </select>
      <button @click="addExerciseToRoutine">Add Exercise</button>
      <button @click="saveRoutine">Save Routine</button>
    </div>

    <!-- Display the list of added exercises -->
    <div v-if="currentRoutine.length > 0">
      <h3>Added Exercises:</h3>
      <ul>
        <li v-for="(exerciseId, index) in currentRoutine" :key="index">
          {{ this.$capitalizeFirstLetter(exerciseId) }} <button id="remove-button" @click="removeExercise(index)">Remove</button>
        </li>
      </ul>
    </div>

    <h2 id="my-routines-title">My Routines:</h2>
    <!-- Render WorkoutContainer for each saved routine -->
    <div id="workout-container-grid">
      <WorkoutContainer
        v-for="routine in routines"
        :key="routine.id"
        :routineName="routine.name"
        :routineDate="routine.date"
        :routineDuration="routine.duration"
        :exercises="routine.exercises"
        :likedExercises="likedExercises"
        :isEditingActive="isEditingActive"
        @delete-routine="deleteRoutine(routine.id)"
        @update-routine="updateRoutine"
        @editing-changed="handleEditingChange"
      />
    </div>
  </div>
</template>
  
<script>
import WorkoutContainer from '@/components/routines/WorkoutContainer.vue';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { collection, query, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export default {
  name: 'Routines',
  components: {
    WorkoutContainer
  },
  data() {
    return {  
      refreshComp: 0,
      likedExercises: [], // This will store the fetched exercises
      showDropdown: false, // Controls the visibility of the dropdown
      routines: [], // Stores all saved routines
      currentRoutine: [], // Stores the current routine being built
      selectedExercise: "", // The currently selected exercise to add to the routine
      newRoutineName: '', // Data property for the new routine name
      newRoutineDate: '', // Data property for the new routine date
      activeEditCount: 0, // Counter to track edit state, ensure to multiple edits
      isEditingActive: false, // Single flag to indicate if any editing is active
    }
  },
  methods: {
    change() {
      this.refreshComp += 1;
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown && this.likedExercises.length === 0) {
        this.fetchLikedExercises();
      }
    },
    handleEditingChange(isEditing) {
      if (isEditing) {
        if (this.isEditingActive) {
          alert("Another routine is already being edited. Please save the current changes before editing another routine.");
          return; // Prevent state change if already active
        }
        this.isEditingActive = true;
      } else {
        this.isEditingActive = false;
      }
    },
    async fetchLikedExercises() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'users', user.uid, 'likedExercises'));
        const querySnapshot = await getDocs(q);
        this.likedExercises = querySnapshot.docs.map(doc => ({
          id: doc.id, // The document ID is the exercise name
        }));
      }
    },
    addExerciseToRoutine() {
      if (this.selectedExercise) {
        this.currentRoutine.push(this.selectedExercise);
        console.log("added " + this.selectedExercise);
        console.log(this.currentRoutine);
        this.selectedExercise = ""; // Reset the selection
      } else {
        alert("You have not selected an exercise.")
      }
    },
    async saveRoutineToFirestore(exercises) {
      const auth = getAuth();
      const user = auth.currentUser;
      const routineRef = doc(db, 'users', user.uid, 'routines', this.newRoutineName);
      await setDoc(routineRef, {
        name: this.newRoutineName,
        exercises: exercises,
        date: this.newRoutineDate,
        createdAt: new Date() // Optional property
      }, { merge: true });
      console.log(`Routine '${this.newRoutineName}' saved to Firestore`);
    },
    saveRoutine() {
      if (this.currentRoutine.length && this.newRoutineName && this.newRoutineDate) {
        this.saveRoutineToFirestore(this.currentRoutine); // Pass the array of exercises
        // Add to local routines array if needed...
        this.currentRoutine = []; // Reset for the next input
        this.newRoutineName = ''; // Reset the routine name
        this.newRoutineDate = ''; // Reset the routine date
        this.fetchRoutines(); // Update the display
      } else {
        alert("One of the required fields are missing.");
      }
    },
    async fetchRoutines() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const routinesRef = collection(db, 'users', user.uid, 'routines');
          const querySnapshot = await getDocs(routinesRef);
          this.routines = querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            exercises: doc.data().exercises,
            date: doc.data().date,
          }));
          console.log("Routines fetched from Firestore");
        } else {
          throw new Error("User is not authenticated.");
        }
      } catch (error) {
        console.error("Error fetching routines:", error.message);
      }
    },
    async deleteRoutine(routineId) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid, 'routines', routineId);
          await deleteDoc(docRef);
          console.log(`Deleted routine ${routineId}`);
          this.fetchRoutines(); // Refresh the list after deletion
        } else {
          throw new Error("User is not authenticated.");
        }
      } catch (error) {
        console.error("Failed to delete routine:", error.message);
      }
    },
    async updateRoutine(routineId, updatedExercises, updatedDate) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const routineRef = doc(db, 'users', user.uid, 'routines', routineId);
        try {
          await setDoc(routineRef, {
            exercises: updatedExercises,
            date: updatedDate
          }, { merge: true });
          console.log(`Routine '${routineId}' updated in Firestore.`);
          this.fetchRoutines(); // Refresh the routines from Firestore to reflect changes
        } catch (error) {
          console.error("Error updating routine:", error.message);
        }
      } else {
        console.error("User is not authenticated.");
      }
    },
    removeExercise(index) {
      this.currentRoutine.splice(index, 1); // Remove the exercise at the specified index
      console.log("Exercise removed");
    },
  },
  created() {
    this.fetchLikedExercises();
    this.fetchRoutines(); // Fetch routines when the component is created
    console.log("fetched liked exercises and routines");
  }
}
</script>

<style scoped>
#create-routine {
  display: flex;
  gap: 15px;
  margin: 20px 0px;
}

#my-routines-title {
  margin: 0px;
}

input {
  border-radius: 20px;
  border-width: 0px;
  padding: 5px 10px;
}

#name-field {
  padding-right: 50px;
}

select {
  border-radius: 20px;
  border-width: 0px;
  padding: 5px 10px; 
}

button {
  text-wrap: nowrap;
  border-radius: 20px;
  border-width: 0px;
  padding: 5px 10px;
  background-color: white;
}

li {
  padding-bottom: 10px;
}

#workout-container-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0px 15px;
}

#remove-button {
  margin-left: 10px;
}

.container {
  min-width: 250px;
}
</style>