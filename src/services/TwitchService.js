import Axios from 'axios';

const api_base_url = "https://api.twitch.tv/helix";

export default class TwitchService {

    getUserByBearer() {
        return Axios.get(api_base_url + "/users");
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

    validateToken() {
        let token = sessionStorage.getItem("twitchAuthToken");
        return Axios.get("https://id.twitch.tv/oauth2/validate", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }

    requestAccessToken(returnRoute) {
        let clientId = process.env.VUE_APP_TWITCH_PUBLIC_CLIENT_ID;
        let returnUrl = process.env.VUE_APP_ROOT + returnRoute;
        let scope = "user:read:email+channel:read:subscriptions+chat:read+chat:edit";
        window.location = "https://id.twitch.tv/oauth2/authorize?client_id=" + clientId + "&response_type=token&scope=" + scope + "&redirect_uri=" + returnUrl;
    }
}