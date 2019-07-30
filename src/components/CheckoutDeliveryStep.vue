<template>
  <div>
    <v-stepper-step :complete="complete" :editable="complete" :step="step" :edit-icon="editIcon">
      Delivery options
      <small>Review shipments and select a shipping method.</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <v-btn color="primary" @click="nextStep" :block="isMobile">Continue to payment</v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
export default {
  mixins: [checkoutStepMixin]
}
</script>

<style>

</style>
