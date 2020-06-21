import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import TwitchSettings from '../twitch_settings.json';

/* INITIALIZE VUE */
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

/* INITIALIZE TWITCH BOT */
const tmi = require('tmi.js');

const options = {
    connection: {
      cluster: "aws",
      reconnect: true
    },
    identity: {
        username: TwitchSettings.bot_username,
        password: TwitchSettings.bot_oauth
    },
    channels: TwitchSettings.bot_channels
};

const client = new tmi.client(options);

client.on("message", (target, context, message, self) => {
  console.log(target);
  console.log(self);
  if(message === "!test") {
    console.warn(context.username)
    client.action(TwitchSettings.bot_username, context.username + " said: " + message);
  }
});

client.on("connected", (addr, port) => {
  /*console.log(`* Connected to ${addr}:${port}`);*/
});

client.connect();