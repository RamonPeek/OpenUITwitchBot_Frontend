import OverlayHeader from '../../components/streamoverlay/OverlayHeader';
import OverlayContent from '../../components/streamoverlay/OverlayContent';
import OverlayFooter from '../../components/streamoverlay/OverlayFooter';
import draggable from "vuedraggable";

export default {
  name: 'streamoverlay',
  components: {
    OverlayHeader,
    OverlayContent,
    OverlayFooter,
    draggable
  },
  props: [],
  data () {
    return {

    }
  },
  computed: {
    items: {
      get() {
        return this.$store.getters.overlayItems
      },
      set(val) {
        console.warn(val);
        this.$store.dispatch("updateOverlayItems", val);
      }
    },
    headerItems: function() {
      let resultItems = [];
      this.items.forEach(element => {
        if(this.items.indexOf(element) >= 0 && this.items.indexOf(element) <= 4) {
          resultItems.push(element);
        }
      });
      return resultItems;
    },
    footerItems: function() {
      let resultItems = [];
      this.items.forEach(element => {
        if(this.items.indexOf(element) >= 5 && this.items.indexOf(element) <= 9) {
          resultItems.push(element);
        }
      });
      return resultItems;
    }
  },
  mounted () {

  },
  methods: {

  }
}


