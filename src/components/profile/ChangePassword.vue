<template>
    <div id = "passwordContainer">
        <h3><strong>Change Password</strong></h3>
        <div id="passwordFields">
          <input type="password" placeholder="Current Password" v-model="currPassword" />
          <input type="password" placeholder="New Password" v-model="newPassword" @blur = "validatePassword" />
          <input type="password" placeholder="Confirm Password" v-model="cfmPassword" @blur = "validatePassword"/>
        </div>
        <p id="errorMsg" v-if="errorMessage">{{ errorMessage }}</p>
        <p><button @click="changePassword">Change Password</button></p>    
        <p id="resultMsg" v-if="resultMessage">{{ resultMessage }}</p>         
    </div>
</template>
<script>
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

export default {
    name: 'ChangePassword',

    data() {
        return {
            currPassword: '',
            newPassword: '',
            cfmPassword: '',
            errorMessage: '',
            resultMessage: ''
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            this.user = user;
            this.email = user.email;
        }
        })
    },

    methods: {
        validatePassword() {
            const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@\^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@\^_`{|}~]{8,}$/;           
            if (!re.test(this.newPassword)) {
                this.errorMessage = "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.";
                alert(this.errorMessage);
                return false;
            } 
            else if (this.newPassword !== this.cfmPassword) {
                this.errorMessage = 'Passwords do not match.';
                return false;
            } else if (this.newPassword == this.currPassword) {
                this.errorMessage = 'Passwords are the same.'
                return false;
            } else {
                this.errorMessage = '';
                return true;                
            }
        },

        async changePassword() {
            if (!this.validatePassword()) {
                return;
            }

            try {
                const credential = EmailAuthProvider.credential(this.email, this.currPassword);
                console.log("credential", credential);
                await reauthenticateWithCredential(this.user, credential); 
                console.log("authenticated")
                console.log("updating new password to", this.newPassword);
                await updatePassword(this.user, this.newPassword); 
                this.resultMessage = 'Password successfully updated!';
                this.errorMessage = '';
            } catch (error) {
                if (error.code === 'auth/wrong-password') {
                    this.errorMessage = 'Current password is incorrect.';
                } else {
                    this.errorMessage = 'Error updating password: ' + error.message;
                }
                console.log(error);
            }
        }
    }
}

</script>

<style scoped>
#passwordFields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  flex-grow: 1;
  padding: 8px; 
  border: 1px solid #ccc; 
  border-radius: 4px;
}

button {
  width: 200px;
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

#errorMsg{
  color: red;
}

</style>