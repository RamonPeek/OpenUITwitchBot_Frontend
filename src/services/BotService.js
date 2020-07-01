
import tmi from 'tmi.js';

export default class BotService {


    constructor(username, oauth, channels) {
        this.username = username;
        this.oauth = oauth;
        this.channels = channels;
        this.options = {
            connection: {
                cluster: "aws",
                reconnect: true
            },
            identity: {
                username: username,
                password: oauth
            },
            channels: channels
        }
    }

    getClient() {
        let client = tmi.client(this.options);
        return client;
    }
}