<template>
  <div class="workout-info" v-if="showWorkout">
    <div id="title-row">
      <h1 id="workout-title">{{ this.$capitalizeFirstLetter(exerciseName) }}</h1>
      <a href="#" @click="toggleLike" class="clickable-img-wrapper">
        <img :src="isLiked ? likedIcon : likeIcon" alt="likeIcon" class="icon">
      </a>
      <a @click.prevent="hideWorkoutInfo" class="clickable-img-wrapper">
        <img src="@/assets/Cross-Icon.png" alt="crossButton" class="icon">
      </a>
    </div>
    <div class="exercise-content">
      <!-- <a href="#" class="clickable-img-wrapper">
        <img src="@/assets/Left-Icon.webp" alt="leftIcon" class="arrows" id="left">
      </a> -->
      <div id="img-and-desc">
        <p>Difficulty: {{ this.$capitalizeFirstLetter(exerciseDifficulty) }}<br>
          Type: {{ this.$capitalizeFirstLetter(exerciseType) }}
        </p>
        <div class="youtube-link-container">
          <a :href="youtubeLink" target="_blank" rel="noopener noreferrer">Video Demonstration</a>
        </div>
        <div id="description">
          <ul>
            <li v-for="(step, index) in exerciseSteps.split('.').filter(step => step.trim())" :key="index">
              {{ step.trim() }}.
            </li>
          </ul>
        </div>
      </div>
      <!-- <a href="#" class="clickable-img-wrapper">
        <img src="@/assets/Right-Icon.webp" alt="rightIcon" class="arrows" id="right">
      </a> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseApp from '@/firebase';

import likedIcon from '@/assets/Liked-Icon.png';
import likeIcon from '@/assets/Like-Icon.png';

// Get a reference to the auth service
const auth = getAuth(firebaseApp);

export default {
  name: 'workoutInfo',
  props: {
    showWorkout: Boolean,
    exerciseName: String,
    exerciseDifficulty: String,
    exerciseType: String,
    exerciseSteps: String,
  },
  data() {
    return {
      youtubeLink: '',
      isLiked: false, // This will be updated based on Firestore data
      likedIcon,
      likeIcon,
    };
  },
  methods: {
    toggleLike(event) {
      console.log("toggling like ", this.isLiked);
      event.preventDefault();
      this.isLiked = !this.isLiked; // Toggle the current state

      // Get the current user's UID
      const user = auth.currentUser;
      if (user) {
        this.updateExerciseLikeStatus(user.uid);
        console.log("like status updated for user " + user.uid);
      } else {
        console.log("User is not logged in");
      }
    },
    async updateExerciseLikeStatus(uid) {
      const exerciseLikesDocRef = doc(db, 'users', uid, 'likedExercises', this.exerciseName);

      if (this.isLiked) {
        // Set the document if liked
        try {
          await setDoc(exerciseLikesDocRef, { isLiked: this.isLiked }, { merge: true });
          console.log("Liked exercise updated in Firestore for user " + uid);
        } catch (error) {
          console.error("Error when liking exercise in Firestore for user " + uid, error);
        }
      } else {
        // Delete the document if unliked
        try {
          await deleteDoc(exerciseLikesDocRef);
          console.log("Unliked exercise deleted from Firestore for user " + uid);
        } catch (error) {
          console.error("Error when unliking (deleting) exercise in Firestore for user " + uid, error);
        }
      }
    },
    async checkLikeStatus() {
      // Get the current user's UID
      const user = auth.currentUser;
      if (user) {
        const exerciseLikesDocRef = doc(db, 'users', user.uid, 'likedExercises', this.exerciseName);
        const docSnap = await getDoc(exerciseLikesDocRef);
        // Update isLiked based on Firestore data
        this.isLiked = docSnap.exists() && docSnap.data().isLiked;
      }
    },
    hideWorkoutInfo() {
      this.$emit('close');
      console.log("Hiding workout info");
    },
    async fetchYoutubeLink(searchQuery) {
      // Existing axios call to fetch YouTube link
      const options = {
        method: 'GET',
        url: 'https://youtube-v31.p.rapidapi.com/search',
        params: {
          q: searchQuery,
          part: 'snippet,id',
          regionCode: 'US',
          maxResults: '1', // Fetch only the first result
          order: 'date'
        },
        headers: {
          'X-RapidAPI-Key': '',
          'X-RapidAPI-Host': ''
        }
      };

      try {
        const response = await axios.request(options);
        if (response.data.items.length > 0) {
          const videoId = response.data.items[0].id.videoId;
          this.youtubeLink = `https://www.youtube.com/watch?v=${videoId}`; 
        }
      } catch (error) {
        console.error('Error fetching YouTube link:', error);
      }
    }
  },
  created() {
    this.fetchYoutubeLink(this.exerciseName);
    this.checkLikeStatus();
    console.log("Component created and YouTube link fetched");
  }
};
</script>


<style scoped>
.workout-info {
  background-color: #dfe2e7;
  border-radius: 15px;
  margin: 50px auto;
  padding: 20px 20px 0px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 70vw;
  height: 60vh;
  overflow-y: scroll;
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

#description {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.youtube-link-container a {
  text-decoration: none;
  font-weight: bold;
}

.youtube-link-container a:hover {
  text-decoration: underline;
}
</style>
