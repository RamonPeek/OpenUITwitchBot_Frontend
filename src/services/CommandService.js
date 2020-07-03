import Axios from 'axios';

export default class CommandService {

    createCommand(command) {
        return Axios.post(process.env.VUE_APP_ROOT_API + "/command", command);
    }

    getCommandById(commandId) {
        return Axios.get(process.env.VUE_APP_ROOT_API + "/command", {
            params: {
                commandId: commandId
            }
        });
    }

    updateCommand(commandId, command) {
        return Axios.put(process.env.VUE_APP_ROOT_API + "/command", command, {
            params: {
                commandId: commandId
            }
        });
    }

    deleteCommand(commandId) {
        return Axios.delete(process.env.VUE_APP_ROOT_API + "/command", {
            params: {
                commandId: commandId
            }
        })
    }

    getAllCommands() {
        return Axios.get(process.env.VUE_APP_ROOT_API + "/command/all");
    }

}