
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
    this.$router.push({name: "Login"});
  },
  methods: {

  }
}


