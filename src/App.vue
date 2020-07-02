<template>
  <v-app class="app" >
    <!-- TOP NAVIGATION -->
    <v-app-bar app>
      <v-app-bar-nav-icon v-if="isMobile()" v-on:click="toggleMobileMenu()" class="hamburger_icon_container"></v-app-bar-nav-icon>
      <div class="top_menu_container">
        <div v-if="$store.getters.loggedIn" v-on:click="changeComponent('/placeholder')" class="profile_item_container">
          <v-avatar size="36px" class="profile_photo">
            <img v-bind:src="currentUser.twitchAccount.profileImageUrl">
          </v-avatar>
          <div class="username">{{currentUser.twitchAccount.displayName}}</div>
          <v-icon>mdi-chevron-down</v-icon>
        </div>
      </div>
    </v-app-bar>
    <!-- SIDE NAVIGATION --> 
    <v-navigation-drawer app>
      <v-list dense>
        <v-subheader>Quick navigation</v-subheader>
        <!-- SIDE NAVIGATION ITEMS WHEN LOGGED-IN -->
        <v-list-item-group color="primary" v-if="$store.getters.loggedIn">
          <v-list-item v-for="item in loggedInNavigationItems" :key="item.index" :to="item.path" v-on:click="disabledMobileMenu()">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <!-- SIDE NAVIGATION ITEMS WHEN NOT LOGGED-IN -->
        <v-list-item-group color="primary" v-if="!$store.getters.loggedIn">
          <v-list-item v-for="item in notLoggedInNavigationItems" :key="item.index" :to="item.path" v-on:click="disabledMobileMenu()">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <!-- MOBILE NAVIGATION -->
    <transition name="fade">
      <div class="mobile_menu_background" v-if="mobileMenu && isMobile()"></div>
    </transition>
    <transition name="fade-fast">
      <div class="mobile_menu_container" v-if="mobileMenu && isMobile()">
        <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item v-for="item in sideNavigationItems" :key="item.index" :to="item.path" v-on:click="disabledMobileMenu()">
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </transition>
    <!-- SITE CONTENT -->
    <v-main app>
      <transition name="fade" mode="out-in">
        <router-view :key="$route.fullPath"></router-view>
      </transition>
    </v-main>
  </v-app>
</template>

<style>
  .app {
    -ms-overflow-style: none;
  }

  .top_menu_container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    float: left;
    margin-top: calc(1px - 0.1vw);
  }

  .hamburger_icon_container {
    width: 50px;
    float: left;
  }

  .profile_photo {
    margin-right: 10px;
  }

  .profile_item_container {
    display: flex;
    justify-content: start;
  }

  .profile_item_container:hover {
    cursor: pointer;
  }

  ::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar
  {
    width: 12px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }

  .username {
    padding-top: 6px;
  }

  .mobile_menu_container {
    width: 100vw;
    height: calc(100vh - 57px);
    position: fixed;
    top: 57px;
    z-index: 3;
  }

  .mobile_menu_background {
    background-color: black;
    width: 100vw;
    height: calc(100vh - 57px);
    position: fixed;
    top: 57px;
    z-index: 2;
    opacity: 0.7;
  }


  /* ROUTER TRANSITION EFFECT */
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.15s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }

  /* FADE EFFECTS */
  .fade-enter-active, .fade-leave-active {
    transition: opacity .15s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .fade-fast-enter-active, .fade-fast-leave-active {
    transition: opacity .15s;
  }
  .fade-fast-enter, .fade-fast-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>

<script>
import AuthService from "./services/AuthService";
import UserService from "./services/UserService";

let authService = new AuthService();
let userService = new UserService();

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    currentUser: null,
    mobileMenu: false,
    sideNavigationItems: [
      {
        icon: "mdi-home",
        text: "Dashboard",
        path: "/",
        loginRequired: true
      },
      {
        icon: "mdi-clipboard-alert",
        text: "Commands",
        path: "/commands",
        loginRequired: true
      },
      {
        icon: "mdi-cog",
        text: "Settings",
        path: "/settings",
        loginRequired: true
      },
      {
        icon: "mdi-account",
        text: "Login",
        path: "/login",
        loginRequired: false
      },
      {
        icon: "mdi-account-multiple-plus",
        text: "Register",
        path: "/register/1",
        loginRequired: false
      },
      {
        icon: "mdi-logout",
        text: "Logout",
        path: "/logout",
        loginRequired: true
      }
    ]
  }),
  computed: {
    loggedInNavigationItems: function() {
      let items = [];
      this.sideNavigationItems.forEach(element => {
        if(element.loginRequired) {
          items.push(element);
        }
      });
      return items;
    },
    notLoggedInNavigationItems: function() {
      let items = [];
      this.sideNavigationItems.forEach(element => {
        if(!element.loginRequired) {
          items.push(element);
        }
      });
      return items;
    }
  },
  methods: {
    disabledMobileMenu() {
      this.mobileMenu = false;
    },
    isMobile() {
      var mobile = this.$vuetify.breakpoint.width < this.$vuetify.breakpoint.mobileBreakpoint;
      if(!mobile) {
        this.mobileMenu = false;
      }
      return mobile;
    },
    toggleMobileMenu() {
      this.mobileMenu= !this.mobileMenu;
    },
    changeComponent(path) {
      if(this.$router.currentRoute.path !== path) {
        this.$router.push(path);
      }
    }
  },
  mounted() {
    /* Set loginSession when the app is opened */
    if(sessionStorage.getItem("appAuthToken")) {
      authService.validate().then(response => {
        if(response.status === 200) {
          this.$store.dispatch("setLoggedIn", true);
          userService.getUserById(response.data).then(userResponse => {
            this.currentUser = userResponse.data;
          })
        }
      });
    }
    let darkMode = sessionStorage.getItem("darkMode");
    if(darkMode) {
      if(darkMode === "true") {
        this.$vuetify.theme.dark = true;
      }else{
        this.$vuetify.theme.dark = false;
      }
    }else{
      sessionStorage.setItem("darkMode", "true");
      this.$vuetify.theme.dark = true;
    }
  }
};
</script>
