import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Vuex from 'vuex'
import AuthService from './services/AuthService';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import BotService from "./services/BotService";
import CommandService from "./services/CommandService";
import TwitchService from "./services/TwitchService";
import Axios from "axios";

let commandService = new CommandService();
let authService = new AuthService();
let twitchService = new TwitchService();

Vue.config.productionTip = false
const CancelToken = Axios.CancelToken;
const source = CancelToken.source();

/* Global methods and constants */
Vue.use(Vuex)
Vue.use(VueToast);

let whiteListedRoutes = [
  "Login",
  "Register",
  "Logout",
  "RequestAccessToken"
]

/* Define constants */
const store = new Vuex.Store({
  state: {
    loggedIn: false,
    currentUser: null,
    apiHost: null,
    apiPort: null,
    overlayHeaderItems: [
      {
        identifier: "CURRENT_GAME",
        icon: "mdi-gamepad-variant",
        text: "Currently playing",
        value: "-"
      },
      {
      },
      {
        identifier: "LATEST_SUBSCRIBER",
        icon: "mdi-shield-star-outline",
        text: "Latest subscriber",
        value: "-"
      },
      {
      },
      {
        identifier: "LATEST_FOLLOWER",
        icon: "mdi-account",
        text: "Latest follower",
        value: "-"
      }

    ],
    overlayFooterItems: [
      {
        identifier: "YOUTUBE",
        icon: "mdi-youtube",
        text: "YouTube",
        value: "-"
      },
      {
      },
      {
        identifier: "DISCORD",
        icon: "mdi-discord",
        text: "Discord",
        value: "-"
      },
      {
      },
      {
        identifier: "Twitter",
        icon: "mdi-twitter",
        text: "Twitter",
        value: "-"
      }
    ],
    twitchBotClient: null,
    receivedChatCommands: []
  },
  mutations: {
    setLoggedIn(state, loginState) {
      state.loggedIn = loginState;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setApiHost(state, host) {
      state.apiHost = host;
    },
    setApiPort(state, port) {
      state.apiPort = port;
    },
    setOverlayHeaderItemAt(state, itemWithIndex) {
      state.overlayHeaderItems[itemWithIndex.index] = itemWithIndex.item;
    },
    setOverlayFooterItemAt(state, itemWithIndex) {
      state.overlayFooterItems[itemWithIndex.index] = itemWithIndex.item;
    },
    updateOverlayHeaderItems(state, items) {
      state.overlayHeaderItems = items;
    },
    updateOverlayFooterItems(state, items) {
      state.overlayFooterItems = items;
    },
    updateValueForIdentifier(state, identifierValue) {
      let indexToUpdateInHeader = state.overlayHeaderItems.findIndex((element) => element.identifier === identifierValue.identifier);
      if(indexToUpdateInHeader >= 0) {
        state.overlayHeaderItems[indexToUpdateInHeader].value = identifierValue.value.toString();
      }
      let indexToUpdateInFooter = state.overlayFooterItems.findIndex((element) => element.identifier === identifierValue.identifier);
      if(indexToUpdateInFooter >= 0) {
        state.overlayFooterItems[indexToUpdateInFooter].value = identifierValue.value.toString();
      }
    },
    addReceivedChatCommand(state, command) {
      state.receivedChatCommands.push(command);
    },
    initializeTwitchBotClient(state) {
      if(state.twitchBotClient) {
        state.twitchBotClient.disconnect();
      }
      state.twitchBotClient = new BotService(this.getters.currentUser.twitchAccount.displayName, 'oauth:' + sessionStorage.getItem("twitchAuthToken"),
          [this.getters.currentUser.twitchAccount.displayName]).getClient();
      //TODO CHANGE TO GET ALL COMMANDS FROM USER?
      commandService.getAllCommands().then(response => {
        if(response.status === 200) {
          let chatActionCommands = [];
          response.data.forEach(command => {
            //CHAT_REPLY
            if(command.type === 0) {
              chatActionCommands.push(command);
            }
          });
          //TODO MOVE THIS TO SEPERATE BOT ACCOUNT INSTEAD OF LOGGED-IN USER
          this.getters.twitchBotClient.connect();
          this.getters.twitchBotClient.on("chat", function (channel, user, message) {
            chatActionCommands.forEach(command => {
              if(message.startsWith(command.tag)) {
                let message = "[BOT_NAME]: " + command.content;
                state.twitchBotClient.say(state.currentUser.twitchAccount.displayName, message);
                //Add sender for displaying in chatoverview
                command.sender = user.username;
                store.dispatch("addReceivedChatCommand", command);
              }
            })
          });
        }
      });
    }
  },
  actions: {
    setLoggedIn(state, loginState) {
      state.commit("setLoggedIn", loginState);
    },
    setCurrentUser(state, user) {
      state.commit("setCurrentUser", user);
    },
    setApiHost(state, host) {
      state.commit("setApiHost", host);
    },
    setApiPort(state, port) {
      state.commit("setApiPort", port);
    },
    setOverlayHeaderItemAt(state, itemWithIndex) {
      state.commit("setOverlayHeaderItemAt", itemWithIndex);
    },
    setOverlayFooterItemAt(state, itemWithIndex) {
      state.commit("setOverlayFooterItemAt", itemWithIndex);
    },
    updateOverlayHeaderItems(state, items) {
      state.commit("updateOverlayHeaderItems", items);
    },
    updateOverlayFooterItems(state, items) {
      state.commit("updateOverlayFooterItems", items);
    },
    updateValueForIdentifier(state, identifierValue) {
      state.commit("updateValueForIdentifier", identifierValue);
    },
    addReceivedChatCommand(state, command) {
      state.commit("addReceivedChatCommand", command);
    },
    initializeTwitchBotClient(state, client) {
      state.commit("initializeTwitchBotClient", client);
    }
  },
  getters: {
    loggedIn(state) {
      return state.loggedIn;
    },
    currentUser(state) {
      return state.currentUser;
    },
    api(state) {
      return state.apiHost + ":" + state.apiPort;
    },
    overlayHeaderItems(state) {
      return state.overlayHeaderItems;
    },
    overlayFooterItems(state) {
      return state.overlayFooterItems;
    },
    receivedChatCommands(state) {
      return state.receivedChatCommands;
    },
    twitchBotClient(state) {
      return state.twitchBotClient;
    }
  },
})

/* Handle authentication when switching between components */
router.beforeEach((to, from, next) => {
  if(to.name && to.name !== "RequestAccessToken") {
    sessionStorage.setItem("returnComponent", to.path);
  }
  //Component requires authentication
  if (!whiteListedRoutes.includes(to.name)) {
    //App auth token is present in sessions
    if(sessionStorage.getItem("appAuthToken")) {
      authService.validate().then(authResponse => {
        //Authentication succeeded
        if(authResponse.status === 200) {
          //Twitch token is present in sessions
          if(sessionStorage.getItem("twitchAuthToken")) {
            twitchService.validateToken().then(response => {
              //Twitch authentication succeeded
              if(response.status === 200) {
                console.log(1);
                next();
              }
              //Twitch authentication failed
              else {
                sessionStorage.removeItem("twitchAuthToken");
                next();
              }
            })
          }
          //Twitch token is not present in sessions
          else {
            twitchService.requestAccessToken("/requestaccesstoken");
            source.cancel();
          }
        }
        //Authentication failed because the token is invalid.
        else {
          sessionStorage.removeItem("appAuthToken");
          next({name: "Login"});
        }
      });
    }
    //App auth token is not present in sessions
    else {
      next({name: "Login"});
    }
  } else {
    next();
  }
});

/* Automatically add auth-tokens for both this app and Twitch */
Axios.interceptors.request.use(config => {
  //Rest-call is targeted towards the app's backend
  if(config.url.includes(process.env.VUE_APP_ROOT_API)) {
    //App authentication token is present in sessions
    if(sessionStorage.getItem("appAuthToken")) {
      config.headers['Authorization'] = "Bearer " + sessionStorage.getItem("appAuthToken");
    }
  }
  //Rest-call is targeted towards Twitch's backend
  else if(config.url.includes("https://api.twitch.tv/helix")) {
    if(sessionStorage.getItem("twitchAuthToken")) {
      config.headers['Authorization'] = "Bearer " + sessionStorage.getItem("twitchAuthToken");
      config.headers['Client-Id'] = process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID;
    }
  }
  return config;
});

/* Handle Rest-call responses */
Axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (!error.response) {
    //TODO Show generic error
  } else {
    if(error.response.config.url.includes(process.env.VUE_APP_ROOT_API)) {
      if (error.response.status === 401) {
        // UNAUTHORIZED (Because token is no longer valid, or no token is provided)
        if(router.currentRoute.name !== "Login") {
          Vue.$toast.open({
            message: 'Your session has expired.',
            type: 'error',
            duration: 2500,
          });
          sessionStorage.removeItem("appAuthToken");
          sessionStorage.removeItem("twitchAuthToken");
          this.$router.push({name: "Login"});
        }else{
          Vue.$toast.open({
            message: 'The combination of username and password is not valid.',
            type: 'error',
            duration: 2500,
          });
        }
      }
    }else if(error.response.config.url.includes("https://api.twitch.tv/helix")) {
      if(error.response.status === 401 && router.currentRoute.name !== "Register") {
        Vue.$toast.open({
          message: 'You Twitch-session has expired. Please re-connect your account.',
          type: 'error',
          duration: 2500,
        });
      }
    }

  }
  return Promise.resolve({ error });
});

/* Initialize app */
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
