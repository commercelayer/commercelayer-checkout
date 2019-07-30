<template>
  <div>
    <v-stepper-step :complete="currentStep > step" :editable="currentStep > step" :step="step" edit-icon="$vuetify.icons.complete">
      Delivery options
      <small>Review shipments and select a shipping method.</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <v-btn color="primary" @click="nextStep" :block="$vuetify.breakpoint.xs">Continue to payment</v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['currentStep'])
  },
  methods: {
    nextStep () {
      this.$store.dispatch('setCurrentStep', (this.step + 1))
    }
  }
}
</script>

<style>

</style>
