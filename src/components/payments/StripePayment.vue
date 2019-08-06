<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('stripe')"
      :value="payment_method"
      color="primary"
      @change="setPaymentMethod"
      id="stripe_payments_radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div id="card"></div>
    </div>
  </div>
</template>

<script>
import { paymentMethodMixin } from '@/mixins/paymentMethodMixin'

export default {
  data () {
    return {
      scriptSrc: 'https://js.stripe.com/v3/'
    }
  },
  mixins: [paymentMethodMixin],
  methods: {
    handlePayment () {
      console.log('handle stripe payment')
      // this.setPaymentSource()
      //   .then(paymentSource => {
      //     console.log(paymentSource.client_secret)
      //   })
    },
    checkScript () {
      let scripts = document.getElementsByTagName('script')
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === this.scriptSrc) return true
      }
      return false
    }
  },
  mounted () {
    // Add Stripe.js to document head if not exists
    if (!this.checkScript()) {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = this.scriptSrc
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
}
</script>

<style>

</style>
