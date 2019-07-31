<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" :edit-icon="editIcon">
      Delivery options
      <small>Review shipments and select a shipping method.</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <v-card-actions>
        <v-btn color="primary" @click="nextStep" :block="isMobile">Continue to payment</v-btn>
      </v-card-actions>
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
