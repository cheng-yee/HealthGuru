<template>
    <div id="loginContainer">
        <h1>Sign in to HealthGuru</h1>

        <p class="register-prompt">
            Don't have an account?
            <router-link to="/register" class="register-link">Register here</router-link>
        </p>

        <div class = "field-container">
            <input type="email" placeholder="Email" v-model="email" />
        </div>

        <div class = "field-container">
            <input type="password" placeholder="Password" v-model="password" />
        </div>
        
        <p id="errorMsg" v-if="errorMessage">{{ errorMessage }}</p>
        <button @click="signIn">Log In</button>
        <button @click="signInWithGoogle" class="google-btn">
            <img src="@/assets/GoogleLogo.png" alt="Google" class="google-icon">
            Register With Google
        </button>
    </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseApp from '@/firebase'; 

export default {
    name: 'Login',

    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
            auth: getAuth(firebaseApp),
        };
    },

    methods: {
        async signIn() {
            try {
                await signInWithEmailAndPassword(this.auth, this.email, this.password);
                console.log("Successfully signed in!");
                this.$router.push('/');
            } catch (error) {
                console.error(error.code);
                this.errorMessage = "Incorrect email or password";
            }
        },

        async signInWithGoogle() {
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(this.auth, provider);
                console.log("Successfully signed in with Google!");
                this.$router.push('/');
            } catch (error) {
                console.error(error.code);
                this.errorMessage = "Failed to register with Google.";
            }
        },

        goToRegister() {
            this.$router.push('/register');
        }
    }
};
</script>

<style scoped>
.register-prompt {
    text-align: center;
    margin-top: 5px;
    margin-bottom: 20px;
}

.register-link {
    color: #007BFF;
    font-weight: 550; 
}

.register-link:hover {
    text-decoration: underline; 
}
#loginContainer {
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
    width: 30%;
}

.field-container input[type="email"],
.field-container input[type="password"] {
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
  margin-bottom: 7%;
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
</style>
  