<template>
  <div class="clickable" @click="handleClick">
    <h1 id="type-title" style="color: white;">{{ mealName }}</h1>
  </div>
</template>

<script>
export default {
  name: 'MealType',
  props: ['mealType'],
  data() {
    return {
      mealName: this.mealType,
    };
  },
  methods: {
    handleClick() {
      this.$emit('mealSelected', this.mealName);
    }
  }
}
</script>

<style scoped>
.clickable {
  display: flex;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

#type-title {
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>