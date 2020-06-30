<template>
  <v-card class="command_overview">
    <template>
      <v-data-table :headers="headers" :items="commands" hide-default-footer item-key="items.id">
        <template v-slot:item="item">
          <tr :data-id="item.id">
            <td style="width: 78px; min-width: 78px;">
              <v-icon v-if="item.item.type === 0">mdi-chat</v-icon>
              <v-icon v-if="item.item.type === 1">mdi-volume-high</v-icon>
            </td>
            <td style="width: calc(40vw - 78px); min-width: calc(40vw - 78px);">
              {{item.item.tag}}
            </td>
            <td>
              {{item.item.content}}
            </td>
          </tr>
        </template>
      </v-data-table>
  </template>
  </v-card>
</template>

<style scoped>
  .command_overview {
    width: 100%;
    height: 100%;
  }
</style>

<script>
import CommandService from '../services/CommandService';

var commandService = new CommandService();

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
          }
      ],
      pagination: {}
    }
  },
  mounted () {
    commandService.getAllCommands().then(response => {
      if(response.status == 200) {
        this.commands = response.data;
      }
    });
  },
  methods: {

  },
}
</script>
