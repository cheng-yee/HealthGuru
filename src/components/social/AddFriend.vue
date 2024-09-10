<template>
  <div class="add-friend-container">
    <input type="text" placeholder="Search Username..." class="search-input" id="searchInput">
    <hr>
    <ul v-if="searchResults.length > 0">
      <li v-for="user in searchResults">
        <span style="color: #539fde;">
          {{ user.username }}
          <img src="@/assets/Add-Icon.png" alt="crossButton" class="clickable-img-wrapper social-icon" v-if="showAddButton" @click="addFriend(user)">
        </span>
        <span v-if="!showAddButton" class="addedText">
          Already Friends
          <img src="@/assets/Save-Icon.png" alt="crossButton" class=social-icon>
        </span>
      </li>
    </ul>
    <div v-else-if="searchQuery.length > 0" style="color: red;">No results found.</div>
  </div>
</template>
  
  <script>
  import { db } from '@/firebase';
  import { collection, query, getDocs, doc, setDoc, where } from 'firebase/firestore';
  
  export default {
    name: 'AddFriend',
    props: ['userid', 'userName'],
    emits: ['friendAdded'],
  
    data() {
      return {
        searchQuery: '',
        searchResults: [],
        typingTimer: null,
        showAddButton: true,
      };
    },

    mounted() {
      const comp = document.getElementById('searchInput');
      comp.addEventListener('keyup', this.handleInput);
    },

    beforeDestroy() {
      const comp = document.getElementById('searchInput');
      comp.removeEventListener('keyup', this.handleChange);
      clearTimeout(this.typingTimer);
    },
  
    methods: {
      async handleChange() {
        let searchName = document.getElementById('searchInput').value;
        this.searchResults.length = 0;
        this.searchQuery = searchName.trim(); // updates searchQuery
        if ((this.searchQuery == "") || (this.userName == this.searchQuery)) {
          return;
        }
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userInfo.username", "==", this.searchQuery));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          let userDetail = {
            uid: doc.id,
            username: doc.data().userInfo.username,
          };
          this.searchResults.push(userDetail);
        });

        const friendRef = collection(db, "users", this.userid, "friends"); // To query and check if searchQuery is in friends subcollection
        const friendQuery = query(friendRef, where("username", "==", this.searchQuery));
        const friendSnapshot = await getDocs(friendQuery);
        if (!friendSnapshot.empty) {
          this.showAddButton = false;
        } else {
          this.showAddButton = true;
        }
      },
      handleInput() {
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => {
          this.handleChange();
        }, 500)
      },
  
      async addFriend(user) {
        const friendRef = doc(db, 'users', this.userid, 'friends', user.uid);
        await setDoc(friendRef, { username: user.username }, { merge: true });
        this.$emit('friendAdded');
        this.showAddButton = !this.showAddButton;
        console.log(user.username, "added")
        document.getElementById('searchInput').value = "";
        this.searchResults.length = 0;
        this.searchQuery = "";
      },
    },
  };
  </script>
  
  <style scoped>
  .add-friend-container {
    align-self: stretch;
  }

  .search-input {
    width: 80%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 40px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 5px;
  }

  li {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 30px 0px 30px;
    padding-top: 0px;
  }

  .addedText {
    margin-left: 20px;
    color: #8fd78f;
    font-size: 14px;
  }

  span {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
  }

  button {
    margin-left: 20px;
    background-color: rgba(255, 255, 255, 0);
    border: none;
  }

  .social-icon {
    height: 24px;
  }

  .social-icon:hover {
    cursor: pointer;
  }
</style>
  