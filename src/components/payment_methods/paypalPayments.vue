<template>
  <div class="payment-method">
    <v-radio
      label="PayPal"
      :value="payment_method"
      @change="setPaymentMethod"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit eligendi natus odit ullam, minima ipsa tempore voluptates harum perferendis a doloribus quia hic id voluptatum amet labore expedita sit itaque.
    </div>
  </div>
</template>

<script>
import { paymentMethodMixin } from '@/mixins/paymentMethodMixin'
export default {
  mixins: [paymentMethodMixin],
  methods: {
    paymentSourceAttributes () {
      return {
        return_url: window.location.href,
        cancel_url: window.location.href
      }
    },
    setupPayment () {
      console.log(this.order.payment_source)
      this.updateValidations()
    }
  }
}
</script>

<style>

</style>
