<template>
  <v-checkbox v-model="darkMode" v-on:change="setDarkMode" label="Darkmode"></v-checkbox>
</template>

<style scoped>
  .app_settings_overview {
    width: 100%;
    height: 100%;
  }
</style>

<script>
  export default {
    name: 'AppSettings',

    data () {
      return {
        darkMode: false
      }
    },
    methods: {
      setDarkMode() {
        let darkMode = sessionStorage.getItem("darkMode");
        if(darkMode) {
          if(darkMode === "true") {
            sessionStorage.setItem("darkMode", "false");
            this.$vuetify.theme.dark = false;
          }else{
            sessionStorage.setItem("darkMode", "true");
            this.$vuetify.theme.dark = true;
          }
        } else {
          sessionStorage.setItem("darkMode", "true");
          this.$vuetify.theme.dark = true;
        }
      }
    },
    mounted() {
      let darkMode = sessionStorage.getItem("darkMode");
      if(darkMode) {
        if(darkMode === "true") {
          this.darkMode = true;
        }else{
          this.darkMode = false;
        }
      }
    }
  }
</script>
