<template>
    <div class="profileInfo">
        <h3><strong>Profile Info</strong></h3>
        <div id="profileFields">
          <p>Username: <input v-model="username" placeholder="Enter username" type="text" /></p>
          <p>Email: <strong>{{ email }}</strong></p>
          <p>Height (cm): <input v-model="height" placeholder="Enter height" type="text" @input = "clearError" @blur="validateHeight" /></p>
          <p>Weight (kg): <input v-model="weight" placeholder="Enter weight" type="text" @input = "clearError"  @blur="validateWeight"/></p>
          <p>Birthday: <input v-model="birthday" placeholder="Birthday" type="date" @input = "clearError"  @blur="validateBirthday" /></p>
          <p id="errorMsg" v-if="errorMessage">{{ errorMessage }}</p>
          <p id="resultMsg" v-if="resultMessage">{{ resultMessage }}</p>    
          <button @click="updateUserProfile">Save Changes</button>
        </div>          
    </div>
</template>
<script>
import { db } from '@/firebase';
import { doc, setDoc, getDoc} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';

export default {
    name: 'ProfileInfo',

    data() {
        return {
            email: '',
            username: '',
            weight: '',
            height: '',
            birthday: '',
            errorMessage: '',
            resultMessage: '',
            user: '',
            uid: '',
            errors: {
                weight: null,
                height: null,
                birthday: null,
            },
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            this.user = user;
            this.uid = user.uid;
            this.username = user.displayName || '';
            this.email = user.email || '';
            const docRef = doc(db, 'users', this.uid);
            this.fetchData(docRef);
        }
        })
    },

    methods: {
        
        async fetchData(docRef) {
            try {
                const docSnap = await getDoc(docRef);
                console.log(docSnap.data())

                // check if document exists and is not missing
                if (docSnap.exists() && docSnap.data().userInfo) {
                    const userData = docSnap.data().userInfo
                    this.weight = userData.weight,
                    this.height = userData.height,
                    this.birthday = userData.birthday
                    // username and email gotten in mounted

                } else {
                    await setDoc(docRef, {
                        userInfo: {
                            email: this.email,
                            username: this.username,
                            weight: this.weight,
                            height: this.height,
                            birthday: this.birthday
                        }
                    });
                }
            } catch (error) {
                this.errorMessage = error.message;
            }
        },

        clearError() {
            this.errorMessage = '';
        },


        validateHeight() {
            const height = parseFloat(this.height);
            if ((height < 50 || height > 251)) {
                this.errors.height = "Height must be between 50 and 250 cm.";
                alert(this.errors.height);
            } else {
                this.errors.height = null;
            }
        },

        validateWeight() {
            const weight = parseFloat(this.weight);
            if ((weight <= 0 || weight > 250)) {
                this.errors.weight = "Weight must be between 1 and 250 kg.";
                alert(this.errors.weight);
            } else {
                this.errors.weight = null;
            }
        },

        validateBirthday() {
            const birthday = new Date(this.birthday);
            const today = new Date();
            const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); // 100 years ago
            if ((birthday < minDate || birthday > today)) {
                this.errors.birthday = "Invalid Date of Birth";;
                alert(this.errors.birthday);
            } else {
                this.errors.birthday = null;
            }
        },

        validateForm() {
            this.validateHeight();
            this.validateWeight();
            return Object.keys(this.errors).every(key => this.errors[key] === null);
        },

        async updateUserProfile() {
            const docRef = doc(db, 'users', this.uid);
            if (!this.username || !this.height || !this.weight || !this.birthday) {
                this.errorMessage = "All fields are required"
            }
            if (!this.validateForm()) {
                this.errorMessage = "Please correct errors before submitting";
                return;
            }
            try {
                // update latest userInfo
                await setDoc(docRef, {
                    userInfo: {
                        email: this.email,
                        username: this.username,
                        weight: parseFloat(this.weight),
                        height: parseFloat(this.height),
                        birthday: this.birthday
                    }
                });

                // update displayName on auth side if changed
                if (this.user.displayName != this.username) {
                    await updateProfile(this.user, {
                        displayName: this.username
                    });
                };

                const date = new Date().toISOString().slice(0, 10);
                const weightDocRef = doc(db, 'users', this.uid, 'weights', String(date));

                // update document of historical weights 
                await setDoc(weightDocRef, {
                        weight: parseFloat(this.weight),
                        date: date
                }, { merge: true });
                this.resultMessage = "Changes saved succesfully!";
            } catch (error) {
                this.errorMessage = 'Failed to update profile' + error.Message;
            }
        }
    }

}
</script>

<style scoped>
#profileFields {
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: visible;
}

p {
  display: flex;
  margin: 0px;
  align-items: center;
  gap: 10px;
  text-wrap: nowrap;
}

input {
  flex-grow: 1;
  padding: 8px; 
  border: 1px solid #ccc; 
  border-radius: 4px;
}

button {
  display: flex;
  padding: 10px;
  background-color: rgb(56, 126, 224);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  font-weight: bolder;
  justify-content: center;
}

button:hover {
  background-color: #f6f6f6;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  color: black;
}

#errorMsg{
  color: red;
}

</style>