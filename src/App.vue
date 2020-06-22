<template>
  <v-app class="app">
    <router-link to="/">Home</router-link>
    <router-link to="/dashboard">Dashboard</router-link>
    <router-view></router-view>
  </v-app>
</template>

<style>
  .app {
    background-color: #ededed;
    -ms-overflow-style: none;
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
    
  }),
};
</script>
