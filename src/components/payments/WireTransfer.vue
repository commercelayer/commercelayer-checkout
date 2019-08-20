<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('wire_transfer')"
      :value="payment_option.component"
      color="primary"
      @change="setPaymentMethod"
      id="wire-transfers-radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div
        id="wire-transfer-payment-hint"
      >{{ $t('payment_methods.wire_transfer.hint') | capitalize }}</div>
      <div class="payment-error" id="wire-transfer-payment-error"></div>
    </div>
  </div>
</template>

<script>
import { paymentMixin } from '@/mixins/paymentMixin'
export default {
  mixins: [paymentMixin],
  methods: {
    setupPayment () {
      let btn = document.getElementById('payment-step-submit')
      btn.onclick = () => {
        this.handlePayment()
      }
    },
    handlePayment () {
      this.loading_payment = true
      this.$store
        .dispatch('placeOrder')
        .then(order => {
          this.$router.push({ name: 'confirmation' })
        })
        .catch(response => {
          let errorElement = document.getElementById(
            'wire-transfer-payment-error'
          )
          errorElement.innerHTML = this.$t(
            'errors.' + response.data.errors[0].meta.error
          )
          this.loading_payment = false
        })
    }
  }
}
</script>

<style>
</style>
