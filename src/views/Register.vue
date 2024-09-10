<template>
<div id="registerContainer">
    <!--<h1 id="mainHead">Health Guru</h1>-->
    <h1>Create An Account</h1>

    <p class="login-prompt">
        Have an account?
        <router-link to="/login" class="login-link">Log in here</router-link>
    </p>

    <div class="field-container">
        <input type="email" placeholder="Email" v-model="email" @blur="validateEmail" />
       <!-- <span v-if="errors.email" class="error-message">{{ errors.email }}</span>-->
    </div>
    <div class="field-container">
        <input type="password" placeholder="Password" v-model="password" @blur="validatePassword" />
       <!-- <span v-if="errors.password" class="error-message">{{ errors.password }}</span>-->
    </div>
    <div class="field-container">
        <input type="text" placeholder="Username" v-model="username" />
        <!--<span v-if="errors.weight" class="error-message">{{ errors.weight }}</span>-->
    </div>
    <div class="field-container">
        <input type="text" placeholder="Weight (kg)" v-model="weight" @blur="validateWeight" />
        <!--<span v-if="errors.weight" class="error-message">{{ errors.weight }}</span>-->
    </div>
    <div class="field-container">
        <input type="text" placeholder="Height (cm)" v-model="height" @blur="validateHeight" />
        <!--<span v-if="errors.height" class="error-message">{{ errors.height }}</span>-->
    </div>
    <div class="field-container">
        <input type="date" placeholder="Birthday" v-model="birthday" @blur="validateBirthday" />
        <!--<span v-if="errors.birthday" class="error-message">{{ errors.birthday }}</span>-->
    </div>

    <p id="errorMsg" v-if="errorMessage">{{ errorMessage }}</p>
    <button @click="register">Register</button>
    <button @click="registerWithGoogle" class="google-btn">
        <img src="@/assets/GoogleLogo.png" alt="Google" class="google-icon">
        Register With Google
    </button>

</div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import firebaseApp  from '@/firebase.js'; 
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
    name: 'Register',

    data() {
        return {
            email: '',
            password: '',
            username: '',
            weight: '',
            height: '',
            birthday: '',
            errors: {
                email: null,
                password: null,
                weight: null,
                height: null,
                birthday: null
            },
            errorMessage: '',
            user: '',
            auth: getAuth(firebaseApp),
        };
    },

    methods: {
        validateEmail() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(this.email)) {
                this.errors.email = "Invalid email format."
                alert(this.errors.email);
            } else {
                this.errors.email = null;
            }
        },

        validatePassword() {
            const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@\^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@\^_`{|}~]{8,}$/;
            if (!re.test(this.password)) {
                this.errors.password = "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
                alert(this.errors.password);
            } else {
                this.errors.password = null;
            }
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
            this.validateEmail();
            this.validatePassword();
            this.validateHeight();
            this.validateBirthday();
            this.validateWeight();
            return Object.keys(this.errors).every(key => this.errors[key] === null);
        },


        async register() {
            if (!this.email || !this.password || !this.weight || !this.height || !this.birthday || !this.username) {
                this.errorMessage = "All fields are required.";
                return;
            }
            if (!this.validateForm()) {
                this.errorMessage = "Please correct errors before submitting";
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
                const uid = userCredential.user.uid;

                // save username to auth
                await updateProfile(this.auth.currentUser, {
                    displayName: this.username
                }).then(() => {
                    console.log("User Name updated successfully!");
                }).catch((error) => {
                    console.error("Error updating username:", error);
                });

                // update userInfo
                const docRef = doc(db, 'users', uid);
                await setDoc(docRef, {
                    userInfo: {
                        email: this.email,
                        username: this.username,
                        weight: parseFloat(this.weight), // latest weight will be saved in userInfo when changed in profile
                        height: parseFloat(this.height),
                        birthday: this.birthday
                    }
                }, { merge: true});

                const date = new Date().toISOString().slice(0, 10);
                const weightDocRef = doc(db, 'users', uid, 'weights', String(date));

                // document of historical weights 
                try {
                    await setDoc(weightDocRef, {
                        weight: parseFloat(this.weight),
                        date: date
                    }, { merge: true });

                
                } catch (error) {
                    console.error("Error updating weight entry:", error);
                };

                alert("Successfully Registered!");
                this.$router.push('/');
                

            } catch (error) {
                console.error(error.code);
                switch(error.code) {
                    case "auth/email-already-in-use": 
                        this.errorMessage = "Email is in use";
                        break;
                    case "auth/weak-password": 
                        this.errorMessage = "Password should have at least 6 characters";
                        break;
                    default: 
                        this.errorMessage = "Invalid email or password";
                }
            }
        },


        async registerWithGoogle() {
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(this.auth, provider);

                
                // push to profile page to fill up
                this.$router.push('/profile');
                alert("Successfully Registered!");

            } catch (error) {
                console.error(error.code);
            }
        },
    },
};
</script>

<style scoped>
.login-prompt {
    text-align: center;
    margin-top: 5px;
    margin-bottom: 20px;
}

.login-link {
    color: #007BFF;
    font-weight: 550; 
}

.login-link:hover {
    text-decoration: underline; 
}


#registerContainer {
    max-width: 95%;
    margin: auto;
    padding: 20px;
    margin-top: 3%;
    margin-left: 5%;
    margin-right: 5%;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.field-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 20px;
    width: 15%;
}

.field-container input[type="text"],
.field-container input[type="email"],
.field-container input[type="password"],
.field-container input[type="date"] {
    width: 100%; 
    max-width: 300px;
    padding: 8px; 
    margin-bottom: 3px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
}

button {
    width: 200px;
    height: 1%;
    margin-bottom: 1%;
    padding: 10px;
    background-color: rgb(56, 126, 224);;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border-radius: 6px;
    font-weight: bolder;
}



button:hover {
    background-color: #f6f6f6;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    color: black;
}

.google-btn {
  background-color: white;
  padding: 10px 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 5%;
  color: black;
}

.google-icon {
  width: 17px;
  height: 17px; 
  margin-right: 10px;
}



#errorMsg{
    color: red;
    text-align: center; 
}


/* 
.error-message {
  color: #ff0000; 
  font-size: 0.8em;
  margin-left: 10px;
  white-space: nowrap; 
} 
*/
</style>
