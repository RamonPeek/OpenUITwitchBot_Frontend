import OverlayHeader from '../../components/streamoverlay/OverlayHeader';
import OverlayContent from '../../components/streamoverlay/OverlayContent';
import OverlayFooter from '../../components/streamoverlay/OverlayFooter';
import draggable from "vuedraggable";
import {VIcon} from 'vuetify/lib'
import TwitchWebhookService from "../../services/TwitchWebhookService";
import * as SignalR from '@aspnet/signalr';
import {HubConnectionState} from "@aspnet/signalr";
import TwitchService from "../../services/TwitchService";

let twitchWebhookService = new TwitchWebhookService();
let twitchService = new TwitchService();

export default {
  name: 'streamoverlay',
  components: {
    OverlayHeader,
    OverlayContent,
    OverlayFooter,
    draggable,
    VIcon
  },
  props: [],
  data () {
    return {
      selectedIndex: null,
      userConnection: new SignalR.HubConnectionBuilder().withUrl(process.env.VUE_APP_ROOT_API + "/hub/user", {
        accessTokenFactory: () => sessionStorage.getItem("appAuthToken")
      }).configureLogging(SignalR.LogLevel.Debug).build(),
      subscriptionConnection: new SignalR.HubConnectionBuilder().withUrl(process.env.VUE_APP_ROOT_API + "/hub/subscription", {
        accessTokenFactory: () => sessionStorage.getItem("appAuthToken")
      }).configureLogging(SignalR.LogLevel.Debug).build(),
      streamConnection: new SignalR.HubConnectionBuilder().withUrl(process.env.VUE_APP_ROOT_API + "/hub/stream", {
        accessTokenFactory: () => sessionStorage.getItem("appAuthToken")
      }).configureLogging(SignalR.LogLevel.Debug).build()
    }
  },
  computed: {
    headerItems: {
      get() {
        return this.$store.state.overlayHeaderItems;
      },
      set(val) {
        this.$store.commit("updateOverlayHeaderItems", val);
      }
    },
    footerItems: {
      get() {
        return this.$store.state.overlayFooterItems;
      },
      set(val) {
        this.$store.commit("updateOverlayFooterItems", val);
      }
    }
  },
  mounted () {
    let context = this;
    //SUBSCRIBE TO USER UPDATES
    twitchWebhookService.subscribe("/webhooks/incoming/twitch/user", "https://api.twitch.tv/helix/users/follows?first=1&to_id=" + this.$store.getters.currentUser.twitchAccount.id).then(() => {
      //TODO CHECK IF VALID
      if(this.userConnection.state === HubConnectionState.Disconnected) {
        this.userConnection.start().then(() => {
          console.log("Successfully connected to /hub/user");
        }).catch(error => {
          console.error(error.toString());
        });
      }
      this.userConnection.on("SendUserUpdate", function(item) {
        console.log(item);
        context.$store.dispatch("updateValueForIdentifier", {
          identifier: "LATEST_FOLLOWER",
          value: item.from_name
        });
      });
    });
    //SUBSCRIBE TO SUBSCRIPTION UPDATES
    twitchWebhookService.subscribe("/webhooks/incoming/twitch/subscription", "https://api.twitch.tv/helix/subscriptions/events?broadcaster_id=" + this.$store.getters.currentUser.twitchAccount.id + "&first=1").then(() => {
      //TODO CHECK IF VALID
      if(this.subscriptionConnection.state === HubConnectionState.Disconnected) {
        this.subscriptionConnection.start().then(() => {
          console.log("Successfully connected to /hub/subscription");
        }).catch(error => {
          console.error(error.toString());
        });
      }
      this.subscriptionConnection.on("SendSubscriptionUpdate", function(item) {
        console.log(item);
        if(item.event_type === "subscriptions.subscribe") {
          context.$store.dispatch("updateValueForIdentifier", {
            identifier: "LATEST_SUBSCRIBER",
            value: item.event_data.gifter_name
          });
        }
      });
    });
    //SUBSCRIBE TO STREAM UPDATES
    twitchWebhookService.subscribe("/webhooks/incoming/twitch/stream", "https://api.twitch.tv/helix/streams?user_id=" + this.$store.getters.currentUser.twitchAccount.id).then(() => {
      //TODO CHECK IF VALID
      if(this.streamConnection.state === HubConnectionState.Disconnected) {
        this.streamConnection.start().then(() => {
          console.log("Successfully connected to /hub/stream");
        }).catch(error => {
          console.error(error.toString());
        });
      }
      this.streamConnection.on("SendStreamUpdate", function(item) {
        twitchService.getGameById(item.game_id).then(gameResponse => {
          context.$store.dispatch("updateValueForIdentifier", {
            identifier: "CURRENT_GAME",
            value: gameResponse.data.data[0].name
          });
        })
      });
    });
  },
  beforeDestroy() {
    twitchWebhookService.unsubscribe("/webhooks/incoming/twitch/user", "https://api.twitch.tv/helix/users/follows?first=1&to_id=" + this.$store.getters.currentUser.twitchAccount.id).then(() => {
      //TODO CHECK IF VALID
      if(this.streamConnection.state === HubConnectionState.Connected) {
        this.userConnection.stop().then(() => {
          console.log("Successfully disconnected from /hub/user");
        }).catch(error => {
          console.error(error.toString());
        });
      }
    });
    twitchWebhookService.unsubscribe("/webhooks/incoming/twitch/subscription", "https://api.twitch.tv/helix/subscriptions/events?broadcaster_id=" + this.$store.getters.currentUser.twitchAccount.id + "&first=1").then(() => {
      //TODO CHECK IF VALID
      if(this.subscriptionConnection.state === HubConnectionState.Connected) {
        this.subscriptionConnection.stop().then(() => {
          console.log("Successfully disconnected from /hub/subscription");
        }).catch(error => {
          console.error(error.toString());
        });
      }
    });
    twitchWebhookService.unsubscribe("/webhooks/incoming/twitch/stream", "https://api.twitch.tv/helix/streams?user_id=" + this.$store.getters.currentUser.twitchAccount.id).then(() => {
      //TODO CHECK IF VALID
      if(this.streamConnection.state === HubConnectionState.Connected) {
        this.streamConnection.stop().then(() => {
          console.log("Successfully disconnected from /hub/stream");
        }).catch(error => {
          console.error(error.toString());
        });
      }
    });
  },
  methods: {
    moveHeaderHandler(evt) {
      if(this.selectedIndex) {
        return false;
      }
      if(evt.from !== evt.to) {
        let sourceIndex = evt.draggedContext.index;
        let targetIndex = evt.draggedContext.futureIndex;
        this.selectedIndex = targetIndex;
        let targetElement = this.footerItems[targetIndex];
        if(sourceIndex > 4) {
          sourceIndex = 4;
        }
        if(targetIndex > 4) {
          targetIndex = 4;
        }
        if(targetElement === undefined) {
          targetElement = {}
        }
        this.headerItems.splice(sourceIndex + 1, 0, targetElement);
        this.footerItems.splice(targetIndex, 1);
      }
    },
    moveFooterHandler(evt) {
      if(this.selectedIndex) {
        return false;
      }
      if(evt.from !== evt.to) {
        let sourceIndex = evt.draggedContext.index;
        let targetIndex = evt.draggedContext.futureIndex;
        this.selectedIndex = targetIndex;
        let targetElement = this.headerItems[targetIndex];
        if(sourceIndex > 4) {
          sourceIndex = 4;
        }
        if(targetIndex > 4) {
          targetIndex = 4;
        }
        if(targetElement === undefined) {
          targetElement = {}
        }
        this.footerItems.splice(sourceIndex + 1, 0, targetElement);
        this.headerItems.splice(targetIndex, 1);
      }
    },
    enableMovement() {
      this.selectedIndex = null
    }
  }
}


