
export default {
  name: 'requestaccesstoken',
  components: {

  },
  props: [],
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
    let accessToken = this.$router.currentRoute.hash.split("&")[0].substr(14, this.$router.currentRoute.hash.length);
    if(accessToken) {
      sessionStorage.setItem("twitchAuthToken", accessToken);
    }else{
      sessionStorage.removeItem("twitchAuthToken");
    }
    history.replaceState({}, null, "/requestaccesstoken");
    if(sessionStorage.getItem("returnComponent")) {
      this.$router.push(sessionStorage.getItem("returnComponent"));
    }else{
      this.$router.push({name: "Dashboard"});
    }
  },
  methods: {

  }
}


