<template>
  <draggable v-model="footerItems" @start="drag=true" group="overlayItems" @end="drag=false" class="overlay_footer">
    <div v-for="(item, index) in footerItems" :key="index" class="item_container">
      <div class="item_wrapper">
        <v-icon v-text="item.icon" class="item_icon"></v-icon>
        <div class="item_text_container">
          <div v-if="item.text" class="item_text">{{item.text}}</div>
          <div v-if="item.text && item.value" class="item_colon">:</div>
          <div v-if="item.value" class="item_value">{{item.value}}</div>
        </div>
      </div>
    </div>
  </draggable>
</template>

<style scoped>

  .overlay_footer {
    width: 100%;
    height: 100%;
    background-color: red !important;
    display: flex;
    justify-content: start;
  }

  .item_container {
    width: calc(100% / 5);
    padding-top: 4px;
    font-size: 10pt;
    text-align: center;
  }

  .item_container:hover {
    cursor:grab;
  }

  .item_container:active {
    cursor:grabbing;
  }

  .item_wrapper {
    display: inline-block;
  }

  .item_text_container {
    float: left;
  }

  .item_icon {
    float: left;
    font-size: 20pt;
    padding-top: 8px;
    text-align: start !important;
  }

  .item_text {
    float: left;
    padding-top: 3px;
    font-weight: bold;
    margin-left: 5px;
    margin-bottom: 0px !important;
    text-align: start !important;
  }

  .item_colon {
    float: left;
    padding-top: 3px;
    font-weight: bold;
    margin-bottom: 0px !important;
    text-align: start !important;
  }

  .item_value {
    padding-left: 5px;
    text-align: start !important;
  }
</style>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'OverlayFooter',
    components: {
      draggable
    },
    data () {
      return {
        footerItems: [
          {

          },
          {

          },
          {

          },
          {

          },
          {

          }
        ]
      }
    },
    methods: {

    },
    computed: {

    },
    mounted() {

    },
  }
</script>
