<template>
  <div>
    <div id="profileContainer">
      <h1>My Profile</h1>
      <div id="profileDisplay">
        <div id="profileInfo">
          <ProfileInfo/>
        </div>
        <div id="changePassword" v-if="!isGoogle">
          <ChangePassword/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileInfo from '@/components/profile/ProfileInfo.vue';
import ChangePassword from '@/components/profile/ChangePassword.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'Profile',

  components: {
    ProfileInfo,
    ChangePassword
  },


  mounted() {
    const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        const provider =  user.providerData[0].providerId;
        console.log("new provider is", provider);
        if (provider == "google.com") {
          this.isGoogle = true;
        }
        console.log("is it google", this.isGoogle);
      }
    })
  },

  data() {
    return {
      refreshComp: 0,
      user: '',
      isGoogle: false
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
#profileContainer {
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: white;
  border-radius: 8px;
  min-width: fit-content;
  margin: 100px;
}

#profileDisplay {
  display: flex;
  justify-content: space-evenly;
  gap: 50px;
  margin-bottom: 20px;
}

#changePassword {
  width: 40%;
}

h1 {
  text-wrap: nowrap;
  margin: 0px;
}
</style>