<template>
  <v-card class="command_overview">
    <template>
      <v-btn v-on:click="createDialog = true" color="primary">Create command</v-btn>
      <v-data-table :headers="headers" :items="commands" hide-default-footer item-key="items.id">
        <template v-slot:item="item">
          <tr :data-id="item.id">
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
              <v-icon v-on:click="deleteDialog = true" class="delete_icon">mdi-delete</v-icon>
            </td>
          </tr>
          <!-- DELETE COMMAND DIALOG -->
          <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
              <v-card-title class="headline">Delete confirmation</v-card-title>
              <v-card-text>
                <p>
                  Are you sure you want to delete the command: <b>{{item.item.tag}}</b>?
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
                <v-btn color="green darken-1" text v-on:click="deleteCommand(item.item.id)">
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
  </template>
    <!-- CREATE COMMAND DIALOG -->
    <v-dialog v-model="createDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create command</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <p class="prepend_command_tag">
                  !
                </p>
                <v-text-field label="Command tag (trigger)" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Action type"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text v-on:click="createDialog = false">
            Cancel
          </v-btn>
          <v-btn color="green darken-1" text v-on:click="createDialog = false">
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
          },
          { 
            text: 'Command',
            value: 'tag'
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
      createDialog: false
    }
  },
  mounted () {
    this.getAllCommands();
  },
  methods: {
    getAllCommands() {
      commandService.getAllCommands().then(response => {
        if(response.status === 200) {
          this.commands = response.data;
        }
      });
    },
    deleteCommand(commandId) {
      commandService.deleteCommand(commandId).then(response => {
        if(response.status === 200) {
          this.deleteDialog = false;
          this.getAllCommands();
        }
      });
    }
  },
}
</script>
