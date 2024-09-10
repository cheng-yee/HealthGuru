<template>
    <Line
      id="steps_widget"
      ref="chartRef"
      :options="chartOptions"
      :data="chartData"
    />
  </template>
  
  <script>
  import { onMounted, watch, ref, reactive } from 'vue';
  import { Line } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { db } from '@/firebase';
  import { collection, query, orderBy, getDocs } from 'firebase/firestore';
  import firebaseApp from '@/firebase';

  // Get a reference to the auth service
  const auth = getAuth(firebaseApp);

  ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)
  
  export default {
    name: 'stepsWidget',
    components: { Line },
    setup() {
      const chartData = reactive({
        labels: [], // Will be populated with dates
        datasets: [{
          label: 'Total number of steps',
          backgroundColor: 'rgba(0, 128, 128, 0.5)',
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
            text: 'Daily Step Count',
            color: 'Black' // Adjust the title color
          }
        },
        scales: {
          x: {
            ticks: {
            color: 'Black' // Adjust the x-axis labels color
            },
            grid: {
              display: false // Adjust the color of the x-axis grid lines
            }
        },
          y: {
            ticks: {
              color: 'Black' // Adjust the y-axis labels color
            },
            grid: {
              color: 'rgba(0,0,0, 0.1)' // Adjust the color of the y-axis grid lines
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

      const fetchStepsData = async () => {
        const user = auth.currentUser;
        if (user) {
            // Reference to the user's steps collection
            const stepsCollectionRef = collection(db, 'users', user.uid, 'steps');

            // Query documents sorted by date
            const q = query(stepsCollectionRef, orderBy("__name__", "asc"));
            const querySnapshot = await getDocs(q);
            // need to implement lookback period --> limit to 7 days

            // Reset chart data before adding new data
            chartData.labels = [];
            chartData.datasets[0].data = [];

            // Populate chart data with steps from Firestore
            querySnapshot.forEach((doc) => {
              console.log(chartData.labels)
              const [year, month, day] = doc.id.split('-');
              const dateFormatted = `${day}-${month}`; // Convert 'YYYY-MM-DD' to 'DD-MM' for the chart labels
              chartData.labels.push(dateFormatted);
              chartData.datasets[0].data.push(doc.data().steps);
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
          fetchStepsData();
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
#steps_widget {
  background-color: #dfe2e7;
  border-radius: 15px;       
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Box shadow for depth*/
}
</style>
