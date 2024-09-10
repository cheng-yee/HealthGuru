<template>
  <div class="content-container">
    <h1 class="leaderboard-heading">Leaderboard</h1>
    <AddFriend @friendAdded="change" :userid="uid" :userName="username"></AddFriend>
    <Ranks @friendDeleted="change" :key="refreshComp" :userid="uid"></Ranks>
  </div>
</template>

<script>
import AddFriend from '@/components/social/AddFriend.vue';
import Ranks from '@/components/social/Ranks.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'Leaderboard',

  components: {
    AddFriend,
    Ranks,
  },

  data() {
    return {
      uid: "",
      username: "",
      refreshComp:0,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.uid = user.uid;
        this.username = user.displayName;
      }
    });
    console.log("done")
  },

  methods: {
    change() {
      this.refreshComp += 1;
      console.log("Changed", this.refreshComp)
    }
  },
};
</script>
  
<style scoped>
.social-page {
  display: flex;
  justify-content: space-between;
}

.content-container {
  display: flex;
  flex: 1;
  text-align: center;
  background-color: #ffffff;
  padding: 10px;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}

.leaderboard-heading {
  color: #335076;
  margin-bottom: 10px;
}

.search-username {
  margin-top: 10px;
  border-radius: 20px;
}
</style>