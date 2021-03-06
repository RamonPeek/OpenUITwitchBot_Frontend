import Axios from 'axios';

export default class UserService {

    authenticate(credentials) {
        return Axios.post(process.env.VUE_APP_ROOT_API +"/api/auth", credentials);
    }

    validate() {
        return Axios.post(process.env.VUE_APP_ROOT_API + "/api/auth/validate");
    }
}