<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('paypal')"
      :value="payment_option.component"
      color="primary"
      @change="setPaymentMethod"
      id="paypal-payments-radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div id="paypal-payment-hint">{{ $t('payment_methods.paypal.hint') | capitalize }}</div>
      <div class="payment-error" id="paypal-payment-error"></div>
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
        return_url: window.location.href + '/paypal',
        cancel_url: window.location.href
      }
    },
    setupPayment () {
      let btn = document.getElementById('payment-step-submit')
      btn.onclick = () => {
        this.handlePayment()
      }
    },
    handlePaymentSourceError (error) {
      let paypalError = document.getElementById('paypal-payment-error')
      paypalError.innerHTML = error.data.errors[0].detail
      this.loading_payment = false
    },
    handlePayment () {
      this.loading_payment = true
      window.location = this.order.payment_source.approval_url
    }
  }
}
</script>

<style>
</style>
