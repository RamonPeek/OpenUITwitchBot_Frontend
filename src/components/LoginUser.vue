<template>
  <div class="login_user">

    <v-stepper class="login_user">

      <v-stepper-items>
        <div class="login_container">
          <div class="login_icon_container">
            <v-icon class="login_icon">mdi-lock</v-icon>
          </div>
          <p class="login_text_header">Login</p>
          <v-form ref="loginForm" v-model="validLogin" lazy-validation class="create_credentials_container">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" clearable prepend-icon="mdi-email" required autocomplete="email"></v-text-field>
            <v-text-field :type="'password'" :rules="passwordRules" v-model="password" label="Password" clearable prepend-icon="mdi-lock" required autocomplete="password"></v-text-field>
          </v-form>
          <div class="action_buttons">
            <v-btn v-if="validLogin && email && password" color="primary" v-on:click="loginUser">
              Login
            </v-btn>
            <v-btn v-if="!validLogin || !email || !password" color="primary" v-on:click="loginUser" disabled>
              Login
            </v-btn>
          </div>
        </div>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<style scoped>
  .login_user {
    width: 100%;
    height: 489px;
  }

  .login_container {
    width: 500px;
    margin-top: 50px;
    margin-left: calc(50% - 250px);
  }

  .login_icon_container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .login_text_header {
    font-size: 25pt;
    text-align: center;
  }

  .login_icon {
    font-size: 90pt;
  }

  .action_buttons {
    display: flex;
    justify-content: center;
  }

  @media only screen and (max-width: 700px) {
    .login_container {
      width: 90%;
      margin-left: 5%;
    }
  }
</style>

<script>

  import AuthService from '../services/AuthService';
  import UserService from '../services/UserService'

  let authService = new AuthService();
  let userService = new UserService();

  export default {
    name: 'LoginUser',

    data () {
      return {
        email: "",
        emailRules: [
          v => !!v || 'E-mail is required.',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
        ],
        password: "",
        passwordRules: [
          v => !!v || 'Password is required.'
        ],
        validLogin: false
      }
    },
    methods: {
      loginUser() {
        authService.authenticate({
          email: this.email,
          password: this.password
        }).then(response => {
          sessionStorage.setItem("appAuthToken", response.data.token);
          authService.validate().then(userIdResponse => {
            userService.getUserById(userIdResponse.data).then(userResponse => {
              sessionStorage.setItem("twitchAuthToken", userResponse.data.twitchAccount.oAuthToken);
              this.$store.dispatch("setLoggedIn", true);
              this.$store.dispatch("setCurrentUser", userResponse.data);
              this.$router.push({name: "Dashboard"});
            });
          });
        });
      }
    },
    mounted() {

    },
  }
</script>
