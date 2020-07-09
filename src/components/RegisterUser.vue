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
          <div class="stepper_content_container">
            <div class="finalize_registration_container">
              <v-card class="finalize_registration_info">
                First, we will create credentials with which you will be able to log into the app and start using our services. All data is encrypted and will be stored safely. It is possible to delete your account at all times.
              </v-card>
            </div>
            <v-form ref="credentialsForm" v-model="validCredentials" lazy-validation class="create_credentials_container">
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" clearable prepend-icon="mdi-email" required autocomplete="email"></v-text-field>
              <v-text-field :type="'password'" v-model="password" :rules="passwordRules" label="Password" clearable prepend-icon="mdi-lock" required autocomplete="password"></v-text-field>
              <v-text-field :type="'password'" v-model="passwordCheck" :rules="passwordCheckRules" label="Password again" clearable prepend-icon="mdi-lock" required autocomplete="passwordCheck"></v-text-field>
            </v-form>
          </div>
          <div class="actions_container">
            <v-btn color="primary" v-on:click="setStepper(2)" v-if="!validCredentials || !email || !password || !passwordCheck" disabled>
              Continue
            </v-btn>
            <v-btn color="primary" v-on:click="setStepper(2)" v-if="validCredentials && email && password && passwordCheck">
              Continue
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="2">
          <!-- LINK TWITCH ACCOUNT-->
          <div class="stepper_content_container">
            <div class="finalize_registration_container">
              <v-card class="finalize_registration_info">
                Next, we will connect your Twitch.tv account to your account. The link between Twitch and your account is necessary for retrieving data about your channel. When you delete your account this connection will also be invoked.
              </v-card>
            </div>
            <div class="actions_container">
              <v-btn v-if="!twitchAuthenticatedAccount" color="secondary" v-on:click="handleTwitchAuthentication">Link with Twitch</v-btn>
            </div>
            <div v-if="twitchAuthenticatedAccount">
              <p class="link_twitch_successfully_linked_header">Successfully linked to:</p>
              <div class="actions_container">
                <img :src="twitchAuthenticatedAccount.profile_image_url" class="link_twitch_result_photo">
              </div>
              <p class="link_twitch_result_name">{{twitchAuthenticatedAccount.login}}</p>
            </div>
          </div>
          <div class="actions_container">
            <v-btn text v-on:click="setStepper(1)">Previous</v-btn>
            <v-btn color="primary" v-on:click="setStepper(3)" v-if="!twitchAuthenticatedAccount || !validCredentials" disabled>
              Continue
            </v-btn>
            <v-btn color="primary" v-on:click="setStepper(3)" v-if="twitchAuthenticatedAccount && validCredentials">
              Continue
            </v-btn>
          </div>
        </v-stepper-content>
        <v-stepper-content step="3">
          <!-- COMPLETE REGISTRATION -->
          <div class="stepper_content_container">
            <div class="finalize_registration_container">
              <v-card class="finalize_registration_info">
                All set! Press the register-button in order to complete the registration, or check your details by pressing the previous-button. After registering you will be redirected to the login-screen and you can start using the app!
              </v-card>
            </div>
            <div class="actions_container">
              <div class="finalize_gif_container"></div>
            </div>
          </div>
          <div class="actions_container">
            <v-btn text v-on:click="setStepper(2)">Previous</v-btn>
            <v-btn color="green" v-on:click="registerUser">
              Register
            </v-btn>
          </div>
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

  .stepper_content_container {
    height: 330px;
  }

  .actions_container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .link_twitch_result_photo {
    width: 106px;
    height: 106px;
  }

  .link_twitch_successfully_linked_header {
    font-weight: bold;
    text-align: center;
  }

  .link_twitch_result_name {
    padding-top: 10px;
    text-align: center;
  }

  /* FINALIZE REGISTRATION */
  .finalize_registration_container {
    height: 90px;
    margin-bottom: 25px;
  }

  .finalize_registration_info {
    height: 100%;
    width: 700px;
    float: left;
    padding: 10px;
    margin-left: calc(50% - 350px);
  }

  .create_credentials_container {
    width: 700px;
    margin-left: calc(50% - 350px);
  }

  .finalize_gif_container {
    background-image: url("https://media0.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif?cid=ecf05e472e7d7e7ec6635dc0ad232df6d1efa9c7601f2e61&rid=giphy.gif");
    width: 250px;
    height: 140px;
    background-repeat: no-repeat;
    background-size: contain;
  }

  @media only screen and (max-width: 880px) {

    .link_twitch_result_photo {
      margin-left: calc(50% - 53px);
    }

    .finalize_registration_info {
      width: 100%;
      margin-left: unset;
    }

    .finalize_registration_container {
      height: 115px;
    }

    .create_credentials_container {
      width: 100%;
      margin-left: unset;
    }
  }

</style>

<script>
  import TwitchService from "../services/TwitchService";
  import UserService from "../services/UserService";

  let twitchService = new TwitchService();
  let userService = new UserService();

  export default {
    name: 'RegisterUser',

    data () {
      return {
        currentStep: this.step,
        validCredentials: false,
        email: "",
        emailRules: [
          v => !!v || 'E-mail is required.',
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
        twitchOAuth: null,
        registerMemory: null
      }
    },
    watch: {
      email: function(val) {
        if (val) {
          localStorage.setItem("registerCredentialsMemory", JSON.stringify({
            email: this.email,
            password: this.password,
            passwordCheck: this.passwordCheck
          }));
        }
      },
      password: function(val) {
        if (val) {
          localStorage.setItem("registerCredentialsMemory", JSON.stringify({
            email: this.email,
            password: this.password,
            passwordCheck: this.passwordCheck
          }));
        }
      },
      passwordCheck: function(val) {
        if (val) {
          localStorage.setItem("registerCredentialsMemory", JSON.stringify({
            email: this.email,
            password: this.password,
            passwordCheck: this.passwordCheck
          }));
        }
      }
    },
    methods: {
      setStepper(stepper) {
        this.currentStep = stepper;
        this.$router.push("/register/" + stepper);
      },
      registerUser() {
        userService.createUser({
          user: {
            id: null,
            twitchAccount: {
              id: this.twitchAuthenticatedAccount.id,
              oAuthToken: this.twitchOAuth,
              displayName: this.twitchAuthenticatedAccount.display_name,
              description: this.twitchAuthenticatedAccount.description,
              profileImageUrl: this.twitchAuthenticatedAccount.profile_image_url,
              viewCount: this.twitchAuthenticatedAccount.view_count
            }
          },
          credentials: {
            email: this.email,
            password: this.password
          }
        }).then(() => {
          this.$toast.open({
            message: 'Successfully created your account.',
            type: 'success',
            duration: 2500,
          });
          this.$router.push({name: "Login"});
        });
      },
      handleTwitchAuthentication() {
        let clientId = process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID;
        let returnUrl = process.env.VUE_APP_ROOT + "/register/2";
        let scope = "user:read:email+channel:read:subscriptions+chat:read+chat:edit";
        window.location = "https://id.twitch.tv/oauth2/authorize?client_id=" + clientId + "&response_type=token&scope=" + scope + "&redirect_uri=" + returnUrl;
      }
    },
    created() {
      this.registerMemory = JSON.parse(localStorage.getItem("registerCredentialsMemory"));
      if(this.registerMemory) {
        this.email = this.registerMemory.email;
        this.password = this.registerMemory.password;
        this.passwordCheck = this.registerMemory.passwordCheck;
      }
    },
    mounted() {
      if(localStorage.getItem("twitchAuth")) {
        this.twitchOAuth = localStorage.getItem("twitchAuth");
        twitchService.getUserByBearer(localStorage.getItem("twitchAuth")).then(response => {
          this.twitchAuthenticatedAccount = response.data.data[0];
          if(this.currentStep === "1") {
            //FIRST PAGE MAY ALWAYS BE ACCESSED
          }else if(this.currentStep === "2") {
            //SECOND PAGE MAY ONLY BE ACCESSED IF FIRST ONE IS VALID
            if(!this.$refs.credentialsForm.validate()) {
              this.$router.push({name: "Register", params: { step: "1" }});
            }
          }else if(this.currentStep === "3") {
            //LAST PAGE MAY ONLY BE ACCESSED IF FIRST AND SECOND ONES ARE VALID
            if(!this.$refs.credentialsForm.validate()) {
              this.$router.push({name: "Register", params: { step: "1" }});
            }else{
              if(!this.twitchAuthenticatedAccount || !this.twitchOAuth) {
                this.$router.push({name: "Register", params: { step: "2" }});
              }
            }
          }
        });
      }else{
        let accessToken = this.$router.currentRoute.hash.split("&")[0].substr(14, this.$router.currentRoute.hash.length);
        if(accessToken) {
          this.twitchOAuth = accessToken;
          twitchService.getUserByBearer(accessToken).then(response => {
            this.twitchAuthenticatedAccount = response.data.data[0];
            if(this.currentStep === "1") {
              //FIRST PAGE MAY ALWAYS BE ACCESSED
            }else if(this.currentStep === "2") {
              //SECOND PAGE MAY ONLY BE ACCESSED IF FIRST ONE IS VALID
              if(!this.$refs.credentialsForm.validate()) {
                this.$router.push({name: "Register", params: { step: "1" }});

              }
            }else if(this.currentStep === "3") {
              //LAST PAGE MAY ONLY BE ACCESSED IF FIRST AND SECOND ONES ARE VALID
              if(!this.$refs.credentialsForm.validate()) {
                this.$router.push({name: "Register", params: { step: "1" }});

              }else{
                if(!this.twitchAuthenticatedAccount || !this.twitchOAuth) {
                  this.$router.push({name: "Register", params: { step: "2" }});
                }
              }
            }
          });
        }else{
          if(this.currentStep === "1") {
            //FIRST PAGE MAY ALWAYS BE ACCESSED
          }else if(this.currentStep === "2") {
            //SECOND PAGE MAY ONLY BE ACCESSED IF FIRST ONE IS VALID
            if(!this.$refs.credentialsForm.validate()) {
              this.$router.push({name: "Register", params: { step: "1" }});

            }
          }else if(this.currentStep === "3") {
            //LAST PAGE MAY ONLY BE ACCESSED IF FIRST AND SECOND ONES ARE VALID
            if(!this.$refs.credentialsForm.validate()) {
              this.$router.push({name: "Register", params: { step: "1" }});

            }else{
              if(!this.twitchAuthenticatedAccount) {
                this.$router.push({name: "Register", params: { step: "2" }});
              }
            }
          }
        }
      }
    },
    props: {
      step: String
    }
  }
</script>
