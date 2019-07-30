<template>
  <div>
    <v-stepper-step :step="step">
      Payment
      <small>Add a payment method and place the order.</small>
    </v-stepper-step>
    <v-stepper-content :step="step">
      <v-btn color="primary" @click="placeOrder" :block="isMobile">Place order</v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
export default {
  mixins: [checkoutStepMixin],
  methods: {
    placeOrder () {
      this.$store.dispatch('setCurrentStep', 1)
    }
  }
}
</script>

<style>

</style>
