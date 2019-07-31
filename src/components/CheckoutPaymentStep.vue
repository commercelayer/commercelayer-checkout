<template>
  <div class="step-wrapper">
    <v-stepper-step :step="step">
      Payment
      <small>Add a payment method and place the order.</small>
    </v-stepper-step>
    <v-stepper-content :step="step">

      <component
        v-for="payment_method in order.available_payment_methods"
        :is="payment_method.payment_source_type"
        :key="payment_method.id"
        />

      <v-card-actions>
        <v-btn color="primary" @click="placeOrder" :block="isMobile" min-width="50%">Place order</v-btn>
      </v-card-actions>
    </v-stepper-content>
  </div>
</template>

<script>
import { checkoutStepMixin } from '@/mixins/checkoutStepMixin'
import StripePayment from '@/components/payment_methods/StripePayment'
import BraintreePayment from '@/components/payment_methods/BraintreePayment'
import AdyenPayment from '@/components/payment_methods/AdyenPayment'
import PaypalPayment from '@/components/payment_methods/PaypalPayment'
import WireTransfer from '@/components/payment_methods/WireTransfer'
import CreditCard from '@/components/payment_methods/CreditCard'

export default {
  components: {
    StripePayment,
    BraintreePayment,
    AdyenPayment,
    PaypalPayment,
    WireTransfer,
    CreditCard
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
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
