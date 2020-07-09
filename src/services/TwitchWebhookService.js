import Axios from 'axios';

export default class TwitchWebhookService {

    subscribe(callBackRoute, topicUrl) {
        return Axios.get(process.env.VUE_APP_ROOT_API + "/api/webhooks/subscribe", {
            params: {
                callBackUrl: process.env.VUE_APP_ROOT_API + "/api" + callBackRoute,
                topicUrl: topicUrl
            }
        });
    }

    unsubscribe(callBackRoute, topicUrl) {
        return Axios.get(process.env.VUE_APP_ROOT_API + "/api/webhooks/unsubscribe", {
            params: {
                callbackUrl: process.env.VUE_APP_ROOT_API + "/api" + callBackRoute,
                topicUrl: topicUrl
            }
        });
    }

}