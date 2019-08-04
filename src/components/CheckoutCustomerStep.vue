<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step" :complete="complete" :editable="complete" :edit-icon="editIcon">
      Customer
      <small>Add your billing information and delivery address</small>
    </v-stepper-step>

    <v-stepper-content :step="step">
      <OrderCustomer />
      <OrderBillingAddress />
      <OrderShippingAddress />
      <v-btn
        color="primary"
        @click="nextStep"
        :block="isMobile"
        :disabled="disabled">
          Continue to delivery
      </v-btn>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import OrderCustomer from '@/components/OrderCustomer'
import OrderBillingAddress from '@/components/OrderBillingAddress'
import OrderShippingAddress from '@/components/OrderShippingAddress'

export default {
  components: {
    OrderCustomer,
    OrderBillingAddress,
    OrderShippingAddress
  },
  mixins: [checkoutStepMixin],
  computed: {
    disabled () {
      return this.validations.invalid_customer || this.validations.invalid_billing_address || this.validations.invalid_shipping_address
    }
  }
}
</script>

<style>
</style>
