import Axios from 'axios';

export default class UserService {

    createUser(userWithCredentials) {
        return Axios.post(process.env.VUE_APP_ROOT_API + "/user", userWithCredentials);
    }

    getUserById(userId) {
        return Axios.get(process.env.VUE_APP_ROOT_API + "/user", {
            params: {
                userId: userId
            }
        });
    }

    updateUser(userId, user) {
        return Axios.put(process.env.VUE_APP_ROOT_API + "/user", user, {
            params: {
                userId: userId
            }
        });
    }

    deleteUser(userId) {
        return Axios.delete(process.env.VUE_APP_ROOT_API + "/user", {
            params: {
                userId: userId
            }
        })
    }

    getAllCommands() {
        return Axios.get(process.env.VUE_APP_ROOT_API + "/user/all");
    }

}