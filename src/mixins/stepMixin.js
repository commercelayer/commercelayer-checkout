import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'
import { gtmMixin } from '@/mixins/gtmMixin'

export const stepMixin = {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  mixins: [gtmMixin],
  computed: {
    complete () {
      return this.current_step > this.step
    },
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    ...mapState(['validations']),
    ...mapFields(['current_step'])
  },
  methods: {
    nextStep () {
      this.current_step = this.step + 1
      this.trackCheckoutStep()
    }
  }
}
