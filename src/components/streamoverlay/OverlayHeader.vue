<template>
  <draggable v-model="items" @start="drag=true" group="overlayItems" :move="moveHandler" @end="drag=false" class="overlay_header">
    <div v-for="(item, index) in items" :key="index" class="item_container">
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
      moveHandler(evt) {
        if(evt.from !== evt.to) {
          //this.items.splice(sourceIndex, 0, targetElement);
          //targetArrayCopy.splice(targetIndex, 0, sourceElement);
          //this.$store.dispatch("updateFooterOverlayItems", targetArrayCopy);

          let targetIndex = evt.relatedContext.index;
          let targetElement = this.$store.getters.overlayFooterItems[targetIndex];
          let sourceIndex = evt.relatedContext.index;

          this.items.splice(sourceIndex, 0, targetElement);
          evt.relatedContext.list.splice(sourceIndex, 1);
          this.$store.dispatch("updateOverlayHeaderItems", this.items);
          this.$store.dispatch("updateOverlayFooterItems", evt.relatedContext.list);
          /*
            if(evt.relatedContext.index <= 4) {
              //Move latest item of new component to old component
              let lastItemInNewContext = evt.relatedContext.list[4];
              this.items.push(lastItemInNewContext);
              evt.relatedContext.list.splice(4, 1);
            }else if(evt.relatedContext.index === 5) {
              console.warn(5);
              //End of other component -> move to end of current component
              console.warn(evt.draggedContext.element)
              console.log("End of other component -> move to end of current component")
            }
       */
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
