<template>
  <div class="payment-method">
    <v-radio
      :label="inputLabel('stripe')"
      :value="payment_option.component"
      color="primary"
      @change="setPaymentMethod"
      id="stripe-card-radio"
    ></v-radio>
    <div class="payment-method-fields" v-show="selected">
      <div id="stripe-card"></div>
      <div class="payment-error" id="stripe-card-error"></div>
    </div>
  </div>
</template>

<script>
import { paymentMixin } from '@/mixins/paymentMixin'

export default {
  data () {
    return {
      scriptSrc: 'https://js.stripe.com/v3/'
    }
  },
  mixins: [paymentMixin],
  methods: {
    setupPayment () {
      let script = this.getScript(this.scriptSrc)
      let i18n = this.$i18n

      // Init card element
      script.addEventListener('load', () => {
        let stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY) // eslint-disable-line
        let elements = stripe.elements({ locale: i18n.locale })
        let cardElement = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif'
            }
          }
        })
        cardElement.mount('#stripe-card')

        let btn = document.getElementById('payment-step-submit')
        btn.onclick = () => {
          this.handlePayment(stripe, cardElement)
        }
      })
    },
    handlePayment (stripe, cardElement) {
      this.loading_payment = true
      let that = this

      stripe
        .handleCardPayment(
          this.order.payment_source.client_secret,
          cardElement,
          {
            payment_method_data: {
              billing_details: {
                name: `${that.order.billing_address.first_name} ${that.order.billing_address.last_name}`,
                phone: that.order.billing_address.phone,
                address: {
                  city: that.order.billing_address.city,
                  country: that.order.billing_address.country_code,
                  line1: that.order.billing_address.line_1,
                  postal_code: that.order.billing_address.zip_code,
                  state: that.order.billing_address.state_code
                }
              }
            }
          }
        )
        .then(result => {
          if (result.error) {
            let cardError = document.getElementById('stripe-card-error')
            cardError.innerHTML = result.error.message
            that.loading_payment = false
          } else {
            that.$store.dispatch('placeOrder')
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.StripeElement {
  @include hosted-field;
}
.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}
.StripeElement--invalid {
  border-color: $ERROR_COLOR;
}
.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
