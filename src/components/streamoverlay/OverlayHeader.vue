<template>
  <div class="overlay_header">
    <div v-for="item in items" :key="item.index" class="item_container">
      <div class="item_wrapper">
        <v-icon v-text="item.icon" class="item_icon"></v-icon>
        <div class="item_text_container">
          <div v-if="item.text" class="item_text">{{item.text}}</div>
          <div v-if="item.text && item.value" class="item_colon">:</div>
          <div v-if="item.value" class="item_value">{{item.value}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

  .overlay_header {
    width: 100%;
    height: 100%;
    background-color: red !important;
    display: flex;
    justify-content: start;
    padding-left: 4px;
    padding-right: 4px;
  }

  .item_container {
    width: calc(100% / 5);
    margin-top: 4px;
    font-size: 10pt;
    text-align: center;
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
  export default {
    name: 'OverlayHeader',

    data () {
      return {
        items: [
          {
            icon: "mdi-account",
            text: "Latest follower",
            value: "RamonPeekFifa",
            enabled: true
          },
          {
            icon: "mdi-currency-usd",
            text: "Highest donation",
            value: "TestAccount2",
            enabled: true
          },
          {
            icon: "mdi-account-clock",
            text: "Active viewer",
            value: "DamagedA",
            enabled: true
          },
          {
            icon: "mdi-eye",
            text: "Viewers",
            value: "12",
            enabled: true
          }
        ]
      }
    },
    methods: {

    },
    mounted() {

    }
  }
</script>
