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
      <div>{{ $t('payment_methods.paypal.hint') | capitalize }}</div>
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
      let that = this
      let btn = document.getElementById('place-order-button')
      btn.onclick = () => {
        that.loading_payment = true
        this.setPaymentSource()
          .then(paymentSource => {
            this.handlePayment(paymentSource)
          })
          .catch(error => {
            let paypalError = document.getElementById('paypal-payment-error')
            paypalError.innerHTML = error.data.errors[0].detail
            that.loading_payment = false
          })
      }
    },
    handlePayment (paymentSource) {
      window.location = paymentSource.approval_url
    }
  }
}
</script>

<style>

</style>
