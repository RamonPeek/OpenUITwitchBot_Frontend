<template>
  <v-card class="chat_overview">
    <div class="command_chips_title_container">
      <v-card-title>
        Received commands
      </v-card-title>
      <v-divider
        horizontal
      ></v-divider>
    </div>
    <div id="command_chips_container">
      <div v-for="command in receivedCommands" :key="command.index" class="command_chip_container">
        <v-chip>
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          <!--<p class="command_chip_datetime">{{command.datetime.getHours()}}:{{command.datetime.getMinutes()}}</p>-->
          <p class="command_chip_text"><b>{{command.sender}}</b>: {{command.tag}}</p>
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
  .chat_overview {
    width: 100%;
    height: 300px;
  }

  .command_chip_text {
    padding-top: 15px;
  }

  .command_chips_title_container {
    height: 50px;
  }

  #command_chips_container {
    overflow-y: scroll;
    margin: 5px;
    margin-top: 20px;
    height: calc(100% - 75px);
  }

  .command_chip_container {
    margin: 5px;
  }

  .command_chip_datetime {
    margin-top: 18px;
    margin-right: 10px;
    font-size: 8pt;
  }

  .no_received_commands_text {
    text-align: center;
    margin-top: 100px;
  }
</style>

<script>

  import $ from 'jquery';

  export default {
    name: 'ChatOverview',

    data () {
      return {
        //TODO TEMP SOLUTION. IN THE FUTURE I NEED TO PUT THIS IN THE VUEX STORE, ALSO CHECK MAIN.JS FOR COMMANDHANDLING
        receivedCommands: []
      }
    },
    watch: {
      receivedCommands: function() {
        $("#command_chips_container").animate({ scrollTop: $('#command_chips_container')[0].scrollHeight}, 500);
      }
    },
    methods: {

    },
    mounted() {
      this.receivedCommands = this.$store.state.receivedChatCommands;
    }
  }
</script>
