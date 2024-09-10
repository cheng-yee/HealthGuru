<template>
  <div class="container">
    <div class="widgets">
      <div id="weight">
        <weightWidget />
      </div>
      <div id="steps">
        <stepsWidget />
      </div>
      <div id="netCalories">
        <netCaloriesWidget />
      </div>
      <div id="stack">
        <div id="activity">
          <activityWidget />
        </div>
        <div id="featured">
          <FeaturedExercise/>
        </div>
      </div>
      <div id="calendar">
        <calendarWidget />
      </div>
    </div>
  </div>
  
</template>
  
<script>
  import weightWidget from '@/components/home/Weight.vue'
  import stepsWidget from '@/components/home/Steps.vue'
  import calendarWidget from '@/components/home/Calendar.vue'
  import netCaloriesWidget from '@/components/home/NetCalories.vue'
  import activityWidget from '@/components/home/Activity.vue'
  import FeaturedExercise from '@/components/home/FeaturedExercise.vue'

  export default {
    name: 'App',
    components: {
      weightWidget,
      stepsWidget,
      calendarWidget,
      netCaloriesWidget,
      activityWidget,
      FeaturedExercise,
    },
    data() {
      return {
        refreshComp: 0
      }
    },
    methods: {
      change() {
        this.refreshComp += 1
      }
    }
  }
</script>

<style scoped>
.container {
  margin: 20px;
}

.widgets {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  row-gap: 30px;
}

#weight, #steps, #netCalories{
  width: 30%;
  height: 25vh;
}

#stack {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
}

#calendar {
  display: flex;
  width: 25%;
}

#featured {
  width: 100%;
}
</style>