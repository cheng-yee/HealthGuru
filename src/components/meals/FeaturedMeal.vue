<template>
	<div>

		<div class="clickable" @click="handleClick">
      <img class="featured-img" :src="mealInfo['strMealThumb']">
      <div id="featured-text">
        <h1 id="featured-title" >{{ "Featured Meal: " }}</h1>
        <h2>{{  this.$capitalizeFirstLetter(mealInfo['strMeal'])  }}</h2>
      </div>
		</div>

		<div class="overlay" v-if="showOverlay">
			<div class="container">
				<div class="topContainer">
					<h1 style="font-size: 1.8em;">{{ this.$capitalizeFirstLetter(mealInfo['strMeal']) }}</h1>
					<div class="buttonsContainer">
						<button @click.prevent="hidePopup" class="clickable-img-wrapper">
							<img src="@/assets/Cross-Icon.png" alt="crossButton" class="icon">
						</button>
					</div>
				</div>
				<hr>

				<div class="contentContainer">
					<div class="recipeContainer">
						<img :src="mealInfo['strMealThumb']" alt="crossButton" class="food">
						<h3>Ingredients</h3>
						<ul>
							<li class=ingredList v-for="ingredient in ingredients">
								<p class=ingredList>{{ this.$capitalizeFirstLetter(ingredient) }} </p>
							</li>
						</ul>
						<h3>Instructions</h3>
						<p>{{ mealInfo['strInstructions'] }}</p>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
export default {
	name: 'FeaturedMeal',
	props: ['mealInfo'],
	data() {
		return {
			showOverlay: false,
		};
	},
	computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.mealInfo['strMealThumb']})`,
        backgroundSize: 'cover',
        // Add other styles as needed
      };
    },
		ingredients() {
			var ingredList = []
			for (let i = 1; i <= 20; i++) {
				var ingredientKey = "strIngredient" + i
				var measurementKey = "strMeasure" + i
				if (this.mealInfo[ingredientKey]) {
					var measuredIngredient = this.mealInfo[measurementKey] + " " + this.mealInfo[ingredientKey]
					ingredList.push(measuredIngredient)
				} else {
					break;
				}
			}
			return ingredList;
		}
	},
	methods: {
		handleClick() {
			this.showOverlay = !this.showOverlay;
		},
		hidePopup() {
			this.showOverlay = !this.showOverlay;
		}
	}
}
</script>

<style scoped>
.clickable {
	display: flex;
	margin: 0px;
	padding: 15px;
	align-items: top;
	justify-content: center;
  gap: 15px;
}

.container {
	position: relative;
	background-color: #dfe2e7;
	width: 500px;
	height: 500px;
	padding-left: 1em;
	border-radius: 10px;
}

.topContainer {
	display: inline-block;
	width:85%;

}
.contentContainer {
	height: 70%;
	overflow: auto;
}
.buttonsContainer {
	position: absolute;
	top: 2%;
	right: 2%;
}

.clickable-img-wrapper {
	background-color: rgba(255, 255, 255, 0);
	border: none;
	transition: transform .2s;
	/* Animation */
}
.clickable-img-wrapper:hover {
	cursor: pointer;
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
	z-index: 9999;
	cursor: initial;
	/* Ensure popup is above content */
}
pre {
	white-space: pre-wrap;
	font-size: medium;
}
.ingredList {
	margin: 0;
	padding: 0;
}
.food {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 70%;
}
.featured-img {
  height: 250px;
  border-radius: 10px;
}
#featured-text {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>