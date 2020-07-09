import Axios from 'axios';

const api_base_url = "https://api.twitch.tv/helix";

export default class TwitchService {

    getUserByBearer(bearer) {
        return Axios.get(api_base_url + "/users", {
            headers: {
                'Client-ID': process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID,
                'Authorization': 'Bearer ' + bearer
            }
        });
    }

    getGameById(gameId) {
        return Axios.get(api_base_url + "/games?id=" + gameId,
        {
                headers: {
                    'Client-ID': process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID,
                    'Authorization': 'Bearer ukrdvm2watew450p8efvvvrc40khqe'
                }
            });
    }

    getWebhookAdresses() {
        return Axios.get("https://api.twitch.tv/helix/webhooks/subscriptions?first=20",
        {
                headers: {
                    'Client-ID': process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID,
                    'Authorization': 'Bearer ukrdvm2watew450p8efvvvrc40khqe'
                }
            });
    }
}