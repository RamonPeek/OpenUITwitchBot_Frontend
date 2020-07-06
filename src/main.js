import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Vuex from 'vuex'
import Axios from 'axios'
import AuthService from './services/AuthService';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

let authService = new AuthService();

Vue.config.productionTip = false

/* Global methods and constants */
Vue.use(Vuex)
Vue.use(VueToast);

let whiteListedRoutes = [
  "Login",
  "Register",
  "Logout"
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
        identifier: "LATEST_FOLLOWER",
        icon: "mdi-account",
        text: "Latest follower",
        value: "RamonPeekFifa"
      },
      {
        identifier: "HIGHEST_DONATION",
        icon: "mdi-currency-usd",
        text: "Highest donation",
        value: "TestAccount2"
      },
      {
        identifier: "NEWEST_DONATION",
        icon: "mdi-currency-usd",
        text: "Most recent donation",
        value: "DamagedA"
      },
      {
        identifier: "VIEWER_COUNT",
        icon: "mdi-eye",
        text: "Viewers",
        value: "12"
      },
      {
      }
    ],
    overlayFooterItems: [
      {
        identifier: "TEST2",
        icon: "mdi-home",
        text: "Test2",
        value: "Test2"
      },
      {
      },
      {
      },
      {
      },
      {
      }
    ]
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
    }
  }
})

/* Execute before each route-change */
router.beforeEach((to, from, next) => {
  //User first loads app
  if(from.name == null) {
    //Component requires authentication
    if (!whiteListedRoutes.includes(to.name)) {
      if (sessionStorage.getItem("appAuthToken")) {
        authService.validate().then(response => {
          if (response.status === 401) {
            Vue.$toast.open({
              message: 'Your session has expired.',
              type: 'error',
              duration: 2500,
            });
            next({name: "Logout"});
          } else {
            next();
          }
        });
      } else {
        Vue.$toast.open({
          message: 'You must be logged-in to view this page.',
          type: 'error',
          duration: 2500,
        })
        next({name: "Logout"});
      }
      //Component does not requires authentication
    } else {
      if (to.name === "Login") {
        if (sessionStorage.getItem("appAuthToken")) {
          authService.validate().then(response => {
            if (response.status === 401) {
              Vue.$toast.open({
                message: 'Your session has expired.',
                type: 'error',
                duration: 2500,
              });
              next({name: "Logout"});
            } else {
              next({name: "Dashboard"});
            }
          });
        } else {
          next();
        }
      } else if (to.name === "Register") {
        if (sessionStorage.getItem("appAuthToken")) {
          authService.validate().then(response => {
            if (response.status === 401) {
              Vue.$toast.open({
                message: 'Your session has expired.',
                type: 'error',
                duration: 2500,
              });
              next({name: "Logout"});
            } else {
              next({name: "Dashboard"});
            }
          });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  }else{
    //Remove temporarily store register credentials when navigating away from the register-component
    if(from.name === "Register" && to.name !== "Register") {
      localStorage.removeItem("registerCredentialsMemory");
      localStorage.removeItem("twitchAuth");
      next();
    }else {
      //Component requires authentication
      if (!whiteListedRoutes.includes(to.name)) {
        if (sessionStorage.getItem("appAuthToken")) {
          authService.validate().then(response => {
            if (response.status === 401) {
              Vue.$toast.open({
                message: 'Your session has expired.',
                type: 'error',
                duration: 2500,
              });
              next({name: "Logout"});
            } else {
              next();
            }
          });
        } else {
          Vue.$toast.open({
            message: 'You must be logged-in to view this page.',
            type: 'error',
            duration: 2500,
          })
          next({name: "Logout"});
        }
        //Component does not requires authentication
      } else {
        if (to.name === "Login") {
          if (sessionStorage.getItem("appAuthToken")) {
            authService.validate().then(response => {
              if (response.status === 401) {
                Vue.$toast.open({
                  message: 'Your session has expired.',
                  type: 'error',
                  duration: 2500,
                });
                next({name: "Logout"});
              } else {
                next({name: "Dashboard"});
              }
            });
          } else {
            next();
          }
        } else if (to.name === "Register") {
          if (sessionStorage.getItem("appAuthToken")) {
            authService.validate().then(response => {
              if (response.status === 401) {
                Vue.$toast.open({
                  message: 'Your session has expired.',
                  type: 'error',
                  duration: 2500,
                });
                next({name: "Logout"});
              } else {
                next({name: "Dashboard"});
              }
            });
          } else {
            next();
          }
        } else if(to.name === "Logout") {
          Vue.$toast.open({
            message: 'Successfully logged out.',
            type: 'success',
            duration: 2500,
          });
          next();
        }else{
          next();
        }
      }
    }
  }
});
``
/* Automatically add auth-tokens if possible */
Axios.interceptors.request.use(config => {
  if(config.url.includes(process.env.VUE_APP_ROOT_API)) {
    //APP CALL
    if(sessionStorage.getItem("appAuthToken")) {
      config.headers['Authorization'] = "Bearer " + sessionStorage.getItem("appAuthToken");
    }
  }
  else if(config.url.includes("https://api.twitch.tv/helix")) {
    //TWITCH CALL
    if(sessionStorage.getItem("twitchAuthToken")) {
      config.headers['Client-Id'] = process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID;
      config.headers['Authorization'] = "Bearer " + sessionStorage.getItem("twitchAuthToken");
    }
  }
  return config;
})

/* Automatically log the user off when the token is expired or not valid */
Axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (!error.response) {
    //TODO Show error
  } else {
    if(error.response.config.url.includes(process.env.VUE_APP_ROOT_API)) {
      if (error.response.status === 401) {
        // UNAUTHORIZED (Because token is no longer valid, so redirect user to logout to remove invalid token)
        if(router.currentRoute.name !== "Login") {
          //TODO SHOW ERROR WHICH SHOWS THAT SESSION HAS EXPIRED
          Vue.$toast.open({
            message: 'Your session has expired.',
            type: 'error',
            duration: 2500,
          });
          router.push({name: "Logout"});
        }else{
          Vue.$toast.open({
            message: 'The combination of username and password is not valid.',
            type: 'error',
            duration: 2500,
          });
        }
      }
    }else if(error.response.config.url.includes("https://api.twitch.tv/helix")) {
      //TODO REDIRECT TO RE-AUTH WITH TWITCH PAGE
      console.warn("Re-auth with Twitch");
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
