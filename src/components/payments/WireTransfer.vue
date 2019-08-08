<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('wire_transfer')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="wire_transfers_radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div>{{ $t('payment_methods.wire_transfer.hint') | capitalize }}</div>
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
      let btn = document.getElementById('place-order-button')
      btn.onclick = () => {
        this.loading_payment = true
        this.setPaymentSource()
          .then(paymentSource => {
            this.handlePayment()
          })
      }
    },    
    handlePayment () {
      this.$store.dispatch('placeOrder')
        .then(order => {
          this.$router.push({ name: 'confirmation' })
        })
    }
  }
}
</script>

<style>

</style>
