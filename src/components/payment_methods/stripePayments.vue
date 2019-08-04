<template>
  <div class="payment-method">
    <v-radio
      label="Credit Card (Powered by Stripe)"
      :value="payment_method"
      @change="setPaymentMethod"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div id="card"></div>
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
    // Add Stripe.js to document head
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://js.stripe.com/v3/'
    document.head.appendChild(script)

    // Init card element
    script.addEventListener('load', () => {
      let stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY) // eslint-disable-line
      let elements = stripe.elements({ locale: 'en' })

      let card = elements.create('card')
      card.mount('#card')
    })
  }
}
</script>

<style>

</style>
