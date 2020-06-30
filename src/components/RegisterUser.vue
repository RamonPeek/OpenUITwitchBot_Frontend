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
          <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
          ></v-card>

          <v-btn
                  color="primary"
                  @click="registrationStep = 2"
          >
            Continue
          </v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
          ></v-card>

          <v-btn
                  color="primary"
                  @click="registrationStep = 3"
          >
            Continue
          </v-btn>

          <v-btn text @click="registrationStep = 1">Previous</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
          ></v-card>

          <v-btn
                  color="primary"
                  @click="registerUser"
          >
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
      }
    },
    methods: {
      registerUser() {
        console.log("registered");
        this.$router.push({name: "Dashboard"});
      }
    }
  }
</script>
