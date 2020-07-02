import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Vuex from 'vuex'
import Axios from 'axios'
import AuthService from './services/AuthService';

let authService = new AuthService();

Vue.config.productionTip = false

/* Global methods and constants */
Vue.use(Vuex)

let whiteListedRoutes = [
  "Login",
  "Register",
  "Logout"
]

/* Define constants */
const store = new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    setLoggedIn(state, loginState) {
      state.loggedIn = loginState;
    }
  },
  actions: {
    setLoggedIn(state, loginState) {
      state.commit("setLoggedIn", loginState);
    }
  },
  getters: {
    loggedIn(state) {
      return state.loggedIn;
    }
  }
})

/* Execute before each route-change */
router.beforeEach((to, from, next) => {
  //Remove temporarily store register credentials when navigating away from the register-component
  if(from.name === "Register" && to.name !== "Register") {
    localStorage.removeItem("registerCredentialsMemory");
    localStorage.removeItem("twitchAuth");
    next();
  }else{
    //Component requires authentication
    if(!whiteListedRoutes.includes(to.name)) {
      if(sessionStorage.getItem("appAuthToken")) {
        authService.validate().then(response => {
          if(response.status === 401) {
            next({name: "Logout"});
          }else{
            to.params["currentUserId"] = response.data;
            next();
          }
        });
      }else{
        next({name: "Logout"});
      }
    //Component does not requires authentication
    }else{
      if(to.name === "Login") {
        if(sessionStorage.getItem("appAuthToken")) {
          authService.validate().then(response => {
            if(response.status === 401) {
              next({name: "Logout"});
            }else{
              next({name: "Dashboard"});
            }
          });
        }else{
          next();
        }
      }else if(to.name === "Register") {
        if(sessionStorage.getItem("appAuthToken")) {
          authService.validate().then(response => {
            if(response.status === 401) {
              next({name: "Logout"});
            }else{
              next({name: "Dashboard"});
            }
          });
        }else{
          next();
        }
      }else{
        next();
      }
    }
  }
  /*
  if(from.name === "Register" && to.name !== "Register") {
    localStorage.removeItem("registerCredentialsMemory");
    localStorage.removeItem("twitchAuth");
    next();
  }
  if(!whiteListedRoutes.includes(to.name)) {
    if(sessionStorage.getItem("appAuthToken")) {
      authService.validate().then(response => {
        if(response.status === 401) {
          next({name: "Logout"});
        }else{
          next();
        }
      });
    }else{
      next({name: "Logout"});
    }
  }else{
    if(sessionStorage.getItem("appAuthToken")) {
      if(to.name === "Login") {
        next({name: "Dashboard"});
      }else if(to.name === "Register") {
        next({name: "Dashboard"});
      }else{
        next();
      }
    }else{
      next();
    }

  }*/
  next();
});

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
          router.push({name: "Logout"});
        }else{
          //TODO SHOW ERROR OF INCORRECT CREDENTIALS
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
