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

    testGetChannel() {
        return Axios.get(api_base_url + "/streams?game_id=33214");
    }
}