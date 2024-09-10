  <template>
    <div class="calendar-widget">
      <div class="day" v-for="workout in workouts" :key="workout.id">
        <div class="date">{{ workout.date.toDateString() }}</div>
        <div class="activity" v-if="workout.activity">{{ workout.activity }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { db } from '@/firebase'; // Assuming this is correctly importing your Firebase database instance
  import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
  
  // Initialize the authentication service
  const auth = getAuth();

  export default {
    name: 'CalendarWidget',
    data() {
      return {
        workouts: []
      };
    },
    created() {
      // Listen for auth state changes and then fetch workouts
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.fetchRoutines();
        }
      });
    },
    methods: {
      // Async method to fetch routines
      fetchRoutines: async function() {
        const user = auth.currentUser;
        if (user) {
          try {
            // Reference to the user's routines collection
            const routinesQuery = query(
              collection(db, 'users', user.uid, 'routines'),
              orderBy('date', 'desc'),
              limit(3)
            );
            // Execute the query
            const querySnapshot = await getDocs(routinesQuery);
            this.workouts = querySnapshot.docs.map(doc => ({
              id: doc.id,
              date: new Date(doc.data().date), // Retrieve the date from the document
              activity: doc.data().name  // Retrieve the workout name from the document
            })).reverse();

          } catch (error) {
            console.error("Error fetching routines: ", error);
          }
        }
      }
    }
  }
</script>
  
  <style scoped>
  .calendar-widget {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #404b5a;
    border-radius: 15px; 
    padding: 20px; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    width: 100%;
  }
  
  .day {
    background-color: #323c4a; 
    border-radius: 10px;  
    padding: 10px 15px; 
    color: white; 
    font-size: 0.9em; 
  }
  
  .date {
    font-weight: bold;
  }
  
  .activity {
    background-color: #2d89ef;
    border-radius: 8px; 
    padding: 5px 12px; 
    margin-top: 5px; 
    max-width: 80%; 
    font-weight: 550
  }
  </style>
  