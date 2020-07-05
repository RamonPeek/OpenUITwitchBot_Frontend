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
    headerItems: {
      get() {
        return this.$store.getters.overlayHeaderItems;
      },
      set(val) {
        this.$store.dispatch("updateOverlayHeaderItems", val);
      }
    },
    footerItems: {
      get() {
        return this.$store.getters.overlayFooterItems
      },
      set(val) {
        this.$store.dispatch("updateOverlayFooterItems", val);
      }
    }
  },
  mounted () {

  },
  methods: {

  }
}


