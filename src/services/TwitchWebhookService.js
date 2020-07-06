import Axios from 'axios';

const api_base_url = "https://api.twitch.tv/helix";

export default class TwitchWebhookService {

    subscribe(callBackRoute, topicUrl) {
        return Axios.post(api_base_url + "/webhooks/hub", {
            hub: {
                callback: process.env.VUE_APP_ROOT + callBackRoute,
                mode: "subscribe",
                topic: topicUrl,
                lease_seconds: 864000
            }
        });
    }

    unsubscribe(callBackRoute, topicUrl) {
        return Axios.post(api_base_url + "/webhooks/hub", {
            hub: {
                callback: process.env.VUE_APP_ROOT + callBackRoute,
                mode: "unsubscribe",
                topic: topicUrl,
                lease_seconds: 864000
            }
        });
    }

}