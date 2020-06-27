<template>
  <v-app class="app">
    <!-- TOP NAVIGATION -->
    <v-app-bar app>
      <v-app-bar-nav-icon v-if="isMobile()" v-on:click="mobileMenu=!mobileMenu"></v-app-bar-nav-icon>
      <div v-if="mobileMenu">

      </div>
      <!--<router-link to="/">Home</router-link>
      <router-link to="/dashboard">Dashboard</router-link>-->
      <v-card>
        <v-card-actions>
          <v-avatar size="36px" class="profile_photo">
            <img v-bind:src="activeUser.profilePhoto">
          </v-avatar>
          {{activeUser.username}}
          <v-icon>mdi-chevron-down</v-icon>
        </v-card-actions>
      </v-card>
    </v-app-bar>
    <!-- MOBILE NAVIGATION -->
    <div class="mobile_menu_container" v-if="mobileMenu && isMobile()">
      <v-list dense>
      <v-subheader>Navigation</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item v-for="item in sideNavigationItems" :key="item.index" v-on:click="changeComponent(item.path)">
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
    <!-- SIDE NAVIGATION --> 
    <v-navigation-drawer app>
      <v-list dense>
      <v-subheader>Navigation</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item v-for="item in sideNavigationItems" :key="item.index" v-on:click="changeComponent(item.path)">
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
    <!-- SITE CONTENT -->
    <v-content app>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<style>
  .app {
    -ms-overflow-style: none;
  }

  .profile_photo {
    margin-right: 10px;
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

  .mobile_menu_container {
    width: 100vw;
    height: calc(100vh - 57px);
    position: fixed;
    top: 57px;
    z-index: 2;
    background-color: black;
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
</style>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    activeUser: {
      "username": "RamonPeek",
      "profilePhoto": "https://personalportfolio-2adb0.firebaseapp.com/profile_picture.png"
    },
    mobileMenu: false,
    sideNavigationItems: [
      {
        icon: "mdi-home",
        text: "Dashboard",
        path: "/"
      },
      {
        icon: "mdi-clipboard-alert",
        text: "Commands",
        path: "/commands"
      },
      {
        icon: "mdi-cancel",
        text: "Placeholder",
        path: "/placeholder"
      },
      {
        icon: "mdi-cancel",
        text: "Placeholder",
        path: "/placeholder"
      }
    ]
  }),
  methods: {
    changeComponent(path) {
      if(this.$router.currentRoute.path != path) {
        this.$router.push({ path: path });
      }
      this.mobileMenu = false;
    },
    isMobile() {
      var mobile = this.$vuetify.breakpoint.width < this.$vuetify.breakpoint.mobileBreakpoint;
      if(!mobile) {
        this.mobileMenu = false;
      }
      return mobile;
    }
  }
};
</script>
