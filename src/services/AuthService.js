import Axios from 'axios';

const api_base_url = "https://localhost:5001/api";

export default class UserService {

    authenticate(credentials) {
        return Axios.post(api_base_url + "/auth", credentials);
    }
}