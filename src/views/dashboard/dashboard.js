//import ChatOverview from '../../components/ChatOverview'
//import CreateCommand from '../../components/CreateCommand';
import ChatOverview from '../../components/ChatOverview';
import TwitchService from "../../services/TwitchService";
import {VBtn} from 'vuetify/lib'


let twitchService = new TwitchService();

export default {
  name: 'dashboard',
  components: {
    //ChatOverview,
    //CreateCommand
    ChatOverview,
    VBtn
  },
  props: [],
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    getWebhooks() {
      twitchService.getWebhookAdresses().then(response => {
        console.warn(response.data);
      })
    }
  }
}


