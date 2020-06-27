<template>
  <v-app class="app">
    <!-- TOP NAVIGATION -->
    <v-app-bar app>
      <v-card>
        <v-card-actions>
          <v-avatar size="36px" class="profile_photo">
            <img v-bind:src="activeUser.profilePhoto">
          </v-avatar>
          {{activeUser.username}}
          <v-icon>mdi-chevron-down</v-icon>
        </v-card-actions>
      </v-card>

        <router-link to="/">Home</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
    </v-app-bar>
    <!-- SIDE NAVIGATION --> 
    <v-navigation-drawer app>
      <v-list dense>
      <v-subheader>Navigation</v-subheader>
      <v-list-item-group v-model="item" color="primary">
        <v-list-item v-for="(item, i) in sideNavigationItems" :key="i">
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
      <router-view></router-view>
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
    sideNavigationItems: [
      {
        "icon": "mdi-home",
        "text": "Dashboard"
      },
      {
        "icon": "mdi-clipboard-alert",
        "text": "Commands"
      },
      {
        "icon": "mdi-cancel",
        "text": "Placeholder"
      },
      {
        "icon": "mdi-cancel",
        "text": "Placeholder"
      }
    ]
  }),
};
</script>
