<template>
    <div class="menu" @click="isOpen = !isOpen">
      <img src="@/assets/profileIcon.png" alt="profileIcon" class="profile-icon">
      <transition name="fade" appear>
         <div class="sub-menu" v-if="isOpen">
            <div class="item">
              <router-link to="/profile">Profile</router-link>
            </div>
            <div class="item">
              <button id="logout-button" @click="logOut">Log Out</button>
            </div>
          </div>
      </transition>
    </div>
</template>


<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default {
    name: 'Options',

    props: {
      user: Object,
    },

    data() {
      return {
        isOpen: false,
      }
    },

    methods: {
      logOut() {
        const auth = getAuth();
        const user = auth.currentUser;
        signOut(auth, user)
        this.$emit('logged-out');
        this.$router.push('/login')
      }
    },
}

</script>
<style scoped>
.item {
  padding: 20px 20px;
  transition: 0.3s;
  height: 18px;
}
.menu {
  color: black;
  padding: 20px 20px;
  position: relative;
  text-align: center;
  display: flex;
  transition: 0.3s;
  justify-content: center;
}

.menu:hover {
  background-color: #5B789F;
}

.menu .sub-menu {
  position: absolute;
  white-space: nowrap;
  background-color: white;
  top: 105%;
  transform: translateX(-40%);
  width: max-content;
  border-radius: 0px 0px 16px 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
}
.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#logout-button {
  border-radius: 10px;
  border-width: 0px;
  background-color: #98c4e8;
}
#logout-button:hover {
  cursor: pointer;
}
.profile-icon {
  width: 20px;
  height: 20px;
  align-self: center;
}
</style>