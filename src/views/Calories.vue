<template>
  <div class="calorie-widgets">
    <div id="calorie-goal">
      <CalorieGoalDoughnut :net-calories="netCalories" />
    </div>
    <CalorieInput @update-calories="updateCalories" />
    <div id="input-and-net">
      <div id="input-data">
        <InputDataPopup @recorded="updateCalories" />
      </div>
      <div id="net-calorie-chart">
        <NetCalorieChart :consumed="consumed" :burnt="burnt" :net-calories="netCalories" />
      </div>  
    </div>
  </div>
</template>
  
  
<script>
import CalorieGoalDoughnut from '@/components/calories/CalorieGoal.vue'
import CalorieInput from '@/components/calories/CalorieInput.vue'
import NetCalorieChart from '@/components/calories/NetCalorieChart.vue'
import InputDataPopup from '@/components/calories/InputData.vue' 

export default {
  name: 'App',
  components: {
    CalorieGoalDoughnut,
    CalorieInput,
    NetCalorieChart,
    InputDataPopup
  },
  data() {
    return {
      consumed: 0,
      burnt: 0,
      netCalories: 0,
      refreshComp: 0
    }
  },
  methods: {
    updateCalories(calorieData) {
      this.consumed = calorieData.consumed;
      this.burnt = calorieData.burnt;
      this.netCalories = this.consumed - this.burnt;
    },

    change() {
      this.refreshComp += 1
    }
  }
}
</script>

<style scoped>
.calorie-widgets {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 30px;
  row-gap: 30px;
  margin: 20px;
}

#input-and-net {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 35%;
} 

#calorie-goal {
  width: 100%;
}
</style>