<template>
  <div class="login_user">
    Login
  </div>
</template>

<style scoped>
  .login_user {
    width: 100%;
    height: 100%;
  }
</style>

<script>

  export default {
    name: 'LoginUser',

    data () {
      return {
        email: "",
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
        ],
        password: "",
      }
    },
    methods: {
      loginUser() {
        console.warn("Logged in");
      }
    },
    mounted() {

    },
  }
</script>
