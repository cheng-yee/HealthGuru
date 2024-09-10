<template>
    <div id="app">
      <Topbar />
      <div id="main">
        <div id="nav">
          <!-- Navigation links -->
          <router-link to="/">
            <img src="@/assets/Home-Icon.png" alt="Home Icon" class="icon"/>
            Home</router-link>
          <router-link to="/workouts">
            <img src="@/assets/Workouts-Icon.png" alt="Workouts Icon" class="icon"/>
            Workouts</router-link>
          <router-link to="/routines">
            <img src="@/assets/Routines-Icon.png" alt="Routines Icon" class="icon"/>
            Routines</router-link>
          <router-link to="/meals">
            <img src="@/assets/Meals-Icon.png" alt="Meals Icon" class="icon"/>
            Meals</router-link>
          <router-link to="/calories">
            <img src="@/assets/Calories-Icon.png" alt="Calories Icon" class="icon"/>
            Calories</router-link>
          <router-link to="/social">
            <img src="@/assets/Social-Icon.png" alt="Social Icon" class="icon"/>
            Social</router-link>
        </div>
        <div id="content">
            <router-view class="router-view"/>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import Topbar from "@/views/TopBar.vue"
</script>

<style scoped>
  @media (hover: hover) {
    a:hover {
      background-color: #5B789F;
    }
  }

  @media (min-width: 1024px) {
    body {
      display: flex;
      place-items: center;
    }
  }
  
  .TopBar {
  position: fixed;
  display: flex;
  background-color: #335076;
  color: white;
  padding-left: 120px;
  height: 80px;
  width: 100%;
  align-content: center;
  z-index: 9999;
  }

</style>