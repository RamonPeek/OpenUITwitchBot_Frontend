
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
    this.$router.push({name: "Login"});
  },
  methods: {

  }
}


