<template>
  <div class="step-wrapper step-wrapper-bordered">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" :edit-icon="editIcon">
      Billing & Shipping
      <small>Add your billing and shipping addresses.</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <OrderBillingAddress />
      <v-card-actions>
        <v-btn color="primary" @click="nextStep" :block="isMobile">Continue to delivery</v-btn>
      </v-card-actions>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import OrderBillingAddress from '@/components/OrderBillingAddress'

export default {
  components: {
    OrderBillingAddress
  },
  mixins: [checkoutStepMixin]
}
</script>

<style>
</style>
