<template>
  <div class="register_user">
    <v-stepper v-model="currentStep" alt-labels>
      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1"><p class="stepper_item_text">Create credentials</p></v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="currentStep > 2" step="2"><p class="stepper_item_text">Link your Twitch account</p></v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3"><p class="stepper_item_text">Complete registration</p></v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <!-- CREATE CREDENTIALS CONTENT -->
          <div class="create_credentials_container">
            <div class="create_credentials_info">
              <v-card color="#ddd"  class="create_credentials_info_card">
                First, we will create credentials with which you will be able to log into the app and start using our services. All data is encrypted and will be stored safely. It is possible to delete your account at all times.
              </v-card>
            </div>
            <div class="create_credentials">
              <v-form ref="credentialsForm" v-model="validCredentials" lazy-validation>
                <v-text-field v-model="email" :rules="emailRules" label="E-mail" clearable prepend-icon="mdi-email" required autocomplete="email"></v-text-field>
                <v-text-field :type="'password'" v-model="password" :rules="passwordRules" label="Password" clearable prepend-icon="mdi-lock" required autocomplete="password"></v-text-field>
                <v-text-field :type="'password'" v-model="passwordCheck" :rules="passwordCheckRules" label="Password again" clearable prepend-icon="mdi-lock" required autocomplete="passwordCheck"></v-text-field>
              </v-form>
              <v-btn color="primary" v-on:click="moveToTwitchLink">
                Continue
              </v-btn>
            </div>
          </div>
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
          <v-btn color="primary" v-on:click="setStepper(3)">
            Continue
          </v-btn>
          <v-btn text v-on:click="setStepper(1)">Previous</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <!-- COMPLETE REGISTRATION -->
          <v-btn color="primary" @click="registerUser">
            Register
          </v-btn>
          <v-btn text v-on:click="setStepper(2)">Previous</v-btn>
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

  .stepper_item_text {
    text-align: center;
    margin-bottom: 0px !important;
  }

  .create_credentials_container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: start;
    flex-direction: row;
  }

  .create_credentials_info {
    width: 275px;
    height: 100%;
    margin-top: 20px;
  }

  .create_credentials {
    width: calc(100% - 295px);
    height: 100%;
    margin-left: 20px;
  }

  .create_credentials_info_card {
    padding: 10px;
  }

  @media only screen and (max-width: 600px) {
    .create_credentials_container {
      display: unset;
    }

    .create_credentials_info {
      width: 100%;
      height: unset;
      margin-top: unset;
      margin-bottom: 20px;
    }

    .create_credentials {
      width: 100%;
      height: unset;
      margin-left: unset;
    }
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
      setStepper(stepper) {
        this.currentStep = stepper;
        this.$router.push("/register/" + stepper);
      },
      registerUser() {
        this.$router.push({name: "Login"});
      },
      moveToTwitchLink() {
        if(this.$refs.credentialsForm.validate()) {
          this.currentStep = 2;
          sessionStorage.setItem("registerCredentialsMemory", JSON.stringify({
            email: this.email,
            password: this.password,
            passwordCheck: this.passwordCheck
          }));
          this.$router.push("/register/2")
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
