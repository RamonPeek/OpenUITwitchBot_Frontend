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
          <p class="command_chip_datetime">{{command.datetime.getHours()}}:{{command.datetime.getMinutes()}}</p>
          <p class="command_chip_text"><b>{{command.username}}</b>: {{command.command}}</p>
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
  import BotService from '../services/BotService'
  import AppSettings from '../../app_settings.json';
  import Command from '../models/Command';
  import $ from 'jquery';

  var bot = new BotService(AppSettings.bot_username, AppSettings.bot_oauth, AppSettings.bot_channels);

  export default {
    name: 'ChatOverview',

    data () {
      return {
        client: null,
        receivedCommands: [],
      }
    },
    created: function() {
      this.initializeBot()
    },
    beforeDestroy: function() {
      this.destroyBot()
    },
    methods: {
      initializeBot() {
        this.client = bot.getClient();

        this.client.on("message", (target, context, message, self) => {
          var command = new Command(context.username, message, new Date());
          console.log(context);
          console.log(target);
          console.log(self);
          if(message.startsWith("!")) {
            this.receivedCommands.push(command);
            $("#command_chips_container").animate({ scrollTop: $('#command_chips_container')[0].scrollHeight}, 500);
              //console.warn(context.username)
              //client.action(TwitchSettings.bot_username, context.username + " executed command: " + message);
          }
        });
        this.client.connect();
      },
      destroyBot() {
        this.client.disconnect();
      }
    }
  }
</script>
