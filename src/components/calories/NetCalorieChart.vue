<template>
    <div class="chartContainer">
        <span>Net Calories</span>
        <Bar 
            id="NetCalorieChart"
            :data="chartData"
            :options="options"/>
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  name: 'NetCalorieChart',

  components: {
    Bar
  },

  props: {
    consumed: {
        type: Number,
        default: 0
    },
    burnt: {
        type: Number,
        default: 0
    },

    netCalories: {
        type: Number,
        default: 0
    },
  },

  data() {
    return {
        options: {
            responsive: true,
            scales: {
                x: {
                    grid: {
                        offset: true
                    }
                }
            },
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: true,
                    position: "top",

                }
            }
        }
    }
  },

  computed: {
    chartData() {
      return {
        labels: ['Calories'],
        datasets: [{
            label: 'Consumed',
            backgroundColor: ['rgba(54, 162, 235, 0.6)'],
            data: [this.consumed],
            borderColor: ['rgba(54, 162, 235, 1)'],
            borderWidth: 1
        },{
            label: 'Burnt',
            backgroundColor: ['rgba(255, 206, 86, 0.6)'],
            data: [this.burnt],
            borderColor: ['rgba(255, 206, 86, 1)'],
            borderWidth: 1
        },{
            label: 'Net',
            backgroundColor: ['rgba(75, 192, 192, 0.6)'],
            data: [this.netCalories],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1
        }]
      };
    },
  },
};
</script>
<style scoped>
.chartContainer {
  background-color: #dfe2e7;
  border-radius: 15px;       
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  align-items: center;
  padding: 1rem;
  font-weight: bold;
  justify-content: space-around;
}
</style>