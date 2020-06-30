<template>
  <div class="register_user">
    <!--
    <p>Register user</p>
    <v-btn color="primary" v-on:click="registerUser">Register</v-btn>
    -->
    <v-stepper v-model="currentStep">
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1">Create credentials</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="currentStep > 2" step="2">Link your Twitch account</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Complete registration</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <!-- CREATE CREDENTIALS CONTENT -->
          <v-form ref="credentialsForm" v-model="validCredentials" lazy-validation>
            <!-- MEMORY -->
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" clearable prepend-icon="mdi-email" required autocomplete="email"></v-text-field>
              <v-text-field :type="'password'" v-model="password" :rules="passwordRules" label="Password" clearable prepend-icon="mdi-lock" required autocomplete="password"></v-text-field>
              <v-text-field :type="'password'" v-model="passwordCheck" :rules="passwordCheckRules" label="Password again" clearable prepend-icon="mdi-lock" required autocomplete="passwordCheck"></v-text-field>
            <!-- NO MEMORY -->

          </v-form>
          <v-btn color="primary" v-on:click="moveToTwitchLink">
            Continue
          </v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <!-- LINK TWITCH ACCOUNT-->
          <div v-if="twitchAuthenticatedAccount">
            <b><p>Successfully linked to:</p></b>
            <img :src="twitchAuthenticatedAccount.profile_image_url">
            <h1>{{twitchAuthenticatedAccount.login}}</h1>
          </div>
          <v-btn v-if="!twitchAuthenticatedAccount" color="secondary" v-on:click="handleTwitchAuthentication">Link with Twitch</v-btn>
          <br>
          <v-btn color="primary" @click="currentStep = 3">
            Continue
          </v-btn>
          <v-btn text @click="currentStep = 1">Previous</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <!-- COMPLETE REGISTRATION -->
          <v-btn color="primary" @click="registerUser">
            Register
          </v-btn>
          <v-btn text @click="currentStep = 2">Previous</v-btn>
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
  import TwitchService from "../services/TwitchService";

  let twitchService = new TwitchService();

  export default {
    name: 'RegisterUser',

    data () {
      return {
        currentStep: this.step,
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
        ],
        twitchAuthenticatedAccount: null,
        registerMemory: null
      }
    },
    methods: {
      registerUser() {
        this.$router.push({name: "Dashboard"});
      },
      moveToTwitchLink() {
        if(this.$refs.credentialsForm.validate()) {
          this.currentStep = 2;
          sessionStorage.setItem("registerCredentialsMemory", JSON.stringify({
            email: this.email,
            password: this.password,
            passwordCheck: this.passwordCheck
          }));
        }
      },
      handleTwitchAuthentication() {
        let clientId = process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID;
        let returnUrl = process.env.VUE_APP_ROOT_API;
        let scope = "user:read:email";
        window.location = "https://id.twitch.tv/oauth2/authorize?client_id=" + clientId + "&redirect_uri=" + returnUrl + "&response_type=token&scope=" + scope;
      }
    },
    created() {
      this.registerMemory = JSON.parse(sessionStorage.getItem("registerCredentialsMemory"));
      if(this.registerMemory) {
        this.email = this.registerMemory.email;
        this.password = this.registerMemory.password;
        this.passwordCheck = this.registerMemory.passwordCheck;
      }
    },
    mounted() {
      if(localStorage.getItem("twitchAuth")) {
        twitchService.getUserByBearer(localStorage.getItem("twitchAuth")).then(response => {
          this.twitchAuthenticatedAccount = response.data.data[0];
        });
      }else{
        let accessToken = this.$router.currentRoute.hash.split("&")[0].substr(14, this.$router.currentRoute.hash.length);
        if(accessToken) {
          twitchService.getUserByBearer(accessToken).then(response => {
            this.twitchAuthenticatedAccount = response.data.data[0];
          });
        }
      }
    },
    props: {
      step: String
    }
  }
</script>
