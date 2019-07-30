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
      return this.currentStep > this.step
    },
    isMobile () {
      return this.$vuetify.breakpoint.xs
    },
    editIcon () {
      return this.$vuetify.icons.complete
    },
    ...mapState(['currentStep'])
  },
  methods: {
    nextStep () {
      this.$store.dispatch('setCurrentStep', (this.step + 1))
    }
  }
}
