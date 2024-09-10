<template>
  <div class="container">

    <div class="featuredMealsContainer">
      <FeaturedMeal class="clickablef" :mealInfo="randomMeal1" />
      <FeaturedMeal class="clickablef" :mealInfo="randomMeal2" />
    </div>

    <div class="mealsContainer">
      <MealType class="clickable" id="vegan" mealType="Vegan" @mealSelected="selectMeal($event)" />
      <MealType class="clickable" id="vegetarian" mealType="Vegetarian" @mealSelected="selectMeal($event)" />
      <MealType class="clickable" id="chicken" mealType="Chicken" @mealSelected="selectMeal($event)" />
      <MealType class="clickable" id="pasta" mealType="Pasta" @mealSelected="selectMeal($event)" />
      <MealType class="clickable" id="seafood" mealType="Seafood" @mealSelected="selectMeal($event)" />
      <MealList class="overlay" :mealType=this.selectedMealType v-if="showMeals" @close="showMeals = false" />
    </div>
  </div>
</template>
  
<script>
import MealType from '@/components/meals/MealType.vue';
import MealList from '@/components/meals/MealList.vue';
import FeaturedMeal from '@/components/meals/FeaturedMeal.vue';
import axios from 'axios';

  export default {
    name: 'Meals',
    components: {
      MealType,
      MealList,
      FeaturedMeal,
    },
    data() {
      return {
        selectedMealType : "",
        showMeals: false,
        selectedRecipe : "",
        randomMeal1: {},
        randomMeal2: {},
      }
    },
    async mounted() {
      const response1 = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      // response1.data['meals'][0]['strMeal'] = "Featured: " + response1.data['meals'][0]['strMeal'];
      this.randomMeal1 = response1.data['meals'][0];

      const response2 = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
      // response2.data['meals'][0]['strMeal'] = "Featured: " + response2.data['meals'][0]['strMeal'];
      this.randomMeal2 = response2.data['meals'][0];
    },
    methods: {
      selectMeal(mealType) {
        this.selectedMealType = mealType;
        this.showMeals = !this.showMeals;
      }
    }
  }
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 20px 0px;
}
.featuredMealsContainer {
  display: flex;
}
.mealsContainer {
  display: flex;
}
.clickable, .clickablef {
  display: flex;
  min-width: 200px;
  min-height: 200px;
  border-radius: 10px;
  margin:10px;
  cursor: pointer;
  flex-basis: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 25%;
  transition: 0.2s;
}
.clickable:hover {
  opacity: 0.8;
}
.clickablef {
  background-color: #335076;
}
.clickablef:hover {
  background-color: #5B789F;
}
#vegan {
  background-image: url("@/assets/VeganImage.jpg");
  background-size: cover;
}
#vegetarian {
  background-image: url("@/assets/VegetarianImage.jpg");
  background-size: cover;
}
#chicken {
  background-image: url("@/assets/ChickenImage.jpg");
  background-size: cover;
}
#seafood {
  background-image: url("@/assets/SeafoodImage.jpg");
  background-size: cover;
}
#pasta {
  background-image: url("@/assets/PastaImage.jpg");
  background-size: cover;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure popup is above content */
}
</style>