<template>
  <v-card class="command_overview">
    <v-card-title>
      Received commands
    </v-card-title>
    <v-divider
        :inset="inset"
        horizontal
      ></v-divider>
    <div class="command_chips_container">
      <div v-for="command in receivedCommands" :key="command.index" class="command_chip_container">
        <v-chip>
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          <p class="command_chip_text"><b>{{command.username}}</b>: {{command.command}}</p>
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
  .command_overview {
    width: 100%;
    height: 100%;
  }

  .command_chip_text {
    padding-top: 15px;
  }

  .command_chips_container {
    overflow-y: scroll;
    margin: 5px;
    height: calc(100% - 73px);
  }

  .command_chip_container {
    margin: 5px;
  }
</style>

<script>
  import BotService from '../services/BotService'
  import TwitchSettings from '../../twitch_settings.json';
  import Command from '../models/Command';

  var bot = new BotService(TwitchSettings.bot_username, TwitchSettings.bot_oauth, TwitchSettings.bot_channels);

  export default {
    name: 'CommandOverview',

    data () {
      return {
        client: null,
        receivedCommands: []
      }
    },
    created: function() {
      this.initializeBot()
    },
    destroyed: function() {
      this.destroyBot()
    },
    methods: {
      initializeBot() {
        this.client = bot.getClient();

        this.client.on("message", (target, context, message, self) => {
          var command = new Command(context.username, message);
          console.log(context);
          console.log(target);
          console.log(self);
          if(message.startsWith("!")) {
            this.receivedCommands.push(command);
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
