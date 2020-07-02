import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.config.productionTip = false

/* Global methods and constants */
Vue.use(Vuex)

/* Define constants */
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

/* Execute before each route-change */
router.beforeEach((to, from, next) => {
  if(from.name === "Register" && to.name !== "Register") {
    localStorage.removeItem("registerCredentialsMemory");
    localStorage.removeItem("twitchAuth");
    next();
  }else{
    next();
  }
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

/* Initialize app */
new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
