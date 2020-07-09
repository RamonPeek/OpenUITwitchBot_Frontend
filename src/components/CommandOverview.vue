<template>
  <v-card class="command_overview">
    <template>
      <div class="create_command_dialog_button_container">
        <v-btn v-on:click="createDialog = true" color="primary" class="create_command_dialog_button">Create command</v-btn>
      </div>
      <v-data-table :headers="headers" :items="commands" hide-default-footer item-key="items.id">
        <template v-slot:item="item">
          <tr :data-id="item.item.id">
            <td style="width: 78px; min-width: 78px;">
              <v-icon v-if="item.item.type === 0">mdi-chat</v-icon>
              <v-icon v-if="item.item.type === 1">mdi-volume-high</v-icon>
            </td>
            <td style="width: calc(25vw - 78px); min-width: calc(25vw - 78px);">
              {{item.item.tag}}
            </td>
            <td>
              {{item.item.content}}
            </td>
            <!-- TODO REPLACE WITH COMPONENT OR CHANGE VARIABLE SO V-MODEL CAN SHOW EDIT/DELETE BOX. -->
            <td style="width: 78px; min-width: 78px;">
              <a>
                <v-icon class="edit_icon">mdi-square-edit-outline</v-icon>
              </a>
            </td>
            <!-- TODO REPLACE WITH COMPONENT OR CHANGE VARIABLE SO V-MODEL CAN SHOW EDIT/DELETE BOX. -->
            <td style="width: 78px; min-width: 78px;">
              <v-icon v-on:click="openDeleteModal(item.item.id)" class="delete_icon">mdi-delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
  </template>
    <!-- DELETE COMMAND DIALOG -->
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete confirmation</v-card-title>
        <v-card-text>
          <p>
            Are you sure you want to delete the command: <b>{{commandToDelete.tag}}</b>?
          </p>
          <p>
            The deletion-process can not be reverted but you can re-add the command at any given time.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text v-on:click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text v-on:click="deleteCommand(commandToDelete.id)">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- CREATE COMMAND DIALOG -->
    <v-dialog v-model="createDialog" persistent  max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create command</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="createCommandModel" v-model="validCreateModel" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <p class="prepend_command_tag">
                    !
                  </p>
                  <v-text-field :rules="tagRules" label="Command tag (trigger)" v-model="commandToCreate.tag" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select :rules="typeRules" label="Action type" :items="commandTypes" v-model="commandToCreate.type" v-on:change="resetContent" required></v-select>
                </v-col>
              </v-row>
              <v-row v-if="commandToCreate.type">
                <v-col cols="12" sm="12" md="12">
                  <v-text-field v-if="commandToCreate.type === 'Chat reply'" :rules="chatContentRules" prepend-icon="mdi-chat" label="Chat reply" v-model="commandToCreate.content" required></v-text-field>
                  <v-file-input v-if="commandToCreate.type === 'Sound'" :rules="soundContentRules" prepend-icon="mdi-volume-high" chips label="Sound file" required></v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text v-on:click="createDialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text v-on:click="createDialog = false" v-if="!validCreateModel || !commandToCreate.tag || !commandToCreate.type || !commandToCreate.content" disabled>
            Create
          </v-btn>
          <v-btn color="green darken-1" text v-on:click="createCommand" v-if="validCreateModel && commandToCreate.tag && commandToCreate.type && commandToCreate.content">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
  .command_overview {
    width: 100%;
    height: 100%;
  }

  .edit_icon:hover {
    color: #FFCC00;
  }

  .delete_icon:hover {
    color: #FF3300;
  }

  .prepend_command_tag {
    float: left;
    font-size: 15pt;
    margin-top: 20px;
    margin-left: -1px;
    margin-right: 1px;
  }

  .create_command_dialog_button_container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .create_command_dialog_button {
    margin: 10px;
  }

</style>

<script>
import CommandService from '../services/CommandService';

let commandService = new CommandService();

export default {
  name: 'CommandOverview',

  data () {
    return {
      commands: [],
      headers: [
          { text: 'Type',
            value: 'type',
            sortable: false
          },
          { 
            text: 'Command',
            value: 'tag',
            sortable: false
          },
          { 
            text: 'Content',
            value: 'content',
            sortable: false
          },
          {
            text: 'Edit',
            value: 'edit',
            sortable: false
          },
          {
            text: 'Delete',
            value: 'delete',
            sortable: false
          }
      ],
      pagination: {},
      deleteDialog: false,
      createDialog: false,
      commandTypes: [],
      commandToDelete: {},
      commandToCreate: {},
      tagRules: [
        v => !!v || 'Tag is required.'
      ],
      typeRules: [
        v => !!v || 'Type is required.'
      ],
      validCreateModel: false,
      chatContentRules: [
        v => !!v || 'Chat reply message is required.'
      ],
      soundContentRules: [
        v => !!v || 'Sound file is required.'
      ]
    }
  },
  mounted () {
    this.getAllCommands();
    this.getCommandTypeNames();
  },
  methods: {
    getAllCommands() {
      commandService.getAllCommands().then(response => {
        if(response.status === 200) {
          this.commands = response.data;
        }
      });
    },
    getCommandTypeNames() {
      commandService.getCommandTypeNames().then(response => {
        if(response.status === 200) {
          let processedTypes = [];
          response.data.forEach(element => {
            let formattedName = element.toLowerCase().charAt(0).toUpperCase() + element.slice(1).toLowerCase();
            processedTypes.push(formattedName.replace("_", " "));
          });
          this.commandTypes = processedTypes;
        }
      });
    },
    deleteCommand(commandId) {
      commandService.deleteCommand(commandId).then(response => {
        if(response.status === 200) {
          this.deleteDialog = false;
          this.getAllCommands();
          this.$store.dispatch("initializeTwitchBotClient");

        }
      });
    },
    createCommand() {
      let command = JSON.parse(JSON.stringify(this.commandToCreate));
      command.type = command.type.toUpperCase().replace(" ", "_");
      commandService.getCommandTypeIdByName(command.type).then(response => {
        if(response.status === 200) {
          command.type = response.data;
          command.tag = "!" + command.tag;
          commandService.createCommand(command).then(response => {
            if(response.status === 200) {
              this.getAllCommands();
              this.commandToCreate = {};
              this.validCreateModel = false;
              this.createDialog = false;
              this.$refs.createCommandModel.reset()
              this.$store.dispatch("initializeTwitchBotClient");
            }
          });
        }
      });
    },
    resetContent() {
      this.commandToCreate.content = null;
    },
    openDeleteModal(id) {
      let commandIndex = this.commands.findIndex(function (element) {
        return element.id === id;
      });
      this.commandToDelete = this.commands[commandIndex];
      this.deleteDialog = true;
    }
  },
}
</script>
