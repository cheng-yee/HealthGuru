<template>
    <Bar 
      id="netCalories_widget"
      ref="chartRef"
      :data="chartData"
      :options="chartOptions" 
    />
  </template>
  
  <script>
  import { onMounted, watch, ref, reactive } from 'vue';
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { db } from '@/firebase';
  import { collection, query, orderBy, getDocs, doc, getDoc, limit} from 'firebase/firestore';
  import firebaseApp from '@/firebase';

  // Get a reference to the auth service
  const auth = getAuth(firebaseApp);
  
  // Register the components from Chart.js
  ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement)
  
  export default {
    name: "netCaloriesWidget",
    components: {
       Bar
    },
    setup() {
      const chartData = reactive({
        labels: [], // Will be populated with dates
        datasets: [{
          backgroundColor: 'rgba(0, 128, 128, 0.7)',
          borderColor: '#008080',
          data: [], // Will be populated with step data
          tension: 0.3,
        }],
      });

      const chartOptions = reactive({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display:false,
          },
          title: {
            display: true,
            text: 'Net Calories',
            color: 'Black' 
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'Black' 
            },
            grid: {
              display: false 
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'Black' 
            }
          }
        }
      });
    
      const chartRef = ref(null);

      watch(chartData, (newData) => {
        const chartInstance = chartRef.value.chart;
        chartInstance.data = newData;
        chartInstance.update();
      });

      const fetchNetCaloriesData  = async () => {
        const user = auth.currentUser;
        if (user) {
            // Reference to the user's collection
            const userInfoRef = doc(db, 'users', user.uid);
            const userInfoDoc = await getDoc(userInfoRef);
            const calorieGoal = 2500;

            const caloriesDateCollectionRef = collection(db, 'users', user.uid, 'caloriesDate');
            const q = query(
              caloriesDateCollectionRef,
              orderBy("__name__", "asc"), // Order by document ID (date) in descending order
              // limit(7) // Limit to the latest 7 documents
            );
            const querySnapshot = await getDocs(q);

            // Reset chart data before adding new data
            chartData.labels = [];
            chartData.datasets[0].data = [];

            // Populate chart data with steps from Firestore
            querySnapshot.forEach((doc) => {
              const [year, month, day] = doc.id.split('-');
              const dateFormatted = `${day}-${month}`; // Convert 'YYYY-MM-DD' to 'DD-MM' for the chart labels
              const data = doc.data();
              
              
              // Calculate total calories consumed
              const totalConsumed = data.meals.reduce((acc, meal) => acc + meal.calories, 0);
              console.log(totalConsumed);
              // Calculate total calories burnt
              const totalBurnt = data.exercises.reduce((acc, exercise) => acc + exercise.calories, 0);
              // Calculate net calories for the date
              const netCalories = (totalConsumed - totalBurnt) - calorieGoal;              
              
              // Push data to chart
              chartData.labels.push(dateFormatted); 
              chartData.datasets[0].data.push(netCalories);
          });
        } else {
            // User is not signed in
            console.log("User is not signed in to fetch steps data.");
        }
        console.log(chartData.datasets[0].data); // Debug log the final dataset array
      };

      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            fetchNetCaloriesData();
          }
        });
      });

      return {
        chartData,
        chartOptions,
        chartRef,
      };
    },
  }
  </script>
  
  <style scoped>
    #netCalories_widget {
    background-color: #dfe2e7;
    border-radius: 15px;   
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  </style>
  