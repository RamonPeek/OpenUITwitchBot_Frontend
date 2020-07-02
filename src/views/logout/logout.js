import Vue from "vue";

export default {
  name: 'logout',
  components: {

  },
  props: [],
  data () {
    return {

    }
  },
  mounted () {
    sessionStorage.removeItem("appAuthToken");
    sessionStorage.removeItem("twitchAuthToken");
    this.$store.dispatch("setLoggedIn", false);
    this.$store.dispatch("setCurrentUser", null);
    Vue.$toast.open({
      message: 'Successfully logged out.',
      type: 'success',
      duration: 2500,
    });
    this.$router.push({name: "Login"});
  },
  methods: {

  }
}


