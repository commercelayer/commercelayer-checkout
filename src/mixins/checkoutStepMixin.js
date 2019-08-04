import { mapFields } from 'vuex-map-fields'
import { mapState } from 'vuex'

export const checkoutStepMixin = {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
    complete () {
      return this.current_step > this.step
    },
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    editIcon () {
      return this.$vuetify.icons.complete
    },
    ...mapState(['validations']),
    ...mapFields(['current_step'])
  },
  methods: {
    nextStep () {
      this.current_step = (this.step + 1)
    }
  }
}
