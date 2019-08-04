<template>
  <div class="payment-method">
    <v-radio
      label="Credit Card (Powered by Adyen)"
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
    setupPayment () {
      console.log(this.order.payment_source)
      this.updateValidations()
    }
  },
  mounted () {
    // Add Adyen.js to document body
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://checkoutshopper-${process.env.VUE_APP_ADYEN_ENV}.adyen.com/checkoutshopper/sdk/3.0.0/adyen.js`
    document.body.insertBefore(script, document.body.firstChild)

    // Add Adyen.css to document head
    let style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = `https://checkoutshopper-${process.env.VUE_APP_ADYEN_ENV}.adyen.com/checkoutshopper/sdk/3.0.0/adyen.css`
    document.head.appendChild(style)
  }
}
</script>

<style>

</style>
