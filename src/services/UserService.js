import Axios from 'axios';

const api_base_url = "https://localhost:5001/api";

export default class UserService {

    createUser(userWithCredentials) {
        return Axios.post(api_base_url + "/user", userWithCredentials);
    }

    getUserById(userId) {
        return Axios.get(api_base_url + "/user", {
            params: {
                userId: userId
            }
        });
    }

    updateUser(userId, user) {
        return Axios.put(api_base_url + "/user", user, {
            params: {
                userId: userId
            }
        });
    }

    deleteUser(userId) {
        return Axios.delete(api_base_url + "/user", {
            params: {
                userId: userId
            }
        })
    }

    getAllCommands() {
        return Axios.get(api_base_url + "/user/all");
    }

}