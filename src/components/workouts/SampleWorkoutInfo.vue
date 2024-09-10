<template>
  <div class="workout-info">
    <div id="title-row">
      <h1 id="workout-title">Lateral Pulldown</h1>
      <a href="#" class="clickable-img-wrapper">
        <img src="@/assets/Like-Icon.webp" alt="likeIcon" class="icon">
      </a>
      <a @click.prevent="hideWorkoutInfo" class="clickable-img-wrapper">
        <img src="@/assets/Cross-Icon.png" alt="crossButton" class="icon">
      </a>
    </div>
    <div class="exercise-content">
      <a href="#" class="clickable-img-wrapper">
        <img src="@/assets/Left-Icon.webp" alt="leftIcon" class="arrows" id="left">
      </a>
      <div id="img-and-desc">
        <div class="exercise">
          <img src="@/assets/LateralPulldown.webp" alt="pulldown">
        </div>
        <div id="description">
          <ol>
            <li>Grasp the bar with a wide grip with an overhand, knuckles-up grip.</li>
            <li>Pull the bar down until it's approximately level with the chin.</li>
            <li>Squeeze the shoulder blades together while maintaining square shoulders.</li>
            <li>Slowly return the bar to the starting position while controlling its gradual ascent.</li>
          </ol>
        </div>
      </div>
      <a href="#" class="clickable-img-wrapper">
        <img src="@/assets/Right-Icon.webp" alt="rightIcon" class="arrows" id="right">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'workoutInfo',
  props: {
    showWorkout: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    hideWorkoutInfo() {
      // Emit an event to the parent component
      this.$emit('close');
      console.log("Hiding workout info");
    },
  },
};
</script>

<style scoped>
.clickable-img-wrapper {
  display: inline-block;
  transition: transform .2s; /* Animation */
}

.clickable-img-wrapper:hover {
  transform: scale(1.5);
}

a {
  padding: 0;
}

.arrows {
  height: 64px;
  margin: 10px;
}

.icon {
  margin: 0px 15px;
}

#title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

#workout-title {
  margin: 5px;
  flex-grow: 1;
}

.exercise-content {
  display: flex;
  align-items: center;
}

#img-and-desc {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
}

.exercise {
  display: flex;
  justify-content: center;
}

.exercise img {
  width: auto;
  max-height: 40vh;
}

#description {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.workout-info {
  background-color: #dfe2e7;
  border-radius: 15px;
  margin: 50px auto;
  padding: 20px 20px 0px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
