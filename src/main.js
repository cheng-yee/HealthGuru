import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import firebaseApp from '@/firebase.js'
import App from './App.vue'
import router from './router'
const app = createApp(App)

// Global method to capitalise Strings
app.config.globalProperties.$capitalizeFirstLetter = (string) => {
  if (!string) return '';
  console.log("Capitalising...")
  return string
    .split(' ') // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back into a single string
};

app.use(createPinia())
app.use(router)

app.mount('#app')
