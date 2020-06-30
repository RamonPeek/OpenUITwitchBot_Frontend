<template>
  <div class="register_user">
    <!--
    <p>Register user</p>
    <v-btn color="primary" v-on:click="registerUser">Register</v-btn>
    -->
    <v-stepper v-model="registrationStep">
      <v-stepper-header>
        <v-stepper-step :complete="registrationStep > 1" step="1">Create credentials</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="registrationStep > 2" step="2">Link your Twitch account</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Complete registration</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <!-- CREATE CREDENTIALS CONTENT -->
          <v-form ref="credentialsForm" v-model="validCredentials" lazy-validation>
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" clearable prepend-icon="mdi-email" required></v-text-field>
            <v-text-field :type="'password'" v-model="password" :rules="passwordRules" label="Password" clearable prepend-icon="mdi-lock" required></v-text-field>
            <v-text-field :type="'password'" v-model="passwordCheck" :rules="passwordCheckRules" label="Password again" clearable prepend-icon="mdi-lock" required></v-text-field>
          </v-form>
          <v-btn color="primary" v-on:click="moveToTwitchLink">
            Continue
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <!-- LINK TWITCH ACCOUNT-->
          <v-btn color="primary" @click="registrationStep = 3">
            Continue
          </v-btn>
          <v-btn text @click="registrationStep = 1">Previous</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <!-- COMPLETE REGISTRATION -->
          <v-btn color="primary" @click="registerUser">
            Register
          </v-btn>
          <v-btn text @click="registrationStep = 2">Previous</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<style scoped>
  .register_user {
    width: 100%;
    height: 100%;
  }
</style>

<script>
  export default {
    name: 'RegisterUser',

    data () {
      return {
        registrationStep: 1,
        validCredentials: true,
        email: "",
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
        ],
        password: "",
        passwordRules: [
          v => !!v || 'Password is required',
          v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) || 'Min. 8 characters with at least one capital letter, a number and a special character.',
        ],
        passwordCheck: "",
        passwordCheckRules: [
          v => !!v || 'You have to enter the chosen password again.',
          v => v === this.password || 'The passwords must match.'
        ]
      }
    },
    methods: {
      registerUser() {
        console.log("registered");
        this.$router.push({name: "Dashboard"});
      },
      moveToTwitchLink() {
        if(this.$refs.credentialsForm.validate()) {
          this.registrationStep = 2;
        }
      },
      handleTwitchAuthentication() {
        window.location.href("https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=[YOUR_PUBLIC_CLIENT_ID]&redirect_uri=[RETURN_URL]&scope=[SCOPES_REQUIRES]");
      }
    }
  }
</script>
