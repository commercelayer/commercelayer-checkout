<template>
  <div>
    <v-stepper-step :step="step">
      Payment
      <small>Add a payment method and place the order.</small>
    </v-stepper-step>
    <v-stepper-content :step="step">
      <v-btn color="primary" @click="placeOrder" :block="$vuetify.breakpoint.xs">Place order</v-btn>
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
    placeOrder () {
      this.$store.dispatch('setCurrentStep', 1)
    }
  }
}
</script>

<style>

</style>
