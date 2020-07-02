import RegisterUser from '../../components/RegisterUser';

export default {
  name: 'register',
  components: {
    RegisterUser
  },
  props: [],
  data () {
    return {
      step: this.$route.params.step
    }
  },
  computed: {

  },
  mounted () {
    if (this.step <= 0 || this.step > 3 || isNaN(this.step)) {
      this.step = "1";
    }
    let accessToken = this.$router.currentRoute.hash.split("&")[0].substr(14, this.$router.currentRoute.hash.length);

    if (this.step === "2") {
      if (accessToken) {
        this.saveTwitchTokenAndScope();
      }else {
        //TODO DISPLAY ERROR ON FRONTEND
      }
    }
  },
  methods: {
    saveTwitchTokenAndScope() {
      let accessToken = this.$router.currentRoute.hash.split("&")[0].substr(14, this.$router.currentRoute.hash.length);
      history.replaceState({}, null, "/register/2");



      if(accessToken) {
        localStorage.twitchAuth = accessToken;
      }else{
        localStorage.removeItem("twitchAuth");
        this.$router.push({name: "Register"});
      }

    }
  }
}


