import OverlayHeader from '../../components/streamoverlay/OverlayHeader';
import OverlayContent from '../../components/streamoverlay/OverlayContent';
import OverlayFooter from '../../components/streamoverlay/OverlayFooter';
import draggable from "vuedraggable";
import {VIcon} from 'vuetify/lib'

export default {
  name: 'streamoverlay',
  components: {
    OverlayHeader,
    OverlayContent,
    OverlayFooter,
    draggable,
    VIcon
  },
  props: [],
  data () {
    return {
      selectedIndex: null
    }
  },
  computed: {
    headerItems: {
      get() {
        return this.$store.state.overlayHeaderItems;
      },
      set(val) {
        this.$store.commit("updateOverlayHeaderItems", val);
      }
    },
    footerItems: {
      get() {
        return this.$store.state.overlayFooterItems;
      },
      set(val) {
        this.$store.commit("updateOverlayFooterItems", val);
      }
    }
  },
  mounted () {
    //SIMULATE WEBHOOKS BY USING RUNNABLE
    let i = 0;
    let vm = this;
    window.setInterval(function(){
      vm.$store.dispatch("updateValueForIdentifier", {
        identifier: "LATEST_FOLLOWER",
        value: i
      });
      i++;
    }, 300);
    console.log("test");
  },
  methods: {
    moveHeaderHandler(evt) {
      if(this.selectedIndex) {
        return false;
      }
      if(evt.from !== evt.to) {
        let sourceIndex = evt.draggedContext.index;
        let targetIndex = evt.draggedContext.futureIndex;
        this.selectedIndex = targetIndex;
        let targetElement = this.footerItems[targetIndex];
        if(sourceIndex > 4) {
          sourceIndex = 4;
        }
        if(targetIndex > 4) {
          targetIndex = 4;
        }
        if(targetElement === undefined) {
          targetElement = {}
        }
        this.headerItems.splice(sourceIndex + 1, 0, targetElement);
        this.footerItems.splice(targetIndex, 1);
      }
    },
    moveFooterHandler(evt) {
      if(this.selectedIndex) {
        return false;
      }
      if(evt.from !== evt.to) {
        let sourceIndex = evt.draggedContext.index;
        let targetIndex = evt.draggedContext.futureIndex;
        this.selectedIndex = targetIndex;
        let targetElement = this.headerItems[targetIndex];
        if(sourceIndex > 4) {
          sourceIndex = 4;
        }
        if(targetIndex > 4) {
          targetIndex = 4;
        }
        if(targetElement === undefined) {
          targetElement = {}
        }
        this.footerItems.splice(sourceIndex + 1, 0, targetElement);
        this.headerItems.splice(targetIndex, 1);
      }
    },
    enableMovement() {
      this.selectedIndex = null
    }
  }
}


