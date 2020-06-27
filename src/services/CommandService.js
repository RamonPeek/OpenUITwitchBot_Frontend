import Axios from 'axios';

const api_base_url = "https://localhost:5001/api";

export default class CommandService {

    createCommand(command) {
        return Axios.post(api_base_url + "/command", command);
    }

    getCommandById(commandId) {
        return Axios.get(api_base_url + "/command", null, {
            params: {
                commandId: commandId
            }
        });
    }

    updateCommand(commandId, command) {
        return Axios.put(api_base_url + "/command", command, {
            params: {
                commandId: commandId
            }
        });
    }

    deleteCommand(commandId) {
        return Axios.delete(api_base_url + "/command", null, {
            params: {
                commandId: commandId
            }
        })
    }

    getAllCommands() {
        return Axios.get(api_base_url + "/command/all");
    }

}