<template>
  <v-card class="create_command_overview">
    <button v-on:click="getAllCommands()">GetAllCommands</button>
  </v-card>
</template>

<style scoped>
  .create_command_overview {
    width: 100%;
    height: 100%;
  }

</style>

<script>
  import CommandService from '../services/CommandService';

  export default {
    name: 'CreateCommand',

    data () {
      return {
        command: null
      }
    },
    methods: {
      getAllCommands() {
        new CommandService().getAllCommands().then(response => {
          console.warn(response);
        });
      }
    }
  }
</script>
