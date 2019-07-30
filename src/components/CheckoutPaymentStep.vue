<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step">
      Payment
      <small>Add a payment method and place the order.</small>
    </v-stepper-step>
    <v-stepper-content :step="step">
      <v-card-actions>
        <v-btn color="primary" @click="placeOrder" :block="isMobile" min-width="50%">Place order</v-btn>
      </v-card-actions>
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
