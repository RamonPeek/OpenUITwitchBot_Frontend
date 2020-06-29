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
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      }
    }
  }
</script>
