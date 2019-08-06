<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('braintree')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="braintree_payments_radio"
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
    handlePayment (paymentSource) {
      console.log(paymentSource.client_token)
    }
  }
}
</script>

<style>

</style>
