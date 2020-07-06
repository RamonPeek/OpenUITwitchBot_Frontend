<template>
  <div>
    <draggable :list="items" @start="drag=true" group="overlayItems" :move="moveHandler" @end="drag=false" class="overlay_header">
      <div v-for="item in items" :key="item.position" class="item_container">
        <div class="item_wrapper" v-if="item">
          <v-icon v-if="item.icon" v-text="item.icon" class="item_icon"></v-icon>
          <div class="item_text_container">
            <div v-if="item.text" class="item_text">{{item.text}}</div>
            <div v-if="item.text && item.value" class="item_colon">:</div>
            <div v-if="item.value" class="item_value">{{item.value}}</div>
          </div>
        </div>
      </div>
    </draggable>
    <v-btn v-on:click="test">test</v-btn>
  </div>

</template>

<style scoped>

  .overlay_header {
    width: 100%;
    height: 100%;
    background-color: red !important;
    display: flex;
    justify-content: start;
  }

  .item_container {
    width: calc(100% / 5);
    padding: 4px;
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
    name: 'OverlayHeader',
    components: {
      draggable
    },
    data () {
      return {
        items: this.headerItems
      }
    },
    methods: {
      test() {
        this.items.splice(0, 1, {})
      },
      moveHandler(evt) {
        if(evt.from !== evt.to) {
          let fromIndex = evt.draggedContext.index;
          let fromElement = this.$store.getters.overlayHeaderItems[fromIndex];
          let toIndex = evt.draggedContext.futureIndex;
          //let toElement = this.$store.getters.overlayFooterItems[toIndex];
          console.warn(toIndex);
          console.warn(JSON.parse(JSON.stringify(fromElement)));
          this.items.forEach((element, index) => {
            if(element.position === toIndex) {
              fromElement.position = toIndex;
              console.log(index);
              this.items.splice(index, 1, fromElement);
            }
          })
          this.items.splice(toIndex, 0, fromElement);
          /*
          this.$store.dispatch("setOverlayHeaderItemAt", {
            index: fromIndex,
            item: toElement
          });

          this.$store.dispatch("setOverlayFooterItemAt", {
            index: toIndex,
            item: fromElement
          });*/



        }
      }
    },
    props: {
      headerItems: {
        type: Array
      }
    },
    mounted() {

    },
  }
</script>
