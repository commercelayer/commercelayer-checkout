<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('paypal')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="paypal_payments_radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit eligendi natus odit ullam, minima ipsa tempore voluptates harum perferendis a doloribus quia hic id voluptatum amet labore expedita sit itaque.
    </div>
  </div>
</template>

<script>
import { paymentMixin } from '@/mixins/paymentMixin'
export default {
  mixins: [paymentMixin],
  methods: {
    paymentSourceAttributes () {
      return {
        return_url: window.location.href,
        cancel_url: window.location.href
      }
    },
    handlePayment (paymentSource) {
      console.log(paymentSource)
    }
  }
}
</script>

<style>

</style>
