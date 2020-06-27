<template>
  <v-card class="command_overview">
    <v-expansion-panels>
      <v-expansion-panel v-for="command in commands" :key="command.index">
        <v-expansion-panel-header>{{command.tag}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider></v-divider><br>
          Type: {{command.type}}<br>
          Content: {{command.content}}<br>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div >
      
    </div>
  </v-card>
</template>

<style scoped>
  .command_overview {
    width: 100%;
    height: 100%;
  }
</style>

<script>
import CommandService from '../services/CommandService';

var commandService = new CommandService();

export default {
  name: 'CommandOverview',

  data () {
    return {
      commands: [],
    }
  },
  mounted () {
    commandService.getAllCommands().then(response => {
      if(response.status == 200) {
        this.commands = response.data;
      }
    });
  },
  methods: {

  },
}
</script>
